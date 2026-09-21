# Changelog

Notable changes to this project are documented here, starting at 3.0.0 —
earlier history isn't backfilled; see `git log`/tags for that. Format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions
follow [Semantic Versioning](https://semver.org/).

## [3.0.0]

### Breaking

- `createQuadMap(w, h, res)` and `QuadMap.setResolution(res)`, called with
  no second argument, no longer build a square `res x res` mesh. `res` is
  now a **target pixel spacing** between adjacent mesh vertices (default
  `40`) — divisions per axis are `round(dimension / res)`, derived
  independently from that axis's own width/height and clamped to
  `[2, 200]`. Mesh density now stays visually consistent across
  differently-sized or differently-shaped quads without needing `res`
  hand-tuned per surface, instead of a fixed division count that
  stretched to match whatever shape the quad happened to be.
- This changes mesh vertex count/indexing for **every** `QuadMap` built
  without an explicit second argument — square or not, small or large.
  **Existing saved corner-pin calibrations need to be redone after
  upgrading** unless you pass the old literal resolution explicitly as
  both arguments (see the escape hatch below) — the surface won't error,
  it'll just warp wrong, since the saved corner indices now point at
  different mesh points.
- This directly affects the common "flat quad for a solid-color fill"
  pattern (e.g. `createQuadMap(w, h, 2)`): `2` used to mean "a flat 2x2
  grid, just the 4 corners." Under pixel-spacing semantics it instead
  means "a vertex every 2px" — a *very* fine mesh, the opposite of what
  that pattern wants.
- Escape hatch: pass a second argument to `createQuadMap()` /
  `setResolution()` (e.g. `createQuadMap(w, h, 2, 2)`) to bypass the
  pixel-spacing calculation entirely and set literal division counts on
  both axes manually. This reproduces the exact old grid for any
  previous `res` value (`createQuadMap(w, h, 20, 20)` for an old default
  quad, `createQuadMap(w, h, 2, 2)` for an old flat one) and is
  unaffected by any future change to the spacing formula.
- `TriMap` is unaffected either way — it never tessellates, so its `res`
  only ever placed the apex control point and keeps its old meaning.
- A one-time `console.warn` fires the first time a `QuadMap` is built (or
  `setResolution()` is called) without the second argument, pointing back
  here. This is temporary scaffolding for the upgrade window and will be
  removed in a future version once 3.0.0 has been out a while
  (tentatively planned for removal ~early 2027 — check this file's
  history if you're wondering whether it's still there).

### Added

- `QuadMap`, `ProjectionMapper.createQuadMap()`, and `CornerPinSurface`
  now support independent `resX`/`resY` mesh resolution (previously
  always a single square `res` internally, even though `resX`/`resY`
  fields existed on `QuadMap`) via the escape-hatch second argument
  described above.
