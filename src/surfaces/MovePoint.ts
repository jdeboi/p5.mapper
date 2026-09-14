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

  /**
   * Shadow copy of this point's position, expressed in the *owning
   * surface's parent's* local space, used only while that owning surface
   * has a parentSurface set. x/y stay the render-facing/hit-testing value
   * (what they've always been); localX/localY are the persisted,
   * parent-relative calibration that survives the parent being re-pinned.
   * Populated by Surface.setParent()/onParentAttached() and kept current
   * by moveTo() below; resolved back into x/y by the owning surface's
   * recalcFromParent() (CornerPinSurface.resolveControlPoints() /
   * PolyMap's own override).
   */
  public localX?: number;
  public localY?: number;

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

  /**
   * When the owning surface (this.parent) is itself parented, dragging this
   * point shouldn't write straight into the render-facing x/y — those get
   * overwritten every time the owning surface recalculates from its parent.
   * Instead, resolve the same screen-space drag target (identical math to
   * Draggable.moveTo) through the parent's *current* inverse transform and
   * stash it in localX/localY; the owning surface's recalcFromParent()
   * (triggered right after, e.g. via MeshPoint.moveTo() -> calculateMesh())
   * is what turns that back into real x/y.
   */
  moveTo(x?: number, y?: number): void {
    const ownerParent = this.parent?.parentSurface;
    if (!ownerParent) {
      super.moveTo(x, y);
      // The *owning surface's own* shape just changed because one of its
      // points moved. For a CornerPinSurface this is redundant with (but
      // harmless alongside) the cascade already triggered via
      // MeshPoint.moveTo() -> calculateMesh() -> onPositionChanged(); for a
      // plain MovePoint-based surface (PolyMap has no such recompute step),
      // this is the only place that notification happens, so it can't be
      // dropped.
      this.parent?.onPositionChanged?.();
      return;
    }

    let ax: number;
    let ay: number;
    if (typeof x === "number" && typeof y === "number") {
      ax = x;
      ay = y;
    } else {
      const mx = this.pInst.mouseX;
      const my = this.pInst.mouseY;
      ax = this.xStartDrag + (mx - this.clickX);
      ay = this.yStartDrag + (my - this.clickY);
    }

    const local = ownerParent.resolveToLocal(ax, ay);
    this.localX = local.x;
    this.localY = local.y;
    if (this.getIsDragging()) this.onDragMove?.({ x: this.x, y: this.y });
    // Resolve this point's new local value (and every sibling point's,
    // since recalcFromParent() re-derives all of them) back into real x/y.
    // For a MeshPoint this is redundant with — but harmless alongside —
    // the calculateMesh() call MeshPoint.moveTo() makes right after this
    // method returns; for a plain PolyMap point there is no other trigger,
    // so dropping this would leave x/y stuck at their pre-drag value.
    this.parent?.recalcFromParent?.();
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
    // `_renderer` is stripped when p5 binds instance properties onto `window`
    // in global mode, so check the public `webglVersion` property instead.
    const isWEBGL = p.webglVersion !== "p2d";
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
