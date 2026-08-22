import Surface, { Bounds } from "../Surface";
import BezierPoint from "./BezierPoint";
import { DraggableJSON } from "../Draggable";
type P5 = any;
export type BezierMode = "FREE" | "ALIGNED" | "MIRRORED" | "AUTOMATIC";
export interface PMapper {
    bezBuffer: any;
    buffer: any;
    bufferWEBGL: any;
    bezierShaderLoaded: boolean;
}
export interface BezierJSONPoint {
    x: number;
    y: number;
}
export interface BezierJSON {
    id: string | number;
    type: "BEZ";
    x: number;
    y: number;
    points: BezierJSONPoint[];
    closed: boolean;
    auto: boolean;
}
export default class BezierMap extends Surface {
    readonly pMapper: PMapper;
    mode: BezierMode;
    r: number;
    /** Points laid out as [anchor, ctrl, ctrl, anchor, ctrl, ctrl, ...] */
    points: BezierPoint[];
    /** Whether first and last anchors connect and have control handles */
    closed: boolean;
    /** Whether control points auto-update (AUTOMATIC mode helper) */
    auto: boolean;
    /** Extra padding around the polygon bounds to avoid clipping the mask */
    private bufferSpace;
    /** Cached shader (mask + image compose) */
    private shaderProg;
    /** Per-instance mask buffer — avoids the shared pMapper.bezBuffer being overwritten
     *  by one BezierMap and corrupting another's rendering in the same frame. */
    private _bezBuffer;
    /** Cached polyline approximation; invalidated when points change */
    private _polylineCache;
    /** Cached bounding box derived from the polyline */
    private _boundsCache;
    constructor(id: string | number, numAnchors: number, pMapper: PMapper, pInst: P5);
    /** Create a closed ring of anchors/controls */
    private initEmpty;
    setAlignedMode(): void;
    setMirroredMode(): void;
    setFreeMode(): void;
    setAutomaticMode(): void;
    /** p5 setting passthrough for curve quality */
    setBezierDetail(num?: number): void;
    isReady(): boolean;
    load(json: DraggableJSON): void;
    getJson(): BezierJSON;
    serialize(): string;
    selectPoints(): BezierPoint | null;
    private selectAnchors;
    private selectControls;
    /** Axis-aligned bounds of the *polyline* approximation (in local coords) */
    getBounds(): Bounds;
    loopIndex(i: number): number;
    /** Sync each BezierPoint's cached index after any mutation of this.points. */
    private _updatePointIndices;
    toggleClosed(): void;
    setDimensions(): void;
    numSegments(): number;
    getSegment(i: number): [BezierPoint, BezierPoint, BezierPoint, BezierPoint];
    addSegment(x?: number, y?: number): void;
    removeSegment(): void;
    getClosestAnchor(): number;
    getNextClosestAnchor(): number;
    autoSetControlPoint(anchorI: number, controlSpacing: number): void;
    autoSetEdgePoints(controlSpacing: number): void;
    autoSetAllControlPoints(controlSpacing?: number): void;
    display(col?: any): void;
    private displayCalib;
    /** Composite an *image* through the Bezier mask using the shader */
    displayTexture(img: any, x?: number, y?: number, texW?: number, texH?: number): void;
    /** Draw a *sketch* into the buffer and then composite it through the mask */
    displaySketch(sketch: (pg: any) => void, x?: number, y?: number, tW?: number, tH?: number): void;
    /** Apply mask (bezBuffer) to pBuffer via shader, draw to screen */
    private displayGraphicsTexture;
    /** Draw img into pg; default size to intrinsic if not provided */
    private drawImage;
    /** Rasterize the white Bezier mask into the mask buffer */
    private displayBezierPG;
    /** Draw the path (no texture) in screen space for previews/calibration */
    private displayBezier;
    displayControlPoints(): void;
    private displayControlLines;
    private displayControlCircles;
    /** Polyline approximation of the curve, in local coords (cached until shape changes) */
    private getPolyline;
    /** Hit-test using the polyline and a ray cast in local space */
    isMouseOver(): boolean;
}
export {};
