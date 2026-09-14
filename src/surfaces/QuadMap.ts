import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";
import pMapper from "../ProjectionMapper";

// type PerspectiveFn = (x: number, y: number) => [number, number];

export default class QuadMap extends CornerPinSurface {
  /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
  private resX: number;
  private resY: number;

  /** Throttle for the interior-point-rejection diagnostic warning below. */
  private _lastRejectLogAt = -Infinity;

  /** True once this surface's own region of the shared calibration buffer needs redrawing. */
  private _calibDirty = true;

  /**
   * The pMapper.getCalibSharedGfxGeneration() value as of this surface's last
   * draw into the shared buffer. When the buffer itself gets freed and
   * recreated (calibration exit/re-entry, or a canvas resize), every
   * surface's region is blank again even though this surface's own mesh may
   * not have changed - _calibDirty alone can't tell "my mesh changed" apart
   * from "the whole buffer got wiped out from under me", so this is checked
   * alongside it.
   */
  private _calibGfxGenerationDrawn = -1;

  /**
   * this.x/this.y as of this surface's last draw into the shared buffer.
   * Unlike the old per-surface buffer (blitted via image() inside a live
   * translate(this.x, this.y), so a whole-surface drag repositioned it for
   * free with no redraw), this surface's offset is now baked directly into
   * the vertices written into the shared buffer - so a whole-surface drag
   * that doesn't touch the mesh (no calculateMesh() call, no _calibDirty)
   * still needs to be detected and redrawn here, or the old position is
   * left behind as a ghost.
   */
  private _calibDrawnX = NaN;
  private _calibDrawnY = NaN;

  /** This surface's last-drawn region in the shared buffer, so a subsequent
   *  redraw (position or mesh changed) can clear the *old* spot too - the
   *  new position's clearRect doesn't touch pixels left behind at the old
   *  one. Only meaningful when _calibGfxGenerationDrawn matches the shared
   *  buffer's current generation (a fresh/recreated buffer has nothing to
   *  clear there yet). */
  private _calibLastBox: [number, number, number, number] | null = null;

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
    pInst: any
  ) {
    super(id, w, h, res, "QUAD", buffer, pInst);

    // Keep internal axes in sync with base resolution
    this.resX = this.res;
    this.resY = this.res;
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
    this._calibDirty = true;
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

    // Wire this frame's homography up for getTransformedCursor/getTransformedMouse.
    // getTransformedCursor maps canvas-space -> local pre-warp space, which is the
    // *inverse* of persp.transform (local -> canvas, used below to place mesh
    // points), so it needs transformInverse here, not transform.
    // (CornerPinSurface's PerspectiveTransform interface takes a single [x,y] pair.)
    this.setPerspectiveTransform({
      transform: ([x, y]: [number, number]) => persp.transformInverse(x, y),
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
        const i = y * this.res + x; // base mesh is res x res
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
   * Calibration draw: redraw only this surface's own region of the single
   * shared calibration buffer (owned by ProjectionMapper), skipping the
   * redraw entirely on frames where this surface's mesh hasn't changed.
   * The buffer itself is blitted to screen exactly once per frame by
   * ProjectionMapper.blitCalibSharedGfx() in postdraw, after every
   * surface's displayCalibration() has had a chance to run - so this method
   * must NOT call image()/blit anything itself.
   */
  public displayCalibration(): void {
    const g = pMapper.getCalibSharedGfx();
    if (!g) return;

    const generation = pMapper.getCalibSharedGfxGeneration();
    const sameGeneration = this._calibGfxGenerationDrawn === generation;
    const positionChanged =
      this.x !== this._calibDrawnX || this.y !== this._calibDrawnY;
    if (!this._calibDirty && sameGeneration && !positionChanged) {
      return;
    }

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

    // Bounding box of this surface's own mesh, in the shared buffer's space,
    // so only this surface's region gets cleared/redrawn (not the whole
    // shared buffer, which would erase every other surface's contribution
    // for that frame).
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const mp of this.mesh) {
      const ax = mp.x + offX;
      const ay = mp.y + offY;
      if (ax < minX) minX = ax;
      if (ay < minY) minY = ay;
      if (ax > maxX) maxX = ax;
      if (ay > maxY) maxY = ay;
    }
    const pad = 4; // extra pixels to accommodate stroke width
    const cx = Math.max(0, Math.floor(minX) - pad);
    const cy = Math.max(0, Math.floor(minY) - pad);
    const cx2 = Math.min(g.width, Math.ceil(maxX) + pad);
    const cy2 = Math.min(g.height, Math.ceil(maxY) + pad);

    // Clear the *previous* region too, if the buffer we're drawing into is
    // the same one that region was last drawn into - a whole-surface drag
    // (or a mesh change that shifted the bounding box) otherwise leaves a
    // ghost of the old grid behind at the old location.
    if (sameGeneration && this._calibLastBox) {
      const [lx, ly, lx2, ly2] = this._calibLastBox;
      if (lx2 > lx && ly2 > ly) {
        g.drawingContext.clearRect(lx, ly, lx2 - lx, ly2 - ly);
      }
    }
    if (cx2 > cx && cy2 > cy) {
      g.drawingContext.clearRect(cx, cy, cx2 - cx, cy2 - cy);
    }

    g.strokeWeight(2);
    g.stroke(this.controlPointColor);
    g.fill(this.getMutedControlColor(this.controlPointColor));

    g.beginShape(g.TRIANGLES);
    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        const i00 = y * this.res + x;
        const i10 = y * this.res + (x + 1);
        const i11 = (y + 1) * this.res + (x + 1);
        const i01 = (y + 1) * this.res + x;
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.vertex(this.mesh[i10].x + offX, this.mesh[i10].y + offY);
        g.vertex(this.mesh[i11].x + offX, this.mesh[i11].y + offY);
        g.vertex(this.mesh[i00].x + offX, this.mesh[i00].y + offY);
        g.vertex(this.mesh[i11].x + offX, this.mesh[i11].y + offY);
        g.vertex(this.mesh[i01].x + offX, this.mesh[i01].y + offY);
      }
    }
    g.endShape();

    this._calibDirty = false;
    this._calibGfxGenerationDrawn = generation;
    this._calibDrawnX = this.x;
    this._calibDrawnY = this.y;
    this._calibLastBox = [cx, cy, cx2, cy2];
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
    const i00 = y * this.res + x;
    const i10 = y * this.res + (x + 1);
    const i11 = (y + 1) * this.res + (x + 1);
    const i01 = (y + 1) * this.res + x;

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
    const i00 = y * this.res + x;
    const i10 = y * this.res + (x + 1);
    const i11 = (y + 1) * this.res + (x + 1);
    const i01 = (y + 1) * this.res + x;

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
   * Set a new (square) resolution and rebuild the base mesh accordingly.
   * Higher values give a smoother perspective warp under heavy keystoning
   * (matters most for displayTexture/displaySketch content); lower values
   * cost fewer vertices per frame. A solid-color display() fill looks the
   * same at any resolution, so it's a good place to drop this toward 2.
   */
  public setResolution(res: number): void {
    const r = Math.max(2, Math.floor(res));
    if (r === this.res) return;
    this.res = r;
    this.resX = r;
    this.resY = r;

    // Rebuild the base mesh & control points from CornerPinSurface
    (this as any).initMesh?.();
    this.calculateMesh();
  }
}
