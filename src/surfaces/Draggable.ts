import MeshPoint from "./MeshPoint";
import MovePoint from "./MovePoint";
import BezierPoint from "./Bezier/BezierPoint";

// Draggable.ts
export type Point = { x: number; y: number; u?: number; v?: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type AxisLock = "none" | "x" | "y";

export interface DraggableJSON {
  id?: string | number;
  x: number;
  y: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  dragging?: boolean;
  enabled?: boolean;
  type?: string;
  res?: number;
  width?: number;
  height?: number;
  closed?: boolean;
  auto?: boolean;
  points?: Array<{ i: number; x: number; y: number; u?: number; v?: number }>;
}

export default class Draggable {
  protected pInst: any;

  public x = 0;
  public y = 0;

  protected clickX = 0;
  protected clickY = 0;
  protected xStartDrag = 0;
  protected yStartDrag = 0;

  private _dragging = false;
  private _enabled = true;

  private _bounds: Rect | null = null; // constrain position if set
  private _grid: [number, number] | null = null; // snap step [gx, gy]
  private _axis: AxisLock = "none"; // lock movement to an axis

  // Optional hooks
  public onDragStart?: (pos: Point) => void;
  public onDragMove?: (pos: Point) => void;
  public onDragEnd?: (pos: Point) => void;

  constructor(pInst: any, x = 0, y = 0) {
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.xStartDrag = x;
    this.yStartDrag = y;
  }

  /** Enable/disable dragging */
  setEnabled(enabled: boolean) {
    this._enabled = !!enabled;
    if (!this._enabled && this._dragging) this.endDrag();
    return this;
  }
  get enabled() {
    return this._enabled;
  }

  /** Optional axis lock */
  setLockAxis(axis: AxisLock) {
    this._axis = axis;
    return this;
  }

  /** Constrain moves to a rectangle */
  setBounds(bounds: Rect | null) {
    this._bounds = bounds;
    // Clamp immediately if we already sit outside
    this.applyBounds();
    return this;
  }

  /** Snap moves to a grid step, e.g., [10,10]; set null to disable */
  setGrid(step: number | [number, number] | null) {
    if (step == null) this._grid = null;
    else
      this._grid = Array.isArray(step)
        ? [Math.max(1, step[0]), Math.max(1, step[1])]
        : [Math.max(1, step), Math.max(1, step)];
    return this;
  }

  /** Begin dragging from the given pointer (defaults to p5 mouse) */
  startDrag(mx: number = this.pInst.mouseX, my: number = this.pInst.mouseY) {
    if (!this._enabled) return;
    this._dragging = true;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.clickX = mx;
    this.clickY = my;
    this.onDragStart?.({ x: this.x, y: this.y });
  }

  /**
   * Legacy behavior: if called with no args, follow current mouse delta.
   * Modern behavior: if x,y provided, move absolutely to (x,y).
   */
  moveTo(x?: number, y?: number) {
    if (typeof x === "number" && typeof y === "number") {
      // absolute move
      const pos = this.applyConstraints(x, y);
      this.x = pos.x;
      this.y = pos.y;
      if (this._dragging) this.onDragMove?.({ x: this.x, y: this.y });
      return;
    }

    // legacy: follow pointer delta since startDrag
    const mx = this.pInst.mouseX;
    const my = this.pInst.mouseY;
    const nx = this.xStartDrag + (mx - this.clickX);
    const ny = this.yStartDrag + (my - this.clickY);
    const pos = this.applyConstraints(nx, ny);
    this.x = pos.x;
    this.y = pos.y;
    if (this._dragging) this.onDragMove?.({ x: this.x, y: this.y });
  }

  /** Relative move */
  translate(dx: number, dy: number) {
    this.moveTo(this.x + dx, this.y + dy);
  }

  getIsDragging() {
    return this._dragging;
  }
  getIsEnabled() {
    return this._enabled;
  }

  /** Update dragging with current pointer */
  updateDrag(mx: number, my: number) {
    if (!this._dragging) return;
    const nx = this.xStartDrag + (mx - this.clickX);
    const ny = this.yStartDrag + (my - this.clickY);
    const pos = this.applyConstraints(nx, ny);
    this.x = pos.x;
    this.y = pos.y;
    this.onDragMove?.({ x: this.x, y: this.y });
  }

  /** Finish dragging */
  endDrag() {
    if (!this._dragging) return;
    this._dragging = false;
    this.onDragEnd?.({ x: this.x, y: this.y });
  }

  selectDraggable() {
    // if the surface itself is selected
    if (this.isMouseOver()) {
      this.startDrag();
      return this;
    }
    return null;
  }

  //   /** Override in subclasses to provide selection */
  selectPoints(): BezierPoint | MovePoint | MeshPoint | null {
    throw new Error("selectPoints() must be implemented by subclass");
  }

  get isDragging() {
    return this._dragging;
  }

  /** Directly set position without dragging lifecycle */
  set(pos: Partial<Point>) {
    const nx = typeof pos.x === "number" ? pos.x : this.x;
    const ny = typeof pos.y === "number" ? pos.y : this.y;
    const p = this.applyConstraints(nx, ny);
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  getMouseCoords(): Point {
    const mx = this.pInst.mouseX - this.pInst.width / 2;
    const my = this.pInst.mouseY - this.pInst.height / 2;
    return { x: mx, y: my };
  }

  /** Override in subclasses to provide hit testing for selection */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMouseOver(): boolean {
    // Base has no shape; subclasses (e.g., handle, rectangle) should override.
    console.error("isMouseOver() must be implemented by subclass");
    return false;
  }

  /** Apply axis lock, bounds, and grid snapping */
  protected applyConstraints(nx: number, ny: number): Point {
    // axis lock
    if (this._axis === "x") ny = this.y;
    else if (this._axis === "y") nx = this.x;

    // bounds
    if (this._bounds) {
      const { x, y, w, h } = this._bounds;
      nx = clamp(nx, x, x + w);
      ny = clamp(ny, y, y + h);
    }

    // grid
    if (this._grid) {
      const [gx, gy] = this._grid;
      nx = Math.round(nx / gx) * gx;
      ny = Math.round(ny / gy) * gy;
    }

    return { x: nx, y: ny };
  }

  /** Clamp current x/y to bounds (if any) */
  protected applyBounds() {
    if (!this._bounds) return;
    const p = this.applyConstraints(this.x, this.y);
    this.x = p.x;
    this.y = p.y;
  }

  toJSON(): DraggableJSON {
    return {
      x: this.x,
      y: this.y,
      dragging: this.getIsDragging(),
      enabled: this.getIsEnabled(),
    };
  }

  //   override load
  load(data: DraggableJSON) {
    throw new Error("load() must be implemented by subclass");
  }

  //   override isEqual
  isEqual(json: { id: string | number; type: string }): boolean {
    throw new Error("isEqual() must be implemented by subclass");
    return true;
  }
}

function clamp(n: number, a: number, b: number) {
  return n < a ? a : n > b ? b : n;
}
