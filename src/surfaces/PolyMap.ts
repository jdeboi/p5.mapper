import Surface, { PointXY } from "./Surface";
import MovePoint from "./MovePoint";
import { inside } from "../helpers/helpers"; // typed earlier as (point, polygon, offset) => boolean
import Draggable, { DraggableJSON } from "./Draggable";

type PolyPointJSON = { i: number; x: number; y: number };
type PolyJSON = {
  id: string | number;
  type: "POLY";
  x: number;
  y: number;
  points: PolyPointJSON[];
};

export default class PolyMap extends Surface {
  public points: MovePoint[] = [];

  constructor(id: string | number, numPoints: number, buffer: any, pInst: any) {
    // width/height/res are derived from points later; pass 0s for now
    super(id, 0, 0, 2, "POLY", buffer, pInst);

    // seed a regular n-gon
    for (let i = 0; i < numPoints; i++) {
      const r = 200;
      const theta = (i / numPoints) * 2 * this.pInst.PI;
      const x = r + r * Math.cos(theta);
      const y = r + r * Math.sin(theta);
      const cp = new MovePoint(this, x, y, this.pInst).setControlPoint(true);
      this.points.push(cp);
    }

    this.setDimensions(this.points);
  }

  /** Replace all control points from raw coordinates. */
  public setPoints(pts: ReadonlyArray<PointXY>): void {
    this.points = [];
    for (const p of pts) {
      const cp = new MovePoint(this, p.x, p.y, this.pInst).setControlPoint(
        true
      );
      this.points.push(cp);
    }
    this.setDimensions(this.points);
  }

  /**
   * Draw the polygon.
   * When `isUV` is true, Surface has set `textureMode(NORMAL)`,
   * and we pass normalized UVs in [0,1] based on the polygon’s bounds,
   * remapped into the provided rect (u0=v0=0, u1=v1=1 by default).
   */
  protected displaySurface(isUV = true, u0 = 0, v0 = 0, u1 = 1, v1 = 1): void {
    if (this.points.length === 0) return;

    const { x: minX, y: minY, w, h } = this.getBounds(this.points);
    const rw = w > 0 ? w : 1;
    const rh = h > 0 ? h : 1;

    const mapU = (px: number) => u0 + ((px - minX) / rw) * (u1 - u0);
    const mapV = (py: number) => v0 + ((py - minY) / rh) * (v1 - v0);

    const p = this.pInst;
    p.beginShape();
    for (const pt of this.points) {
      if (isUV) {
        p.vertex(pt.x, pt.y, mapU(pt.x), mapV(pt.y));
      } else {
        p.vertex(pt.x, pt.y);
      }
    }
    p.endShape(p.CLOSE);
  }

  public displayOutline(col: any = this.controlPointColor): void {
    const p = this.pInst;
    p.push();
    p.strokeWeight(3);
    p.stroke(col);
    p.fill(this.getMutedControlColor());
    // p.translate(this.x, this.y);
    this.displaySurface(false);
    p.pop();
  }

  /** Draw large handles while calibrating (reuses MovePoint.display). */
  public displayControlPoints(): void {
    const p = this.pInst;
    p.push();
    p.translate(this.x, this.y, 2);
    for (const cp of this.points) cp.display(this.controlPointColor);
    p.pop();
  }

  /**
   * Hit test: check if mouse (in canvas coords) is inside the polygon
   * after offsetting polygon by the surface’s position.
   */
  public isMouseOver(): boolean {
    return inside(this.getMouseCoords(), this.points, { x: this.x, y: this.y });
  }

  /** Load persisted state (positions only). */
  public load(json: DraggableJSON): void {
    const { x, y, points } = json;
    this.x = x;
    this.y = y;

    for (const point of points || []) {
      const mp = this.points[point.i];
      if (!mp) continue;
      mp.x = point.x;
      mp.y = point.y;
    }
    this.setDimensions(this.points);
  }

  /** Persist id/pos/type + point positions. */
  public toJSON(): DraggableJSON {
    const out: DraggableJSON = {
      id: this.id,
      x: this.x,
      y: this.y,
      type: "POLY",
      points: [] as PolyPointJSON[],
    };
    for (let i = 0; i < this.points.length; i++) {
      out.points?.push({ i, x: this.points[i].x, y: this.points[i].y });
    }
    return out;
  }

  /** Select a control point for dragging. */
  public selectPoints(): MovePoint | null {
    for (const cp of this.points) {
      if (cp.isMouseOver()) {
        cp.startDrag();
        return cp;
      }
    }
    return null;
  }
}
