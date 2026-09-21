# Changelog

Notable changes to this project are documented here, starting at 3.0.0 —
earlier history isn't backfilled; see `git log`/tags for that. Format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions
follow [Semantic Versioning](https://semver.org/).

## [3.0.0]

### Breaking

- `createQuadMap(w, h, res)` and `QuadMap.setResolution(res)`, called with
  no `resY`, no longer build a square `res x res` mesh. `res` now sets
  mesh density along the surface's shorter axis, and the longer axis is
  auto-scaled by the surface's own aspect ratio (capped at 200) so mesh
  cells stay roughly square instead of stretching to match an elongated
  quad's shape.
- This changes mesh vertex count/indexing for any non-square `QuadMap`.
  **Existing saved corner-pin calibrations for non-square quads need to be
  redone after upgrading** — the surface won't error, it'll just warp
  wrong, since the saved corner indices now point at different mesh
  points.
- Escape hatch: pass `resY` explicitly to `createQuadMap()` /
  `setResolution()` (e.g. `createQuadMap(w, h, 20, 20)`) to bypass the
  auto-scaling and set both axes manually — this reproduces the exact old
  square grid regardless of the surface's aspect ratio, and is unaffected
  by any future change to the auto-scaling formula.
- `TriMap` is unaffected either way — it never tessellates, so its `res`
  only ever placed the apex control point.

### Added

- `QuadMap`, `ProjectionMapper.createQuadMap()`, and `CornerPinSurface`
  now support independent `resX`/`resY` mesh resolution (previously
  always a single square `res` internally, even though `resX`/`resY`
  fields existed on `QuadMap`).
