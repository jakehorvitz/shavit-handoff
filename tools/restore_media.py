#!/usr/bin/env python3
"""Restore hashed media from this private repository's GitHub release using gh."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tarfile
import tempfile

HASH = re.compile(r"[0-9a-f]{64}\Z")
CHUNK = 1024 * 1024


def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(CHUNK), b""):
            h.update(block)
    return h.hexdigest()


def load(path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def safe_path(root, value):
    """Catalog paths are POSIX paths relative to the repository, never escapes."""
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        raise ValueError(f"Invalid catalog path: {value!r}")
    rel = PurePosixPath(value)
    if rel.is_absolute() or any(p in {"", ".", ".."} for p in value.split("/")):
        raise ValueError(f"Unsafe catalog path: {value!r}")
    if rel.parts[0] in {".git", ".handoff-cache"}:
        raise ValueError(f"Reserved catalog path: {value!r}")
    path = root.joinpath(*rel.parts)
    if not path.resolve().is_relative_to(root):
        raise ValueError(f"Path escapes repository through a symlink: {value}")
    return path


def correct(path, size, digest):
    return (not path.is_symlink() and path.is_file()
            and path.stat().st_size == size and sha256(path) == digest)


def validate_files(root, rows):
    if not isinstance(rows, list):
        raise ValueError("files.json must be a list")
    names, sizes = set(), {}
    for row in rows:
        safe_path(root, row["path"])
        digest, size = row["sha256"], row["bytes"]
        if not isinstance(digest, str) or not HASH.fullmatch(digest):
            raise ValueError("Invalid file SHA-256 in catalog")
        if type(size) is not int or size < 0 or row["storage"] not in {"git", "release"}:
            raise ValueError("Invalid file size or storage in catalog")
        if row["path"] in names:
            raise ValueError(f"Duplicate catalog path: {row['path']}")
        if digest in sizes and sizes[digest] != size:
            raise ValueError("One digest has conflicting catalog sizes")
        names.add(row["path"])
        sizes[digest] = size
    return sizes


def validate_releases(data, sizes):
    index = {}
    names = set()
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", data["repo"]):
        raise ValueError("Invalid GitHub repository in release catalog")
    if not isinstance(data["tag"], str) or not data["tag"] or data["tag"].startswith("-"):
        raise ValueError("Invalid release tag")
    for archive in data["archives"]:
        name = archive["name"]
        if (not isinstance(name, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*\.tar", name)
                or name in names):
            raise ValueError(f"Invalid or duplicate archive name: {name!r}")
        if (type(archive["bytes"]) is not int or archive["bytes"] < 0
                or not isinstance(archive["sha256"], str)
                or not HASH.fullmatch(archive["sha256"])):
            raise ValueError("Invalid archive size or SHA-256")
        names.add(name)
        for digest in archive["blobs"]:
            if not isinstance(digest, str) or not HASH.fullmatch(digest) or digest not in sizes:
                raise ValueError("Unknown or invalid blob in release catalog")
            if digest in index:
                raise ValueError("Blob listed in multiple archives")
            index[digest] = archive
    return index


def get_archive(archive, release, cache, from_dir):
    path = (from_dir if from_dir else cache) / archive["name"]
    if not path.exists() and not path.is_symlink():
        if from_dir:
            raise ValueError(f"Local archive missing: {path}")
        cache.mkdir(parents=True, exist_ok=True)
        print(f"Downloading {archive['name']}...", flush=True)
        with tempfile.TemporaryDirectory(prefix="download-", dir=cache) as tmp:
            subprocess.run(["gh", "release", "download", release["tag"], "--repo", release["repo"],
                            "--pattern", archive["name"], "--dir", tmp], check=True)
            downloaded = Path(tmp) / archive["name"]
            if not correct(downloaded, archive["bytes"], archive["sha256"]):
                raise ValueError(f"Downloaded archive failed SHA-256/size check: {archive['name']}")
            # link() fails rather than replacing a concurrently created cache file.
            try:
                os.link(downloaded, path)
            except FileExistsError:
                pass
    if not correct(path, archive["bytes"], archive["sha256"]):
        raise ValueError(f"Archive failed SHA-256/size check (preserved): {path}")
    return path


def write_blob(stream, destination, size, digest):
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(prefix=".restore-", dir=destination.parent, delete=False) as out:
            temporary = Path(out.name)
            h, total = hashlib.sha256(), 0
            for block in iter(lambda: stream.read(CHUNK), b""):
                total += len(block)
                if total > size:
                    raise ValueError("Blob exceeds its catalog size")
                h.update(block)
                out.write(block)
        if total != size or h.hexdigest() != digest:
            raise ValueError(f"Blob failed SHA-256/size check: {digest}")
        try:
            os.link(temporary, destination)
        except FileExistsError:
            if not correct(destination, size, digest):
                raise ValueError(f"Existing file differs; preserved: {destination}")
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def read_blobs(path, archive, needed, sizes, blob_dir):
    expected, seen = set(archive["blobs"]), set()
    # Never extract paths from the tar. Only stream validated regular-file members.
    with tarfile.open(path, "r|*") as tar:
        for member in tar:
            match = re.fullmatch(r"blobs/([0-9a-f]{64})", member.name)
            if not member.isfile() or not match:
                raise ValueError(f"Unsafe tar member: {member.name!r}")
            digest = match.group(1)
            if digest not in expected or digest in seen or member.size != sizes[digest]:
                raise ValueError(f"Unexpected, duplicate, or wrong-sized tar blob: {member.name}")
            seen.add(digest)
            if digest in needed:
                destination = blob_dir / digest
                if destination.exists() or destination.is_symlink():
                    if not correct(destination, sizes[digest], digest):
                        raise ValueError(f"Corrupt blob cache preserved: {destination}")
                else:
                    stream = tar.extractfile(member)
                    if stream is None:
                        raise ValueError(f"Unreadable tar member: {member.name}")
                    with stream:
                        write_blob(stream, destination, sizes[digest], digest)
    if seen != expected:
        raise ValueError(f"Archive is missing catalogued blobs: {path.name}")


def restore_links(root, rows, prefix, verify):
    errors, restored = [], 0
    for row in rows:
        path = safe_path(root, row["path"])
        target = safe_path(root, row["target"])
        if target == path or target.is_relative_to(path):
            raise ValueError(f"Cyclic symlink target: {row['path']}")
        if not row["path"].startswith(prefix):
            continue
        if path.is_symlink():
            if path.resolve() != target.resolve():
                errors.append(f"Changed link preserved: {row['path']}")
        elif path.exists():
            errors.append(f"Existing non-link preserved: {row['path']}")
        elif target.exists():
            if verify:
                errors.append(f"Missing link: {row['path']}")
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                safe_path(root, row["path"])
                path.symlink_to(os.path.relpath(target, path.parent), target_is_directory=target.is_dir())
                restored += 1
        else:
            print(f"Link deferred; target not restored: {row['path']}")
    return restored, errors


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="Repository root")
    parser.add_argument("--prefix", default="", help="Restore only catalog paths starting with this text")
    parser.add_argument("--from-dir", type=Path, help="Read release tar files locally; never download")
    parser.add_argument("--cache-dir", type=Path, help="Archive/blob cache (default: ROOT/.handoff-cache)")
    parser.add_argument("--verify", action="store_true", help="Check restored files and links without writes or downloads")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    rows = load(root / "catalog/files.json")
    sizes = validate_files(root, rows)
    selected = [row for row in rows if row["path"].startswith(args.prefix)]
    if not selected:
        raise ValueError("Prefix matched no catalog files")
    missing, problems, verified = [], [], 0
    for row in selected:
        path = safe_path(root, row["path"])
        if path.exists() or path.is_symlink():
            if correct(path, row["bytes"], row["sha256"]):
                verified += 1
            else:
                problems.append(f"Existing file differs; preserved: {row['path']}")
        elif args.verify or row["storage"] == "git":
            problems.append(f"Missing {row['storage']} file: {row['path']}")
        else:
            missing.append(row)
    if problems:
        raise ValueError("\n".join(problems))
    if missing:
        release = load(root / "catalog/releases.json")
        index = validate_releases(release, sizes)
        needed = {row["sha256"] for row in missing}
        if needed - index.keys():
            raise ValueError("Release catalog does not cover all requested media")
        cache = (args.cache_dir if args.cache_dir else root / ".handoff-cache").resolve()
        blob_dir = cache / "blobs"
        if blob_dir.is_symlink():
            raise ValueError("Blob cache directory cannot be a symlink")
        blob_dir.mkdir(parents=True, exist_ok=True)
        archives = {index[d]["name"]: index[d] for d in needed}
        for archive in archives.values():
            path = get_archive(archive, release, cache, args.from_dir.resolve() if args.from_dir else None)
            read_blobs(path, archive, needed, sizes, blob_dir)
        for row in missing:
            destination = safe_path(root, row["path"])
            with (blob_dir / row["sha256"]).open("rb") as stream:
                write_blob(stream, destination, row["bytes"], row["sha256"])
    links_path = root / "catalog/symlinks.json"
    links = load(links_path) if links_path.exists() else []
    restored_links, problems = restore_links(root, links, args.prefix, args.verify)
    if problems:
        raise ValueError("\n".join(problems))
    print(f"Verified {verified} existing files; restored {len(missing)} files and {restored_links} links.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError, subprocess.CalledProcessError, tarfile.TarError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
