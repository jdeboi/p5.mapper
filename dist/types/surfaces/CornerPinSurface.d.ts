import { DraggableJSON } from "./Draggable";
import MeshPoint from "./MeshPoint";
import Surface from "./Surface";
/**
 * Small interface so any perspective impl just needs a `transform([x,y])`.
 * E.g., wrap your PerspT or homography util here.
 */
interface PerspectiveTransform {
    transform: (pt: [number, number]) => [number, number];
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
