# Shavit Property Edit Tracker

Tracks which Shavit Rootman properties have been used in a **real** edit vs. which are still available.

## The rule
When Jake says **"build me a Shavit edit"**, pull source photos from properties marked `AVAILABLE` in
[property-edit-tracker.csv](property-edit-tracker.csv) — **do not reuse a `USED` property**. After shipping a
real edit, flip that property's row to `USED` and fill in `edit_type`, `edit_project`, and `date`.

Lots of mock/throwaway edits have been made — those don't count. Only edits Jake actually uses get marked `USED`.

## Status
- **USED (1):** River Street (Hillsdale, MI) — the one real edit. Before→after dissolve, `shavit-longform-film`.
- **AVAILABLE (9):** 34 Mead St, 2217 Parkview, Cleveland Heights, West Side, 61 Salem St, Larchmere Duplex,
  East Saint Joe, Budlong St, Second Chance Ranch.

## Photo library
Source stills: `~/projects/shavit-rootman-website/site/staging-assets/original-properties/`
(filenames match the `source_photo` column in the CSV).
