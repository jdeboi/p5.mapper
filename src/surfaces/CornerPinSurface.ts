// CornerPinSurface.ts
import { DraggableJSON } from "./Draggable";
import MeshPoint from "./MeshPoint";
import Surface from "./Surface";

/**
 * Small interface so any perspective impl just needs a `transform([x,y])`.
 * E.g., wrap your PerspT or homography util here.
 */
interface PerspectiveTransform {
  transform: (pt: [number, number]) => [number, number];
}

type CornerIndex = "TL" | "TR" | "BR" | "BL";

type CornerPinJSON = {
  id: string | number;
  res: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  points: Array<{ i: number; x: number; y: number; u: number; v: number }>;
};

export default class CornerPinSurface extends Surface {
  /** grid resolution per axis (res x res points) */
  public res: number;

  /** flattened grid of MeshPoints, row-major (y * res + x) */
  protected mesh: MeshPoint[] = [];

  /** top-left, top-right, bottom-right, bottom-left indices into mesh */
  public TL = 0;
  public TR = 0;
  public BR = 0;
  public BL = 0;

  /** control points are exactly the four corners */
  public controlPoints: MeshPoint[] = [];

  /** perspective transform used for inverse cursor mapping */
  private perspectiveTransform: PerspectiveTransform | null = null;

  constructor(
    id: string | number,
    width: number,
    height: number,
    res: number,
    type: string,
    buffer: any,
    pInst: any
  ) {
    super(id, width, height, res, type, buffer, pInst);

    if (!Number.isInteger(res) || res < 2) {
      throw new Error(
        `CornerPinSurface: res must be an integer >= 2, got ${res}`
      );
    }
    this.res = res;

    this.initMesh();
    this.calculateMesh(); // abstract in base class, but we call to set initial transform if you compute it there
  }

  /** index helper (row-major) */
  private idx(x: number, y: number): number {
    return y * this.res + x;
  }

  /** iterate all mesh points */
  private forEachPoint(
    fn: (mp: MeshPoint, x: number, y: number, i: number) => void
  ) {
    let i = 0;
    for (let y = 0; y < this.res; y++) {
      for (let x = 0; x < this.res; x++, i++) {
        fn(this.mesh[i], x, y, i);
      }
    }
  }

  /** build a regular grid + mark corners as control points */
  private initMesh(): void {
    this.mesh = new Array(this.res * this.res);

    // map 0..res-1 → 0..width/height so corners land exactly on edges
    const mapX = (gx: number) => (gx / (this.res - 1)) * this.width;
    const mapY = (gy: number) => (gy / (this.res - 1)) * this.height;
    const mapU = (gx: number) => gx / (this.res - 1);
    const mapV = (gy: number) => gy / (this.res - 1);

    for (let y = 0; y < this.res; y++) {
      for (let x = 0; x < this.res; x++) {
        const mx = Math.round(mapX(x));
        const my = Math.round(mapY(y));
        const u = mapU(x);
        const v = mapV(y);
        this.mesh[this.idx(x, y)] = new MeshPoint(
          this,
          mx,
          my,
          u,
          v,
          this.pInst
        );
      }
    }

    this.TL = this.idx(0, 0);
    this.TR = this.idx(this.res - 1, 0);
    this.BL = this.idx(0, this.res - 1);
    this.BR = this.idx(this.res - 1, this.res - 1);

    // corners are control points
    [this.TL, this.TR, this.BR, this.BL].forEach((i) => {
      this.mesh[i].setControlPoint(true);
    });

    this.controlPoints = [
      this.mesh[this.TL],
      this.mesh[this.TR],
      this.mesh[this.BR],
      this.mesh[this.BL],
    ];
  }

  /**
   * Override in subclasses. Compute any per-frame mesh adjustments and
   * (recommended) update `this.perspectiveTransform` so cursor mapping works.
   * Example (pseudo):
   *   const src = [0,0, width,0, width,height, 0,height];
   *   const dst = [TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y];
   *   const persp = PerspT(src, dst); // whatever you use
   *   this.setPerspectiveTransform({ transform: ([x,y]) => persp.transform(x,y) });
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected calculateMesh(): void {}

  /** supply a perspective transform impl (set from calculateMesh) */
  protected setPerspectiveTransform(pt: PerspectiveTransform | null): void {
    this.perspectiveTransform = pt;
  }

  /** JSON → state (applies only stored control points, keeps others) */
  public load(json: DraggableJSON): void {
    const { x, y, points } = json;
    this.x = x;
    this.y = y;

    for (const p of points || []) {
      const mp = this.mesh[p.i];
      if (!mp) continue;
      mp.x = p.x;
      mp.y = p.y;
      mp.u = p.u || 0;
      mp.v = p.v || 0;
      mp.setControlPoint(true);
    }
    this.calculateMesh();
  }

  /** state → JSON (only control points are persisted) */
  public toJSON(): DraggableJSON {
    const data: DraggableJSON = {
      id: String(this.id),
      res: this.res,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type,
      points: [],
    };

    this.forEachPoint((mp, _x, _y, i) => {
      if (mp.isControlPoint) {
        data.points?.push({ i, x: mp.x, y: mp.y, u: mp.u, v: mp.v });
      }
    });

    return data;
  }

  public getControlPoints(): MeshPoint[] {
    return this.controlPoints;
  }

  public selectPoints(): MeshPoint | null {
    const cp = this.isMouseOverControlPoints();
    if (cp) {
      cp.startDrag();
      return cp;
    }
    return null;
  }

  private isMouseOverControlPoints(): MeshPoint | false {
    for (const cp of this.controlPoints) {
      if (cp.isMouseOver()) return cp;
    }
    return false;
  }

  /**
   * Barycentric point-in-triangle test.
   * Kept as a utility in case you want click-to-select by face.
   */
  protected isPointInTriangle(
    x: number,
    y: number,
    a: { x: number; y: number },
    b: { x: number; y: number },
    c: { x: number; y: number }
  ): boolean {
    const v0x = c.x - a.x,
      v0y = c.y - a.y;
    const v1x = b.x - a.x,
      v1y = b.y - a.y;
    const v2x = x - a.x,
      v2y = y - a.y;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v1x * v0x + v1y * v0y;
    const dot02 = v2x * v0x + v2y * v0y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v2x * v1x + v2y * v1y;

    const invDen = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDen;
    const v = (dot00 * dot12 - dot01 * dot02) * invDen;

    return u > 0 && v > 0 && u + v < 1;
  }

  /** draws corner handles */
  public displayControlPoints() {
    const p = this.pInst;
    p.push();
    p.translate(this.x, this.y);
    for (const cp of this.controlPoints) cp.display(this.controlPointColor);
    p.pop();
  }

  /**
   * Map a canvas-space point into the surface’s local (pre-warp) space.
   * Requires `this.perspectiveTransform` to be set (e.g., in `calculateMesh`).
   */
  public getTransformedCursor(cx: number, cy: number) {
    if (!this.perspectiveTransform)
      return this.pInst.createVector(cx - this.x, cy - this.y);
    const [tx, ty] = this.perspectiveTransform.transform([
      cx - this.x,
      cy - this.y,
    ]);
    return this.pInst.createVector(tx, ty);
  }

  public getTransformedMouse() {
    const { x, y } = this.getMouseCoords();
    return this.getTransformedCursor(x, y);
  }

  /** 2D cross product helper (kept for completeness) */
  protected cross2(x0: number, y0: number, x1: number, y1: number) {
    return x0 * y1 - y0 * x1;
  }
}
