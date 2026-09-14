import { DraggableJSON } from "./Draggable";
import MeshPoint from "./MeshPoint";
import Surface, { PointXY } from "./Surface";
/**
 * Small interface so any perspective impl just needs transform/transformInverse
 * over a single [x,y] pair. E.g., wrap your PerspT or homography util here.
 * Both directions are required: `transform` (local canonical rect -> pinned
 * screen corners) drives rendering and resolveToScreen(); `transformInverse`
 * (the reverse) drives getTransformedCursor()/resolveToLocal().
 */
interface PerspectiveTransform {
    transform: (pt: [number, number]) => [number, number];
    transformInverse: (pt: [number, number]) => [number, number];
}
export default class CornerPinSurface extends Surface {
    /** grid resolution per axis (res x res points) */
    res: number;
    /** flattened grid of MeshPoints, row-major (y * res + x) */
    protected mesh: MeshPoint[];
    /** top-left, top-right, bottom-right, bottom-left indices into mesh */
    TL: number;
    TR: number;
    BR: number;
    BL: number;
    /** control points are exactly the four corners */
    controlPoints: MeshPoint[];
    /** perspective transform used for inverse cursor mapping */
    private perspectiveTransform;
    constructor(id: string | number, width: number, height: number, res: number, type: string, buffer: any, pInst: any);
    /** index helper (row-major) */
    private idx;
    /** iterate all mesh points */
    private forEachPoint;
    /** build a regular grid + mark corners as control points */
    private initMesh;
    /**
     * Override in subclasses. Compute any per-frame mesh adjustments and
     * (recommended) update `this.perspectiveTransform` so cursor mapping works.
     * Example (pseudo):
     *   const src = [0,0, width,0, width,height, 0,height];
     *   const dst = [TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y];
     *   const persp = PerspT(src, dst); // whatever you use
     *   this.setPerspectiveTransform({ transform: ([x,y]) => persp.transform(x,y) });
     */
    protected calculateMesh(): void;
    /** supply a perspective transform impl (set from calculateMesh) */
    protected setPerspectiveTransform(pt: PerspectiveTransform | null): void;
    /**
     * When parented, resolve each control point's parent-relative local
     * shadow value (MeshPoint.localX/localY) into this surface's real,
     * render-facing .x/.y via the parent's *current* transform. Called as the
     * first step of calculateMesh() (QuadMap/TriMap) so the homography built
     * afterward is always based on the parent's latest calibration. No-op
     * when unparented.
     */
    protected resolveControlPoints(): void;
    /** Re-derive this surface's geometry after the parent's calibration changes. */
    recalcFromParent(): void;
    /**
     * Fold this surface's absolute offset (dx,dy) — what this.x/this.y held
     * right before being parented — into each control point, then convert
     * from absolute screen space into the new parent's local space.
     */
    protected onParentAttached(dx: number, dy: number): void;
    /** Clear parent-relative shadow state so a future re-parent starts clean. */
    protected onParentDetached(): void;
    /**
     * Resolve a point local to this surface's canonical rect into absolute
     * screen coordinates via this surface's own homography (local -> pinned
     * corners), then this surface's own x/y translation (0 when parented).
     */
    resolveToScreen(lx: number, ly: number): PointXY;
    /** Inverse of resolveToScreen — absolute screen coords -> this surface's local canonical rect. */
    resolveToLocal(ax: number, ay: number): PointXY;
    /** JSON → state (applies only stored control points, keeps others) */
    load(json: DraggableJSON): void;
    /** state → JSON (only control points are persisted) */
    toJSON(): DraggableJSON;
    getControlPoints(): MeshPoint[];
    selectPoints(): MeshPoint | null;
    private isMouseOverControlPoints;
    /**
     * Barycentric point-in-triangle test.
     * Kept as a utility in case you want click-to-select by face.
     */
    protected isPointInTriangle(x: number, y: number, a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }, c: {
        x: number;
        y: number;
    }): boolean;
    /** draws corner handles */
    displayControlPoints(): void;
    /**
     * Map a canvas-space point into the surface’s local (pre-warp) space.
     * Requires `this.perspectiveTransform` to be set (e.g., in `calculateMesh`).
     */
    getTransformedCursor(cx: number, cy: number): any;
    getTransformedMouse(): any;
    /** 2D cross product helper (kept for completeness) */
    protected cross2(x0: number, y0: number, x1: number, y1: number): number;
}
export {};
