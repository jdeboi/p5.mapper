import MeshPoint from "./MeshPoint";
import MovePoint from "./MovePoint";
import BezierPoint from "./Bezier/BezierPoint";
export type Point = {
    x: number;
    y: number;
    u?: number;
    v?: number;
};
export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
};
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
    points?: Array<{
        i: number;
        x: number;
        y: number;
        u?: number;
        v?: number;
    }>;
}
export default class Draggable {
    protected pInst: any;
    x: number;
    y: number;
    protected clickX: number;
    protected clickY: number;
    protected xStartDrag: number;
    protected yStartDrag: number;
    private _dragging;
    private _enabled;
    private _bounds;
    private _grid;
    private _axis;
    onDragStart?: (pos: Point) => void;
    onDragMove?: (pos: Point) => void;
    onDragEnd?: (pos: Point) => void;
    constructor(pInst: any, x?: number, y?: number);
    /** Enable/disable dragging */
    setEnabled(enabled: boolean): this;
    get enabled(): boolean;
    /** Optional axis lock */
    setLockAxis(axis: AxisLock): this;
    /** Constrain moves to a rectangle */
    setBounds(bounds: Rect | null): this;
    /** Snap moves to a grid step, e.g., [10,10]; set null to disable */
    setGrid(step: number | [number, number] | null): this;
    /** Begin dragging from the given pointer (defaults to p5 mouse) */
    startDrag(mx?: number, my?: number): void;
    /**
     * Legacy behavior: if called with no args, follow current mouse delta.
     * Modern behavior: if x,y provided, move absolutely to (x,y).
     */
    moveTo(x?: number, y?: number): void;
    /** Relative move */
    translate(dx: number, dy: number): void;
    getIsDragging(): boolean;
    getIsEnabled(): boolean;
    /** Update dragging with current pointer */
    updateDrag(mx: number, my: number): void;
    /** Finish dragging */
    endDrag(): void;
    selectDraggable(): this | null;
    selectPoints(): BezierPoint | MovePoint | MeshPoint | null;
    get isDragging(): boolean;
    /** Directly set position without dragging lifecycle */
    set(pos: Partial<Point>): this;
    getMouseCoords(): Point;
    /** Override in subclasses to provide hit testing for selection */
    isMouseOver(): boolean;
    /** Apply axis lock, bounds, and grid snapping */
    protected applyConstraints(nx: number, ny: number): Point;
    /** Clamp current x/y to bounds (if any) */
    protected applyBounds(): void;
    toJSON(): DraggableJSON;
    load(data: DraggableJSON): void;
    isEqual(json: {
        id: string | number;
        type: string;
    }): boolean;
}
