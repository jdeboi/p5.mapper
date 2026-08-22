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

  /** Cached calibration grid — only rebuilt when the mesh changes */
  private _calibGfx: any | null = null;
  private _calibGfxCapW = 0;
  private _calibGfxCapH = 0;
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

    const stepX = this.width / (this.resX - 1);
    const stepY = this.height / (this.resY - 1);

    // Map all grid points except the four pinned corners
    for (let y = 0; y < this.resY; y++) {
      for (let x = 0; x < this.resX; x++) {
        const i = y * this.res + x; // base mesh is res x res
        if (i === this.TL || i === this.TR || i === this.BR || i === this.BL)
          continue;

        const sx = x * stepX;
        const sy = y * stepY;

        const [dx, dy] = persp.transform(sx, sy);

        // A self-intersecting ("bowtie") quad — e.g. a corner dragged across
        // the diagonal formed by the other two — puts the homography's
        // vanishing line through the source rect, so `w` in transform() goes
        // to ~0 for interior points near that line and dx/dy blow up to
        // +/-Infinity or NaN. Left unguarded that garbage corrupts both the
        // render mesh and the calibration overlay's bounding box, which is
        // what was crashing the WebGL context. Just leave the point at its
        // last valid position for this one frame instead — it self-corrects
        // as soon as the corner moves back out of the degenerate config.
        if (Number.isFinite(dx) && Number.isFinite(dy)) {
          this.mesh[i].x = dx;
          this.mesh[i].y = dy;
        }
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

    // Grow-only: reallocating this canvas every frame is what starves the GPU
    // while a corner is being dragged, since the bounding box (and therefore
    // gw/gh) changes on nearly every frame of the drag. Only recreate when the
    // request exceeds current capacity (with slack so we don't flap right at
    // the boundary), and blit the possibly-larger buffer at its actual size —
    // the clear() below wipes any stale content in the extra margin.
    if (!this._calibGfx || gw > this._calibGfxCapW || gh > this._calibGfxCapH) {
      if (this._calibGfx) this._calibGfx.remove();
      this._calibGfxCapW = Math.min(
        QuadMap.MAX_CALIB_GFX_DIM,
        Math.ceil(gw * 1.25)
      );
      this._calibGfxCapH = Math.min(
        QuadMap.MAX_CALIB_GFX_DIM,
        Math.ceil(gh * 1.25)
      );
      this._calibGfx = this.pInst.createGraphics(
        this._calibGfxCapW,
        this._calibGfxCapH
      );
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
