# Release Notes

## Version 2.2.0
Requires p5.js 2.x.

#### Changes
* **Performance: calibration mode FPS fix** — QuadMap calibration grid is now rendered to an offscreen buffer and cached, only rebuilt when control points move. Previously it re-tessellated the full mesh every frame, halving FPS on entry.
* **Performance: sketch display FPS fix** — Eliminated closure allocations inside `emitQuadAsTrianglesUV/Outline`, which created ~22,000 closures/second per surface and triggered frequent GC pauses.
* **Bug fix: BezierMap shared buffer corruption** — Each BezierMap now owns its own mask buffer. Previously all instances shared a single global buffer; moving one Bezier's boundary would corrupt the mask for all others until they were individually interacted with.
* **TypeScript** — Full TypeScript rewrite with type declarations.

---

## Version 2.0.0 / 2.1.0
Rewritten in TypeScript. Requires p5.js 2.x.

---

## Version 1.1.0
Working with p5.js 1.9.0.

#### Changes

* Mouse coordinates in WEBGL mode use the 2D-mode origin rather than the canvas center — fixed the resulting hit-test offset.
* Fixed an issue with the Bezier output buffer not clearing correctly.

---

## Version 1.0.0
Worked with p5.js 1.5.0.

