# Shavit Rootman — complete work handoff

Private archive of Jake's Shavit website, design, marketing, content, editing and operating work, assembled **September 8, 2026** for the person taking over.

**[Media delivery status](handoff/UPLOAD-STATUS.md)** — check here before downloading the full media set.

**Start with [START HERE](handoff/START-HERE.md).** The code, written specs, PDFs, captions and guides are browsable here. Original photos, video/audio, render frames and editor media are attached to this repository's private [handoff release](https://github.com/jakehorvitz/shavit-handoff/releases/tag/handoff-2026-09-08). They restore to their original project-relative locations with the command below. The inventory includes finished work, alternatives, experiments and unfinished drafts; an archived file is not evidence of permission to publish it.

## Get the files

```sh
gh repo clone jakehorvitz/shavit-handoff
cd shavit-handoff
python3 tools/restore_media.py
python3 tools/restore_media.py --verify
```

Requires Python 3.9+ and GitHub CLI authenticated to an account with access to this private repo. For only the website's media, use `python3 tools/restore_media.py --prefix projects/shavit-rootman-website/`. Source and media paths, sizes and SHA-256 checksums are in [the file catalog](catalog/files.json). Downloads are deduplicated in the release and restored to every recorded location. Existing edited files are never overwritten. Full restore needs roughly 60 GiB free while downloads and extracted cache coexist; after a successful `--verify`, the `.handoff-cache` directory can be removed.

**[Browse the visual design gallery](gallery/README.md)** — carousel review sheets, covers and announcement artwork.

## Find the work

| Area | Start here |
|---|---|
| Current website | [Production source](projects/shavit-rootman-website/site/) · [website guide](handoff/WEBSITE-AND-DESIGNS.md) |
| Brand and working process | [Current rules](projects/shavit-pipeline/rules/brand.md) · [operator guide](handoff/OPERATING-GUIDE.md) · [creative register](handoff/CREATIVE-REGISTER.md) |
| Reels, carousels, caption and review pipeline | [Content pipeline](projects/shavit-pipeline/) · [media guide](handoff/MEDIA-AND-EDITING.md) |
| Instagram, LinkedIn and Facebook designs | [Instagram/social remodel](projects/shavit-instagram/) · [Facebook suite](projects/shavit-facebook-suite/) |
| Website and Kendall product reels, Mead teaser | [Editable work and all variants](projects/shavit-product-edit/docs/product-edit/) |
| August recap | [Recap specs, scripts and exports](projects/shavit-august-2026-recap/) · [Palmier portability](handoff/PALMIER.md) |
| Longform and River Street films | [Longform](projects/shavit-longform-film/) · [River Street](projects/shavit-match-cut-tour/) |
| Final delivery folders, raw footage, staff, carousels | [Delivery archive](deliverables/) · [Mead download package](downloads/) |
| August competitor research | [Dated source report](research/research-shavit-competitors-2026-08-29.md) |
| Original marketing strategy, analytics and automation | [June marketing engine](legacy/marketing-engine/) · [proposal/design versions](legacy/proposals/) |
| History, decisions and unfinished work | [Work history](handoff/HISTORY-AND-DECISIONS.md) · [known gaps](handoff/KNOWN-GAPS.md) |
| Contents and exclusions | [Coverage](catalog/COVERAGE.md) · [source map](catalog/sources.json) · [exclusions](catalog/excluded.json) |

The September 7 website snapshot is the current website source; `shavit-product-edit/site` and the Desktop website copies are historical alternatives. Old spec and setup documents describe earlier decisions. Read the handoff guides before acting on them.

No credentials, raw private conversations, personal career strategy, or original Git databases are included. Account access is transferred separately. Keep this repository private. Source photos and reference music retain their original ownership and use restrictions.
