import Surface, { PointXY } from "./Surface";
import MovePoint from "./MovePoint";
import { DraggableJSON } from "./Draggable";
export default class PolyMap extends Surface {
    points: MovePoint[];
    constructor(id: string | number, numPoints: number, buffer: any, pInst: any);
    /** Replace all control points from raw coordinates. */
    setPoints(pts: ReadonlyArray<PointXY>): void;
    /**
     * Draw the polygon.
     * When `isUV` is true, Surface has set `textureMode(NORMAL)`,
     * and we pass normalized UVs in [0,1] based on the polygon’s bounds,
     * remapped into the provided rect (u0=v0=0, u1=v1=1 by default).
     */
    protected displaySurface(isUV?: boolean, u0?: number, v0?: number, u1?: number, v1?: number): void;
    displayOutline(col?: any): void;
    /** Draw large handles while calibrating (reuses MovePoint.display). */
    displayControlPoints(): void;
    /**
     * Hit test: check if mouse (in canvas coords) is inside the polygon
     * after offsetting polygon by the surface’s position.
     */
    isMouseOver(): boolean;
    /** Load persisted state (positions only). */
    load(json: DraggableJSON): void;
    /** Persist id/pos/type + point positions. */
    toJSON(): DraggableJSON;
    /**
     * Re-derive every point's render-facing position from its parent-relative
     * local shadow value, via the parent's *current* transform. No-op when
     * unparented.
     *
     * Deliberately does NOT call setDimensions()/setSize() - those recreate
     * this.buffer (a fresh createGraphics() call) whenever the floored
     * width/height changes, and re-deriving from continuously-perturbed
     * floating-point homography output (e.g. every frame while the parent is
     * being dragged) flips that floor by +-1px on a large fraction of frames.
     * Each flip is a new offscreen buffer, and this runs for every parented
     * PolyMap every frame during a parent drag - fast enough to exhaust the
     * browser's WebGL context budget within about a second and crash the
     * whole canvas (observed: dragging a QuadMap with 3 parented PolyMap
     * children went from ~30 canvases to 100+ within one short drag).
     * width/height only gate this.buffer's size for content actually drawn
     * via displaySketch() - displaySurface() and isMouseOver() both already
     * recompute straight from this.points, so a parent-driven reposition
     * (same points, moved - never a structural change) has no correctness
     * need to resize the buffer on every recalc. setPoints()/load() (genuine
     * structural changes) still call setDimensions() themselves.
     */
    recalcFromParent(): void;
    /**
     * Fold this surface's absolute offset (dx,dy) into each point, then
     * convert from absolute screen space into the new parent's local space.
     */
    protected onParentAttached(dx: number, dy: number): void;
    /** Clear parent-relative shadow state so a future re-parent starts clean. */
    protected onParentDetached(): void;
    /** Select a control point for dragging. */
    selectPoints(): MovePoint | null;
}
