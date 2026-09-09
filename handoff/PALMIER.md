# Palmier editable masters

Sixteen recovered project packages preserve the timeline work, including historical held/blocked variants. JSON metadata is in Git; thumbnails, waveforms and original media are restored from the private release. See `catalog/palmier-projects.json` for timeline IDs and saved timestamps.

## Latest editing state

- **Shavit Reels - Aug 2026.palmier**: 26 timelines. Saved September 6, 2026 at 12:52 local time. Active timeline **AUGUST 2026 RECAP · v4 (tight, full-bleed)**, ID `05D72676-6EAF-4CF1-B351-F5776A6B7FC3`. This saved editing state is newer than some v7 rendered-file labels.
- **Shavit Montage of Current Project Reels.palmier**: July montage master and alternatives.
- **Shavit Mead Teaser.palmier**: editable Mead teaser.
- **Shavit New Videos - Aug 17.palmier**: later field/lawn-care source and rough-cut alternatives. Includes linked oak-lane-landscaping footage.
- **Shavit Website Edit - The Turn (previs).palmier**: previs, separate from the source-rendered product edits.
- The August 5 archive preserves individual A/B/C projects with their original historical labels. “New Shavit Stuff” is a near-empty package, preserved for completeness.

## Open a portable editing copy

1. Run `python3 tools/restore_media.py` from the repository root.
2. Run `python3 tools/relink_palmier.py --output /absolute/path/to/shavit-editable-copy`. Choose a new directory outside iCloud Desktop/Documents.
3. Open the desired copied `.palmier` package in Palmier Pro, verify the chosen timeline, missing-media indicators, fonts, image selection, type placement and sound.
4. Export a short sample before a full export. Do not edit the archived originals or treat successful relinking as playback/export validation.

The helper copies packages to a new folder and rewrites recorded absolute paths to restored media. It never changes the archived master. `catalog/palmier-path-map.json` is the explicit mapping.

## Missing historical originals

The package inventory recorded **30 missing original path references**, including deleted temporary screenshots, old concept plates and music aliases. The missing-use audit found **zero missing-source IDs used by the currently active timeline in any recovered package**. Historical A4/B1/E3 and an Aug17 rough-cut alternative use some missing references. This is a path/ID-use check, not a successful render of all timelines.

Some similarly named files exist elsewhere (music or HEIC copies). They are listed as unverified candidates rather than silently substituted. Missing inactive items may still appear in an editor's media library after relinking. See `catalog/palmier-missing-media.json` and `catalog/palmier-missing-usage.json`.
