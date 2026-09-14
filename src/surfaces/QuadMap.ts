import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";

// type PerspectiveFn = (x: number, y: number) => [number, number];

export default class QuadMap extends CornerPinSurface {
  /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
  private resX: number;
  private resY: number;

  /**
   * Hard ceiling on the calibration overlay's offscreen buffer, in pixels per
   * axis. Well under every GPU's real MAX_TEXTURE_SIZE/MAX_RENDERBUFFER_SIZE
   * floor (even old/software renderers), and far larger than any canvas the
   * overlay actually needs to cover.
   */
  private static readonly MAX_CALIB_GFX_DIM = 4096;

  /** Throttle for the interior-point-rejection diagnostic warning below. */
  private _lastRejectLogAt = -Infinity;

  /** Cached calibration grid — only rebuilt when the mesh changes */
  private _calibGfx: any | null = null;
  private _calibGfxCapW = 0;
  private _calibGfxCapH = 0;
  /** Rate limit for the buffer's actual (re)allocation — see _rebuildCalibGfx. */
  private _lastCalibGfxAllocAt = -Infinity;
  private _calibGfxOffX = 0;
  private _calibGfxOffY = 0;
  private _calibDirty = true;

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
    // When parented, re-derive this quad's pinned corners from their
    // parent-relative local values via the parent's *current* homography,
    // before anything below reads them — see CornerPinSurface.resolveControlPoints.
    this.resolveControlPoints();

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

  /** Calibration draw: blit a cached grid image instead of re-tessellating every frame */
  public displayCalibration(): void {
    if (this._calibDirty || !this._calibGfx) {
      this._rebuildCalibGfx();
    }
    if (this._calibGfx) {
      this.pInst.image(this._calibGfx, this._calibGfxOffX, this._calibGfxOffY);
    }
  }

  /** Render the grid mesh into an offscreen 2D buffer once; reused until mesh changes. */
  private _rebuildCalibGfx(): void {
    // Compute surface-local bounding box of all mesh points
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const mp of this.mesh) {
      if (mp.x < minX) minX = mp.x;
      if (mp.y < minY) minY = mp.y;
      if (mp.x > maxX) maxX = mp.x;
      if (mp.y > maxY) maxY = mp.y;
    }
    const pad = 4; // extra pixels to accommodate stroke width
    const ox = Math.floor(minX) - pad;
    const oy = Math.floor(minY) - pad;

    // Cap the overlay size. A control point dragged far off the surface blows
    // up the mesh's bounding box arbitrarily, and asking the GPU to allocate a
    // texture/renderbuffer that large fails outright (GL_INVALID_OPERATION on
    // renderbufferStorage), leaving a broken graphics object that then throws
    // on every subsequent frame it's blitted. Nothing useful is lost by
    // capping — the overlay only needs to cover what's actually visible,
    // which is bounded by the canvas itself; anything beyond the cap is
    // simply clipped instead of crashing the WebGL context.
    const gw = Math.min(
      QuadMap.MAX_CALIB_GFX_DIM,
      Math.max(1, Math.ceil(maxX - minX) + pad * 2)
    );
    const gh = Math.min(
      QuadMap.MAX_CALIB_GFX_DIM,
      Math.max(1, Math.ceil(maxY - minY) + pad * 2)
    );

    // Grow-only, *and* rate-limited: the bounding box includes the corner
    // points themselves, which are wherever the user just dragged them, so
    // a single fast drag sweeping through several very different positions
    // legitimately needs a bigger buffer on nearly every one of those
    // frames — each one exceeding the *previous* grow-only cap, since a
    // corner sweeping outward produces a monotonically growing box for a
    // run of frames. Grow-only alone still means one real
    // createGraphics()+remove() cycle per such frame; a burst of those
    // faster than the browser can garbage-collect the discarded ones is
    // exactly what exhausts the WebGL/canvas context budget ("too many
    // active WebGL contexts", observed and confirmed via this file's own
    // diagnostic logging while chasing that report). A hard minimum gap
    // between actual reallocations fixes that: within the gap, keep
    // rendering into the existing (possibly now slightly-too-small) buffer
    // — a few frames of a clipped calibration overlay mid-fast-drag is a
    // fully acceptable tradeoff for not thrashing GPU resources, and it
    // self-corrects the moment the gap next elapses.
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const needsGrow =
      !this._calibGfx || gw > this._calibGfxCapW || gh > this._calibGfxCapH;
    const throttled =
      this._calibGfx && now - this._lastCalibGfxAllocAt < 100;

    if (needsGrow && !throttled) {
      // Diagnostic only (temporary, lightweight - no stack capture) so the
      // rate limit above is directly verifiable: with it, this should fire
      // at most ~10x/sec even during a fast, sustained drag, vs. potentially
      // every single frame (~60x/sec) without it.
      console.warn(
        `p5.mapper QuadMap[${this.id}]: (re)allocating calibration overlay buffer to ${Math.ceil(
          gw * 2
        )}x${Math.ceil(gh * 2)} (requested ${gw}x${gh}).`
      );
      if (this._calibGfx) this._calibGfx.remove();
      this._calibGfxCapW = Math.min(
        QuadMap.MAX_CALIB_GFX_DIM,
        Math.ceil(gw * 2)
      );
      this._calibGfxCapH = Math.min(
        QuadMap.MAX_CALIB_GFX_DIM,
        Math.ceil(gh * 2)
      );
      this._calibGfx = this.pInst.createGraphics(
        this._calibGfxCapW,
        this._calibGfxCapH
      );
      this._lastCalibGfxAllocAt = now;
    }

    const g = this._calibGfx;
    g.clear();
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
        g.vertex(this.mesh[i00].x - ox, this.mesh[i00].y - oy);
        g.vertex(this.mesh[i10].x - ox, this.mesh[i10].y - oy);
        g.vertex(this.mesh[i11].x - ox, this.mesh[i11].y - oy);
        g.vertex(this.mesh[i00].x - ox, this.mesh[i00].y - oy);
        g.vertex(this.mesh[i11].x - ox, this.mesh[i11].y - oy);
        g.vertex(this.mesh[i01].x - ox, this.mesh[i01].y - oy);
      }
    }
    g.endShape();

    this._calibGfxOffX = ox;
    this._calibGfxOffY = oy;
    this._calibDirty = false;
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
