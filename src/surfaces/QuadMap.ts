import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";

// type PerspectiveFn = (x: number, y: number) => [number, number];

export default class QuadMap extends CornerPinSurface {
  /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
  private resX: number;
  private resY: number;

  /** Homography mapping src → dst (x,y) */

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

  /** Calibration draw (grid without texture) */
  public displayCalibration(): void {
    this.displayGrid();
  }

  private displayGrid(col: any = this.controlPointColor): void {
    const p = this.pInst;
    p.strokeWeight(2);
    p.stroke(col);
    p.fill(this.getMutedControlColor(col));

    p.beginShape(p.TRIANGLES);
    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        this.emitQuadAsTrianglesOutline(x, y);
      }
    }
    p.endShape();
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
    const i00 = y * this.res + x; // (x,   y)
    const i10 = y * this.res + (x + 1); // (x+1, y)
    const i11 = (y + 1) * this.res + (x + 1); // (x+1, y+1)
    const i01 = (y + 1) * this.res + x; // (x,   y+1)

    // Interpolate UV per-vertex from the quad UV rect
    // mp.u/mp.v are 0..1 over the original rect; re-map into [u0..u1]/[v0..v1]
    const put = (i: number) => {
      const mp = this.mesh[i];
      const uu = u0 + mp.u * (u1 - u0);
      const vv = v0 + mp.v * (v1 - v0);
      this.pInst.vertex(mp.x, mp.y, uu, vv);
    };

    // Triangle 1: (x,y) → (x+1,y) → (x+1,y+1)
    put(i00);
    put(i10);
    put(i11);

    // Triangle 2: (x,y) → (x+1,y+1) → (x,y+1)
    put(i00);
    put(i11);
    put(i01);
  }

  /** Emit two triangles for outline/fill only (no UVs). */
  private emitQuadAsTrianglesOutline(x: number, y: number): void {
    const i00 = y * this.res + x;
    const i10 = y * this.res + (x + 1);
    const i11 = (y + 1) * this.res + (x + 1);
    const i01 = (y + 1) * this.res + x;

    const v = (i: number) => {
      const mp = this.mesh[i];
      this.pInst.vertex(mp.x, mp.y);
    };

    // Triangle 1
    v(i00);
    v(i10);
    v(i11);

    // Triangle 2
    v(i00);
    v(i11);
    v(i01);
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
