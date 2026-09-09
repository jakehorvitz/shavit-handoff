#!/usr/bin/env python3
"""Make an editable Palmier copy and relink archived paths to restored media."""
import argparse
import json
from pathlib import Path
import shutil
import sys

from restore_media import safe_path


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="Repository root")
    parser.add_argument("--output", required=True, type=Path, help="New directory for editable Palmier packages")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    source = root / "editors/palmier"
    output = args.output.expanduser().absolute()
    if output.exists() or output.is_symlink():
        raise ValueError(f"Output already exists; preserved: {output}")
    output = output.resolve()
    if output.is_relative_to(source.resolve()):
        raise ValueError("Output cannot be inside the archived Palmier packages")
    if not source.is_dir() or source.is_symlink():
        raise ValueError("editors/palmier is missing; restore the archive first")
    with (root / "catalog/palmier-path-map.json").open(encoding="utf-8") as stream:
        path_map = json.load(stream)
    if not isinstance(path_map, dict):
        raise ValueError("palmier-path-map.json must be an object")
    mappings = []
    for old, relative in path_map.items():
        if not isinstance(old, str) or not old.startswith("/"):
            raise ValueError("Path-map keys must be absolute source paths")
        target = safe_path(root, relative)
        mappings.append((old.rstrip("/"), target))
    mappings.sort(key=lambda item: len(item[0]), reverse=True)

    # Preflight all source links before copying, and JSON before producing output.
    source_links, documents = [], []
    for path in source.rglob("*"):
        if path.is_symlink():
            resolved = path.resolve()
            if not resolved.is_relative_to(root):
                raise ValueError(f"Source symlink escapes repository: {path.relative_to(root)}")
            source_links.append((path, resolved))
        elif path.is_file() and path.suffix.lower() == ".json":
            with path.open(encoding="utf-8") as stream:
                documents.append((path, json.load(stream)))

    counts = {"replaced": 0, "mapped_missing": set(), "unknown_missing": set()}

    def destination(target):
        if target.is_relative_to(source):
            return output / target.relative_to(source)
        return target

    def replace(value):
        if isinstance(value, dict):
            return {key: replace(item) for key, item in value.items()}
        if isinstance(value, list):
            return [replace(item) for item in value]
        if not isinstance(value, str):
            return value
        for old, target in mappings:
            if value == old or value.startswith(old + "/"):
                suffix = value[len(old):].lstrip("/")
                resolved = target / suffix if suffix else target
                if not resolved.resolve().is_relative_to(root):
                    raise ValueError(f"Mapped JSON path escapes repository: {value}")
                if not resolved.exists():
                    counts["mapped_missing"].add(str(resolved.relative_to(root)))
                counts["replaced"] += 1
                return str(destination(resolved))
        if value.startswith(("/", "~/")) and not Path(value).expanduser().exists():
            counts["unknown_missing"].add(value)
        return value

    rewritten = [(path, replace(data)) for path, data in documents]
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, output, symlinks=True)
    for original, target in source_links:
        copied = output / original.relative_to(source)
        copied.unlink()
        copied.symlink_to(destination(target), target_is_directory=target.is_dir())
    for original, data in rewritten:
        copied = output / original.relative_to(source)
        with copied.open("w", encoding="utf-8") as stream:
            json.dump(data, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
    report = {
        "json_files": len(rewritten), "replaced_values": counts["replaced"],
        "mapped_missing_count": len(counts["mapped_missing"]),
        "mapped_missing": sorted(counts["mapped_missing"]),
        "unknown_missing_count": len(counts["unknown_missing"]),
        "unknown_missing": sorted(counts["unknown_missing"]),
    }
    report_path = output / "relink-report.json"
    # Do not overwrite a package's own existing report, if one was archived.
    if report_path.exists():
        report_path = output.parent / (output.name + "-relink-report.json")
    with report_path.open("x", encoding="utf-8") as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    print(f"Editable copy: {output}")
    print(f"Relinked {counts['replaced']} JSON values in {len(rewritten)} files.")
    print(f"Missing references: {len(counts['mapped_missing'])} mapped, {len(counts['unknown_missing'])} unknown.")
    print(f"Details: {report_path}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
