// CornerPinSurface.ts
import { DraggableJSON } from "./Draggable";
import MeshPoint from "./MeshPoint";
import Surface, { PointXY } from "./Surface";

/**
 * Small interface so any perspective impl just needs transform/transformInverse
 * over a single [x,y] pair. E.g., wrap your PerspT or homography util here.
 * Both directions are required: `transform` (local canonical rect -> pinned
 * screen corners) drives rendering and resolveToScreen(); `transformInverse`
 * (the reverse) drives getTransformedCursor()/resolveToLocal().
 */
interface PerspectiveTransform {
  transform: (pt: [number, number]) => [number, number];
  transformInverse: (pt: [number, number]) => [number, number];
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

  /**
   * When parented, resolve each control point's parent-relative local
   * shadow value (MeshPoint.localX/localY) into this surface's real,
   * render-facing .x/.y via the parent's *current* transform. Called as the
   * first step of calculateMesh() (QuadMap/TriMap) so the homography built
   * afterward is always based on the parent's latest calibration. No-op
   * when unparented.
   */
  protected resolveControlPoints(): void {
    if (!this.parentSurface) return;
    for (const cp of this.controlPoints) {
      if (cp.localX == null || cp.localY == null) continue;
      const abs = this.parentSurface.resolveToScreen(cp.localX, cp.localY);
      cp.x = abs.x;
      cp.y = abs.y;
    }
  }

  /** Re-derive this surface's geometry after the parent's calibration changes. */
  public recalcFromParent(): void {
    this.calculateMesh();
  }

  /**
   * Fold this surface's absolute offset (dx,dy) — what this.x/this.y held
   * right before being parented — into each control point, then convert
   * from absolute screen space into the new parent's local space.
   */
  protected onParentAttached(dx: number, dy: number): void {
    if (!this.parentSurface) return;
    for (const cp of this.controlPoints) {
      const local = this.parentSurface.resolveToLocal(dx + cp.x, dy + cp.y);
      cp.localX = local.x;
      cp.localY = local.y;
    }
  }

  /** Clear parent-relative shadow state so a future re-parent starts clean. */
  protected onParentDetached(): void {
    for (const cp of this.controlPoints) {
      cp.localX = undefined;
      cp.localY = undefined;
    }
  }

  /**
   * Resolve a point local to this surface's canonical rect into absolute
   * screen coordinates via this surface's own homography (local -> pinned
   * corners), then this surface's own x/y translation (0 when parented).
   */
  public resolveToScreen(lx: number, ly: number): PointXY {
    if (!this.perspectiveTransform) return { x: lx + this.x, y: ly + this.y };
    const [tx, ty] = this.perspectiveTransform.transform([lx, ly]);
    return { x: tx + this.x, y: ty + this.y };
  }

  /** Inverse of resolveToScreen — absolute screen coords -> this surface's local canonical rect. */
  public resolveToLocal(ax: number, ay: number): PointXY {
    if (!this.perspectiveTransform) return { x: ax - this.x, y: ay - this.y };
    const [tx, ty] = this.perspectiveTransform.transformInverse([
      ax - this.x,
      ay - this.y,
    ]);
    return { x: tx, y: ty };
  }

  /** JSON → state (applies only stored control points, keeps others) */
  public load(json: DraggableJSON): void {
    const { x, y, points, parentId } = json;
    this.x = x;
    this.y = y;

    for (const p of points || []) {
      const mp = this.mesh[p.i];
      if (!mp) continue;
      // When parentId is present, persisted point coords are parent-local
      // canonical values, not absolute — stash them and let the
      // parentId->setParent() reattach pass (ProjectionMapper.loadSurfaces)
      // resolve real .x/.y via recalcFromParent() once every surface exists.
      if (parentId != null) {
        mp.localX = p.x;
        mp.localY = p.y;
      } else {
        mp.x = p.x;
        mp.y = p.y;
      }
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
    if (this.parentSurface) data.parentId = this.parentSurface.id;

    this.forEachPoint((mp, _x, _y, i) => {
      if (mp.isControlPoint) {
        const px = this.parentSurface && mp.localX != null ? mp.localX : mp.x;
        const py = this.parentSurface && mp.localY != null ? mp.localY : mp.y;
        data.points?.push({ i, x: px, y: py, u: mp.u, v: mp.v });
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
    const { x, y } = this.resolveToLocal(cx, cy);
    return this.pInst.createVector(x, y);
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
