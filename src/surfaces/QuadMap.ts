import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";

// type PerspectiveFn = (x: number, y: number) => [number, number];

export default class QuadMap extends CornerPinSurface {
  /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
  private resX: number;
  private resY: number;

  /** Cached calibration grid — only rebuilt when the mesh changes */
  private _calibGfx: any | null = null;
  private _calibGfxOffX = 0;
  private _calibGfxOffY = 0;
  private _calibDirty = true;

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
        this.mesh[i].x = dx;
        this.mesh[i].y = dy;
      }
    }
  }

  /**
   * Draw the tessellated quad as two triangles per cell.
   * When `isUV` is true we pass normalized UVs in [0,1] (Surface sets `textureMode(NORMAL)`).
   * The four extra params are interpreted as [u0, v0, u1, v1].
   */
  protected displaySurface(isUV = true, u0 = 0, v0 = 0, u1 = 1, v1 = 1): void {
    const p = this.pInst;
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
    const gw = Math.max(1, Math.ceil(maxX - minX) + pad * 2);
    const gh = Math.max(1, Math.ceil(maxY - minY) + pad * 2);

    if (!this._calibGfx || this._calibGfx.width !== gw || this._calibGfx.height !== gh) {
      if (this._calibGfx) this._calibGfx.remove();
      this._calibGfx = this.pInst.createGraphics(gw, gh);
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

  /** Set a new (square) resolution and rebuild the base mesh accordingly. */
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
