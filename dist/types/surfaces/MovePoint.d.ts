import Draggable, { DraggableJSON, Point } from "./Draggable";
type MovePointOpts = {
    radius?: number;
    hitScale?: number;
    color?: any;
};
export default class MovePoint extends Draggable {
    type: string;
    r: number;
    isControlPoint: boolean;
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
    localX?: number;
    localY?: number;
    protected parent: any;
    protected col: any;
    protected hitScale: number;
    constructor(parent: any, x: number, y: number, pInst: any, opts?: MovePointOpts);
    /** Set x/y from another point-like object */
    set(point: Point): this;
    /** Back-compat: move this point to current mouse (in parent's local space) */
    moveToMouse(): this;
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
    moveTo(x?: number, y?: number): void;
    /** Mark/unmark as a control point */
    setControlPoint(cp: boolean): this;
    setRadius(r: number): this;
    setColor(c: any): this;
    setHitScale(scale: number): this;
    /** Fast hit test in parent's local coordinates */
    isMouseOver(mx?: number, my?: number): boolean;
    /** Interpolate (in-place) between two points by factor f in [0,1] */
    interpolateBetween(start: Point, end: Point, f: number): this;
    /** Draw the handle; assume caller already translated by parent.x/parent.y */
    display(col?: any): void;
    /** JSON snapshot */
    toJSON(): DraggableJSON & {
        isControlPoint: boolean;
        r: number;
    };
    /** Convert a canvas-space point to this point's parent-local space */
    private toLocal;
    private getLocalMouse;
}
export {};
