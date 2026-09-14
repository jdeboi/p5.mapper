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
