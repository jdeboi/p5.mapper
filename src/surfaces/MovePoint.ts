// MovePoint.ts
import Draggable, { DraggableJSON, Point } from "./Draggable";

type MovePointOpts = {
  radius?: number; // visual radius in px
  hitScale?: number; // enlarge hit area, e.g. 1.5 = 150%
  color?: any; // p5 color or anything p5.color() accepts
};

export default class MovePoint extends Draggable {
  public type = "CPOINT";
  public r: number;
  public isControlPoint = false;

  protected parent: any;
  protected col: any;
  protected hitScale: number;

  constructor(
    parent: any,
    x: number,
    y: number,
    pInst: any,
    opts: MovePointOpts = {}
  ) {
    super(pInst, x, y);
    this.parent = parent;
    this.r = opts.radius ?? 8;
    this.hitScale = Math.max(1, opts.hitScale ?? 1);
    this.col = opts.color ?? pInst.color(0, 255, 255);
  }

  /** Set x/y from another point-like object */
  set(point: Point): this {
    if (typeof point.x === "number") this.x = point.x;
    if (typeof point.y === "number") this.y = point.y;
    return this;
  }

  /** Back-compat: move this point to current mouse (in parent's local space) */
  moveToMouse(): this {
    const { mxLocal, myLocal } = this.getLocalMouse();
    this.moveTo(mxLocal, myLocal);
    return this;
  }

  /** Mark/unmark as a control point */
  setControlPoint(cp: boolean): this {
    this.isControlPoint = !!cp;
    return this;
  }

  setRadius(r: number): this {
    this.r = Math.max(1, r);
    return this;
  }

  setColor(c: any): this {
    this.col = c;
    return this;
  }

  setHitScale(scale: number): this {
    this.hitScale = Math.max(1, scale);
    return this;
  }

  /** Fast hit test in parent's local coordinates */
  isMouseOver(
    mx: number = this.pInst.mouseX,
    my: number = this.pInst.mouseY
  ): boolean {
    const { mxLocal, myLocal } = this.toLocal(mx, my);
    const dx = mxLocal - this.x;
    const dy = myLocal - this.y;
    const rr = (this.r * this.hitScale) ** 2;
    return dx * dx + dy * dy <= rr;
  }

  /** Interpolate (in-place) between two points by factor f in [0,1] */
  interpolateBetween(start: Point, end: Point, f: number): this {
    this.x = start.x + (end.x - start.x) * f;
    this.y = start.y + (end.y - start.y) * f;
    return this;
  }

  /** Draw the handle; assume caller already translated by parent.x/parent.y */
  display(col: any = this.col) {
    const p = this.pInst;
    if (typeof p.isMovingPoints === "function" && !p.isMovingPoints()) return;

    let c = col;
    if (this.isMouseOver()) c = p.color(255);

    p.push();
    // Slight z offset helps in WEBGL to avoid z-fighting if you need it:
    // p.translate(0, 0, 5);
    p.stroke(c);
    p.strokeWeight(2);
    p.noFill();
    p.ellipse(this.x, this.y, this.r * 2);

    p.fill(c);
    p.noStroke();
    p.ellipse(this.x, this.y, this.r);
    p.pop();
  }

  /** JSON snapshot */
  toJSON(): DraggableJSON & { isControlPoint: boolean; r: number } {
    return {
      x: this.x,
      y: this.y,
      dragging: this.getIsDragging(),
      enabled: this.getIsEnabled(),
      isControlPoint: this.isControlPoint,
      r: this.r,
    };
  }

  // --- helpers -------------------------------------------------------------

  /** Convert a canvas-space point to this point's parent-local space */
  private toLocal(mx: number, my: number) {
    const p = this.pInst;
    const isWEBGL = !!(p as any)?._renderer?.isP3D; // p5 WEBGL flag
    const px = this.parent?.x ?? 0;
    const py = this.parent?.y ?? 0;

    // For WEBGL renderer p5 positions mouse in canvas coords with origin top-left,
    // but your scene coordinates are typically centered; when drawing handles you
    // usually translate(parent.x, parent.y). To test hits in local space, offset by parent:
    const mxLocal = (isWEBGL ? mx - p.width / 2 : mx) - px;
    const myLocal = (isWEBGL ? my - p.height / 2 : my) - py;

    return { mxLocal, myLocal };
  }

  private getLocalMouse() {
    return this.toLocal(this.pInst.mouseX, this.pInst.mouseY);
  }
}
