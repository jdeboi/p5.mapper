import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";
import pMapper from "../ProjectionMapper";

// type PerspectiveFn = (x: number, y: number) => [number, number];

// Clamp on divisions per axis when they're derived from pixel spacing (see
// computeAxisRes) — without this, a very fine spacing on a large surface
// (or a tiny spacing value on any surface) would silently balloon into
// thousands of vertices.
const MAX_AXIS_RES = 200;

// Printed once (not per-surface) the first time a QuadMap is built without
// an explicit resY, so anyone upgrading past 3.0.0 without reading the
// changelog still finds out `res` changed meaning before they wonder why
// their mesh looks wrong. TODO: remove this once 3.0.0 has been out a
// couple of months (tentatively ~end of 2026).
let hasWarnedAboutResSemantics = false;
function warnAboutResSemanticsOnce(): void {
  if (hasWarnedAboutResSemantics) return;
  hasWarnedAboutResSemantics = true;
  console.warn(
    "p5.mapper 3.0.0: QuadMap's `res` argument now means target pixel " +
      "spacing between mesh vertices, not a fixed division count — a " +
      "single `res` no longer builds a flat `res x res` grid regardless " +
      "of the quad's size. Divisions per axis are now derived from the " +
      "quad's own width/height (round(dimension / res), clamped 2-" +
      MAX_AXIS_RES +
      "). If you want the exact old literal grid (e.g. a flat, " +
      "untessellated quad for a solid-color fill via res=2), pass it as " +
      "both resX and resY explicitly: createQuadMap(w, h, 2, 2) — that " +
      "bypasses the spacing calculation entirely. See CHANGELOG.md."
  );
}

export default class QuadMap extends CornerPinSurface {
  /** Throttle for the interior-point-rejection diagnostic warning below. */
  private _lastRejectLogAt = -Infinity;

  /**
   * Cached render mesh (WEBGL only — buildGeometry/model aren't available in P2D).
   * Rebuilt when the mesh changes or the requested UV rect differs from last time.
   */
  private _geom: any | null = null;
  private _geomDirty = true;
  private _geomIsUV = false;
  private _geomU0 = 0;
  private _geomV0 = 0;
  private _geomU1 = 1;
  private _geomV1 = 1;

  constructor(
    id: string | number,
    w: number,
    h: number,
    res: number,
    buffer: any,
    pInst: any,
    resY?: number
  ) {
    const axis =
      resY !== undefined
        ? { resX: Math.max(2, Math.floor(res)), resY: Math.max(2, Math.floor(resY)) }
        : (warnAboutResSemanticsOnce(), QuadMap.computeAxisRes(res, w, h));
    super(id, w, h, axis.resX, "QUAD", buffer, pInst, axis.resY);
  }

  /**
   * `res` is a target pixel spacing between adjacent mesh vertices, not a
   * division count — divisions per axis are `round(dimension / res)`,
   * independently for width and height, each clamped to [2, MAX_AXIS_RES].
   * A quad twice as wide as another gets roughly twice the horizontal
   * divisions for the same `res`, so mesh density stays visually
   * consistent regardless of a surface's absolute size or aspect ratio,
   * instead of needing `res` hand-tuned per surface (e.g. a small painting
   * vs. a large wall panel). Pass `resY` explicitly (to the constructor or
   * setResolution()) to bypass this entirely and set literal division
   * counts on both axes — e.g. `createQuadMap(w, h, 2, 2)` for the
   * cheapest possible flat quad (a solid-color fill looks identical at
   * any resolution, so there's no reason to pay for interior vertices).
   */
  private static computeAxisRes(
    res: number,
    w: number,
    h: number
  ): { resX: number; resY: number } {
    if (!(w > 0) || !(h > 0)) return { resX: 2, resY: 2 };

    const spacing = Math.max(0.001, res);
    const resX = Math.min(MAX_AXIS_RES, Math.max(2, Math.round(w / spacing)));
    const resY = Math.min(MAX_AXIS_RES, Math.max(2, Math.round(h / spacing)));
    return { resX, resY };
  }

  /**
   * Returns true if the mouse is over this surface.
   * We test in *local* space (mouse - surface origin) against the two triangles.
   */
  public isMouseOver(): boolean {
    const { x, y } = this.getMouseCoords();
    const mx = x - this.x;
    const my = y - this.y;

    // Two-triangle quad: TL-TR-BL and BL-TR-BR
    return (
      this.isPointInTriangle(
        mx,
        my,
        this.mesh[this.TL],
        this.mesh[this.TR],
        this.mesh[this.BL]
      ) ||
      this.isPointInTriangle(
        mx,
        my,
        this.mesh[this.BL],
        this.mesh[this.TR],
        this.mesh[this.BR]
      )
    );
  }

  /**
   * Computes the homography from the source rect → current corner pins,
   * then maps every interior grid point.
   */
  protected calculateMesh(): void {
    // When parented, re-derive this quad's pinned corners from their
    // parent-relative local values via the parent's *current* homography,
    // before anything below reads them — see CornerPinSurface.resolveControlPoints.
    this.resolveControlPoints();

    this._geomDirty = true;
    const srcCorners = [
      0,
      0,
      this.width,
      0,
      this.width,
      this.height,
      0,
      this.height,
    ];
    const dstCorners = [
      this.mesh[this.TL].x,
      this.mesh[this.TL].y,
      this.mesh[this.TR].x,
      this.mesh[this.TR].y,
      this.mesh[this.BR].x,
      this.mesh[this.BR].y,
      this.mesh[this.BL].x,
      this.mesh[this.BL].y,
    ];

    // PerspT is expected to return an object with transform(x,y) → [x', y']
    const persp = PerspT(srcCorners, dstCorners);

    // Wire this frame's homography up both ways: `transform` (local -> pinned
    // corners) drives rendering below and resolveToScreen() for any children
    // parented to this quad; `transformInverse` drives getTransformedCursor()/
    // resolveToLocal(). (CornerPinSurface's PerspectiveTransform interface
    // takes a single [x,y] pair per direction.)
    this.setPerspectiveTransform({
      transform: ([x, y]: [number, number]) => persp.transform(x, y),
      transformInverse: ([x, y]: [number, number]) =>
        persp.transformInverse(x, y),
    });

    const stepX = this.width / (this.resX - 1);
    const stepY = this.height / (this.resY - 1);

    // A self-intersecting ("bowtie") quad, or one merely close to that
    // configuration — a corner dragged near (not even necessarily across)
    // the diagonal formed by the other two — puts the homography's `w`
    // divisor near zero for some interior points. Exactly at w=0 that's
    // NaN/Infinity (guarded below); *near* zero it's a huge but perfectly
    // finite number instead (observed: a single interior point 500,000+px
    // from origin from one corner dragged a few hundred px too far) —
    // Number.isFinite() alone doesn't catch that, but a WebGL triangle with
    // a vertex that far out still swallows the entire viewport in whatever
    // that triangle's fill color is, which is what actually produces the
    // "screen goes white" report this guards against. A well-formed quad's
    // interior can never legitimately fall outside its own corners' convex
    // hull, so anything many times farther from the corners' own span is
    // the same blowup, just landing on a finite number — reject it the
    // same way: leave the point at its last valid position for this one
    // frame, self-correcting as soon as the corner moves back out.
    const cornerXs = [
      this.mesh[this.TL].x,
      this.mesh[this.TR].x,
      this.mesh[this.BR].x,
      this.mesh[this.BL].x,
    ];
    const cornerYs = [
      this.mesh[this.TL].y,
      this.mesh[this.TR].y,
      this.mesh[this.BR].y,
      this.mesh[this.BL].y,
    ];
    const cornerCenterX = (cornerXs[0] + cornerXs[1] + cornerXs[2] + cornerXs[3]) / 4;
    const cornerCenterY = (cornerYs[0] + cornerYs[1] + cornerYs[2] + cornerYs[3]) / 4;
    const cornerSpan = Math.max(
      Math.max(...cornerXs) - Math.min(...cornerXs),
      Math.max(...cornerYs) - Math.min(...cornerYs),
      1 // avoid a zero span when all 4 corners momentarily coincide
    );
    // For a *non-degenerate* perspective transform, every interior point of
    // a convex quad is mathematically guaranteed to land within the convex
    // hull of its transformed corners (the same property document-scanning/
    // dewarping code relies on) - so legitimate points can only ever be
    // slightly beyond the corners' own span, for floating-point/mesh-
    // quantization slop. This must NOT scale up with how far a corner has
    // already been dragged (an earlier version of this guard used a 20x
    // multiple of the corner span, which grows right when it needs to
    // shrink: dragging a corner far away inflates the span and loosens the
    // threshold at exactly the moment it needs to be tightest - a ~29,000px
    // blowup slipped through it in testing, next to legitimate corners only
    // ~2,000px apart). A tight, fixed 20% margin (comfortably above the
    // theoretical 0% a truly non-degenerate transform needs, for floating-
    // point/mesh-quantization slop) catches that class of near-degenerate
    // blowup while still being generous for any real quad.
    const maxInteriorDist = cornerSpan * 1.2;

    // Map all grid points except the four pinned corners
    let rejectedCount = 0;
    let maxRejectedMag = 0;
    for (let y = 0; y < this.resY; y++) {
      for (let x = 0; x < this.resX; x++) {
        const i = y * this.resX + x; // base mesh is resX x resY
        if (i === this.TL || i === this.TR || i === this.BR || i === this.BL)
          continue;

        const sx = x * stepX;
        const sy = y * stepY;

        const [dx, dy] = persp.transform(sx, sy);

        if (
          Number.isFinite(dx) &&
          Number.isFinite(dy) &&
          Math.abs(dx - cornerCenterX) <= maxInteriorDist &&
          Math.abs(dy - cornerCenterY) <= maxInteriorDist
        ) {
          this.mesh[i].x = dx;
          this.mesh[i].y = dy;
        } else {
          rejectedCount++;
          const mag = Math.max(
            Number.isFinite(dx) ? Math.abs(dx - cornerCenterX) : Infinity,
            Number.isFinite(dy) ? Math.abs(dy - cornerCenterY) : Infinity
          );
          if (mag > maxRejectedMag) maxRejectedMag = mag;
        }
      }
    }

    // Diagnostic only (temporary, left in deliberately to help track down a
    // "drag a corner -> whole screen goes white/unresponsive" report this
    // guard is meant to prevent) - throttled per-instance so a sustained
    // drag near the degenerate zone doesn't flood the console every frame.
    if (rejectedCount > 0) {
      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now - this._lastRejectLogAt > 250) {
        this._lastRejectLogAt = now;
        console.warn(
          `p5.mapper QuadMap[${this.id}]: rejected ${rejectedCount}/${
            this.resX * this.resY - 4
          } interior mesh point(s) this frame (near-degenerate homography). ` +
            `Worst rejected magnitude: ${maxRejectedMag.toFixed(0)}px beyond threshold ${maxInteriorDist.toFixed(
              0
            )}px. Corner span: ${cornerSpan.toFixed(
              0
            )}px, center: (${cornerCenterX.toFixed(0)}, ${cornerCenterY.toFixed(
              0
            )}). Corners (TL,TR,BR,BL): ${JSON.stringify(
              cornerXs.map((x, k) => [Math.round(x), Math.round(cornerYs[k])])
            )}.`
        );
      }
    }

    // This quad's own shape just changed (corner drag, load(), or
    // setResolution()) — let any children re-derive their geometry from it.
    this.onPositionChanged();
  }

  /**
   * Draw the tessellated quad as two triangles per cell.
   * When `isUV` is true we pass normalized UVs in [0,1] (Surface sets `textureMode(NORMAL)`).
   * The four extra params are interpreted as [u0, v0, u1, v1].
   *
   * In WEBGL mode the mesh is cached as a p5.Geometry and redrawn with `model()`;
   * it's only rebuilt when the control points moved (`_geomDirty`) or the requested
   * UV rect changed. `buildGeometry`/`model` don't exist in P2D, so that renderer
   * falls back to the original per-frame vertex() immediate-mode path.
   */
  protected displaySurface(isUV = true, u0 = 0, v0 = 0, u1 = 1, v1 = 1): void {
    const p = this.pInst;

    if (p.webglVersion === "p2d") {
      p.beginShape(p.TRIANGLES);
      for (let x = 0; x < this.resX - 1; x++) {
        for (let y = 0; y < this.resY - 1; y++) {
          if (isUV) {
            this.emitQuadAsTrianglesUV(x, y, u0, v0, u1, v1);
          } else {
            this.emitQuadAsTrianglesOutline(x, y);
          }
        }
      }
      p.endShape();
      return;
    }

    const needsRebuild =
      this._geomDirty ||
      !this._geom ||
      this._geomIsUV !== isUV ||
      (isUV &&
        (this._geomU0 !== u0 ||
          this._geomV0 !== v0 ||
          this._geomU1 !== u1 ||
          this._geomV1 !== v1));

    if (needsRebuild) {
      // buildGeometry() registers new GPU buffers every call; free the previous
      // geometry's buffers first or they leak (e.g. while actively dragging a
      // control point, which rebuilds every frame) and can exhaust the GPU
      // context. See p5's own freeGeometry() docs for this exact pattern.
      if (this._geom) p.freeGeometry(this._geom);
      this._geom = p.buildGeometry(() => {
        p.beginShape(p.TRIANGLES);
        for (let x = 0; x < this.resX - 1; x++) {
          for (let y = 0; y < this.resY - 1; y++) {
            if (isUV) {
              this.emitQuadAsTrianglesUV(x, y, u0, v0, u1, v1);
            } else {
              this.emitQuadAsTrianglesOutline(x, y);
            }
          }
        }
        p.endShape();
      });
      this._geomIsUV = isUV;
      this._geomU0 = u0;
      this._geomV0 = v0;
      this._geomU1 = u1;
      this._geomV1 = v1;
      this._geomDirty = false;
    }

    p.model(this._geom);
  }

  /**
   * Calibration draw: redraw this surface's grid into the single shared
   * calibration buffer (owned by ProjectionMapper), which was already
   * fully cleared once this frame in predraw (see
   * ProjectionMapper.beginCalibFrame() - this can't be a per-surface
   * partial clear+skip-if-unchanged, since surfaces are allowed to overlap
   * on the wall, and one surface's region can't be judged in isolation from
   * its neighbors'). The buffer itself is blitted to screen exactly once
   * per frame by ProjectionMapper.blitCalibSharedGfx() in postdraw, after
   * every surface's displayCalibration() has had a chance to run - so this
   * method must NOT call image()/blit anything itself.
   */
  public displayCalibration(): void {
    const g = pMapper.getCalibSharedGfx();
    if (!g) return;

    // This surface's own translate(this.x, this.y) is already active (see
    // Surface.display()), so `mesh[i].x/y` are WEBGL-centered coordinates
    // relative to this surface's origin. The shared buffer is a plain 2D
    // graphics object sized to the canvas with a top-left origin (matching
    // how ProjectionMapper.blitCalibSharedGfx() places it at
    // (-width/2, -height/2) to cover the WEBGL-centered canvas exactly), so
    // every point needs both this surface's own offset and the WEBGL
    // center-to-top-left shift applied before drawing into it.
    const p = this.pInst;
    const offX = this.x + p.width / 2;
    const offY = this.y + p.height / 2;

    // Fill pass: triangulated mesh, no stroke of its own. At low resolutions
    // (e.g. res=2, a single cell split into two triangles for WebGL) the
    // shared edge between those triangles is a corner-to-corner diagonal
    // with no relation to the surface's actual shape - stroking this same
    // shape (as the fill+stroke pass used to) drew that diagonal as if it
    // were part of the outline. Grid lines are stroked separately below,
    // per grid *cell* rather than per triangle, so that shared diagonal
    // never gets a stroke.
    //
    // Each cell is its own beginShape(TRIANGLES)/endShape() call rather than
    // one call covering the whole mesh: batching every cell's two triangles
    // into a single shape hits another p5 2.0.5 2D-renderer bug - under a
    // keystoned (non-axis-aligned) mesh, that single combined fill comes out
    // with periodic wedge-shaped cutouts (alternating filled/unfilled
    // stripes) instead of a solid fill. Isolating each cell in its own
    // begin/end call sidesteps whatever winding/batching logic causes that.
    g.noStroke();
    g.fill(this.getMutedControlColor(this.controlPointColor));

    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        const i00 = y * this.resX + x;
        const i10 = y * this.resX + (x + 1);
        const i11 = (y + 1) * this.resX + (x + 1);
        const i01 = (y + 1) * this.resX + x;
        g.beginShape(g.TRIANGLES);
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.vertex(this.mesh[i10].x + offX, this.mesh[i10].y + offY);
        g.vertex(this.mesh[i11].x + offX, this.mesh[i11].y + offY);
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.vertex(this.mesh[i11].x + offX, this.mesh[i11].y + offY);
        g.vertex(this.mesh[i01].x + offX, this.mesh[i01].y + offY);
        g.endShape();
      }
    }

    // Grid-line pass: stroke each cell's own quad boundary (TL-TR-BR-BL of
    // that cell) instead of the two triangles that make it up, so the
    // diagonal split between them never appears. At res=2 there's exactly
    // one cell, so this reduces to just the surface's own perimeter and
    // draws nothing the trace below doesn't already draw; at higher
    // resolutions it reproduces the interior grid visualization.
    //
    // Vertices close via an explicit repeated first point + plain
    // endShape(), not endShape(CLOSE): p5 2.0.5's 2D renderer under-strokes
    // the implicit closing segment CLOSE adds (observed ~17% of the opacity
    // of every explicitly-added edge - looks like a missing edge at a
    // glance). Repeating the first vertex makes that edge an explicit
    // segment like every other one, so it renders at full opacity too.
    g.noFill();
    g.strokeWeight(1);
    g.stroke(this.controlPointColor);
    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        const i00 = y * this.resX + x;
        const i10 = y * this.resX + (x + 1);
        const i11 = (y + 1) * this.resX + (x + 1);
        const i01 = (y + 1) * this.resX + x;
        g.beginShape();
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.vertex(this.mesh[i10].x + offX, this.mesh[i10].y + offY);
        g.vertex(this.mesh[i11].x + offX, this.mesh[i11].y + offY);
        g.vertex(this.mesh[i01].x + offX, this.mesh[i01].y + offY);
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.endShape();
      }
    }

    // Trace the actual TL-TR-BR-BL perimeter explicitly, on top of
    // everything above, so the full outer shape is always unambiguous and
    // stands out from the interior grid lines regardless of resolution or
    // triangle winding. Same explicit-close reasoning as the grid-line pass
    // above.
    g.strokeWeight(2);
    g.stroke(this.controlPointColor);
    g.noFill();
    g.beginShape();
    g.vertex(this.mesh[this.TL].x + offX, this.mesh[this.TL].y + offY);
    g.vertex(this.mesh[this.TR].x + offX, this.mesh[this.TR].y + offY);
    g.vertex(this.mesh[this.BR].x + offX, this.mesh[this.BR].y + offY);
    g.vertex(this.mesh[this.BL].x + offX, this.mesh[this.BL].y + offY);
    g.vertex(this.mesh[this.TL].x + offX, this.mesh[this.TL].y + offY);
    g.endShape();
  }

  /** Emit two triangles for a cell with proper UVs (normalized 0..1). */
  private emitQuadAsTrianglesUV(
    x: number,
    y: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number
  ): void {
    const i00 = y * this.resX + x;
    const i10 = y * this.resX + (x + 1);
    const i11 = (y + 1) * this.resX + (x + 1);
    const i01 = (y + 1) * this.resX + x;

    // Precompute UV scale factors once per cell; inline vertex calls to avoid
    // creating a closure (put = (i) => {...}) on every one of the 361 cell calls per frame.
    const du = u1 - u0;
    const dv = v1 - v0;
    const p = this.pInst;
    const mesh = this.mesh;

    let mp = mesh[i00]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
        mp = mesh[i10]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
        mp = mesh[i11]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
        mp = mesh[i00]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
        mp = mesh[i11]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
        mp = mesh[i01]; p.vertex(mp.x, mp.y, u0 + mp.u * du, v0 + mp.v * dv);
  }

  /** Emit two triangles for outline/fill only (no UVs). */
  private emitQuadAsTrianglesOutline(x: number, y: number): void {
    const i00 = y * this.resX + x;
    const i10 = y * this.resX + (x + 1);
    const i11 = (y + 1) * this.resX + (x + 1);
    const i01 = (y + 1) * this.resX + x;

    // Inline to avoid closure allocation per cell call
    const p = this.pInst;
    const mesh = this.mesh;
    p.vertex(mesh[i00].x, mesh[i00].y);
    p.vertex(mesh[i10].x, mesh[i10].y);
    p.vertex(mesh[i11].x, mesh[i11].y);
    p.vertex(mesh[i00].x, mesh[i00].y);
    p.vertex(mesh[i11].x, mesh[i11].y);
    p.vertex(mesh[i01].x, mesh[i01].y);
  }

  // --- Optional: if you ever want to change tessellation dynamically ----

  /**
   * Set a new resolution and rebuild the base mesh accordingly. `resX` is
   * a target pixel spacing between mesh vertices — divisions on both axes
   * are derived from it and this quad's current width/height (see
   * computeAxisRes); pass `resY` explicitly to bypass that and set
   * literal division counts on both axes manually (e.g. `2, 2` for the
   * cheapest possible flat quad). Finer spacing gives a smoother
   * perspective warp under heavy keystoning (matters most for
   * displayTexture/displaySketch content); coarser spacing costs fewer
   * vertices per frame. A solid-color display() fill looks the same at
   * any resolution, so it's a good place to use the literal-2x2 override.
   *
   * Note: changing resolution reindexes the mesh, so any previously
   * calibrated corner pins for this surface will need to be redone.
   */
  public setResolution(resX: number, resY?: number): void {
    const axis =
      resY !== undefined
        ? { resX: Math.max(2, Math.floor(resX)), resY: Math.max(2, Math.floor(resY)) }
        : (warnAboutResSemanticsOnce(), QuadMap.computeAxisRes(resX, this.width, this.height));
    if (axis.resX === this.resX && axis.resY === this.resY) return;
    this.res = axis.resX;
    this.resX = axis.resX;
    this.resY = axis.resY;

    // Rebuild the base mesh & control points from CornerPinSurface
    this.initMesh();
    this.calculateMesh();
  }
}
