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
    protected parent: any;
    protected col: any;
    protected hitScale: number;
    constructor(parent: any, x: number, y: number, pInst: any, opts?: MovePointOpts);
    /** Set x/y from another point-like object */
    set(point: Point): this;
    /** Back-compat: move this point to current mouse (in parent's local space) */
    moveToMouse(): this;
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
