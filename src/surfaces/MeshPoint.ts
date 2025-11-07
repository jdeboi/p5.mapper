// MeshPoint.ts
import { DraggableJSON, Point } from "./Draggable";
import MovePoint from "./MovePoint";

type UVLike = { u: number; v: number };
type XYLike = { x: number; y: number };
type PointLike = XYLike & Partial<UVLike>;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default class MeshPoint extends MovePoint {
  public u: number;
  public v: number;

  constructor(
    parent: any,
    x: number,
    y: number,
    u: number,
    v: number,
    pInst: any
  ) {
    super(parent, x, y, pInst);
    this.u = u;
    this.v = v;
  }

  set(point: Point): this {
    super.set(point);
    this.u = point.u || 0;
    this.v = point.v || 0;
    return this;
  }

  moveTo() {
    super.moveTo();
    this.parent.calculateMesh();
  }

  /**
   * This creates a new MeshPoint with (u,v) = (0,0) and does
   * not modify the current MeshPoint. Its used to generate
   * temporary points for the interpolation.
   */
  interpolateTo(p: { x: number; y: number }, f: number) {
    let nX = this.x + (p.x - this.x) * f;
    let nY = this.y + (p.y - this.y) * f;
    return new MeshPoint(this.parent, nX, nY, 0, 0, this.pInst);
  }

  //   /** Copy x,y (+u,v if present) from another point-like object. */
  //   set(point: PointLike): this {
  //     super.set(point);
  //     if (typeof point.u === "number") this.u = point.u;
  //     if (typeof point.v === "number") this.v = point.v;
  //     return this;
  //   }

  //   moveTo(): void {
  //     super.moveTo();
  //     // if (notifyParent) this.#notifyParent();
  //     this.parent.calculateMesh();
  //   }

  //   translate(dx: number, dy: number, notifyParent = true): this {
  //     super.moveTo(this.x + dx, this.y + dy);
  //     // if (notifyParent) this.#notifyParent();
  //     this.parent.calculateMesh();
  //     return this;
  //   }

  //   /** Set UV; optionally clamp to [0,1]. */
  //   setUV(u: number, v: number, clamp = true): this {
  //     this.u = clamp ? clamp01(u) : u;
  //     this.v = clamp ? clamp01(v) : v;
  //     return this;
  //   }

  //   /**
  //    * Interpolate towards another point.
  //    * @param p target point (x,y used; u,v optional)
  //    * @param t mix factor in [0,1]
  //    * @param carryUV if true, also interpolates UVs when available
  //    */
  //   interpolateTo(p: PointLike, t: number, carryUV = false): MeshPoint {
  //     const nx = this.x + (p.x - this.x) * t;
  //     const ny = this.y + (p.y - this.y) * t;

  //     const hasUV = typeof p.u === "number" && typeof p.v === "number";
  //     const nu =
  //       carryUV && hasUV
  //         ? (this.u as number) + ((p.u as number) - (this.u as number)) * t
  //         : 0;
  //     const nv =
  //       carryUV && hasUV
  //         ? (this.v as number) + ((p.v as number) - (this.v as number)) * t
  //         : 0;

  //     return new MeshPoint(this.parent, nx, ny, nu, nv, this.pInst);
  //   }

  //   /** A few handy utilities */
  //   clone(): MeshPoint {
  //     return new MeshPoint(
  //       this.parent,
  //       this.x,
  //       this.y,
  //       this.u,
  //       this.v,
  //       this.pInst
  //     );
  //   }

  //   equals(p: PointLike, eps = 1e-6): boolean {
  //     return (
  //       Math.abs(this.x - p.x) <= eps &&
  //       Math.abs(this.y - p.y) <= eps &&
  //       (typeof p.u !== "number" || Math.abs(this.u - p.u) <= eps) &&
  //       (typeof p.v !== "number" || Math.abs(this.v - p.v) <= eps)
  //     );
  //   }

  //   distanceTo(p: XYLike): number {
  //     const dx = this.x - p.x;
  //     const dy = this.y - p.y;
  //     return Math.hypot(dx, dy);
  //   }

  //   toJSON(): DraggableJSON & { isControlPoint: boolean; r: number } {
  //     return {
  //       x: this.x,
  //       y: this.y,
  //       dragging: this.getIsDragging(),
  //       enabled: this.getIsEnabled(),
  //       isControlPoint: this.isControlPoint,
  //       r: this.r,
  //     };
  //   }
}
