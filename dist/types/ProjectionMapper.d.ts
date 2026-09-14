import QuadMap from "./surfaces/QuadMap";
import TriMap from "./surfaces/TriMap";
import PolyMap from "./surfaces/PolyMap";
import BezierMap from "./surfaces/Bezier/BezierMap";
import LineMap from "./surfaces/LineMap";
import Surface from "./surfaces/Surface";
import Draggable from "./surfaces/Draggable";
type P5 = any;
export interface JsonSurface {
    id: number | string;
    type: "TRI" | "QUAD" | "BEZ" | "POLY";
    x: number;
    y: number;
    [k: string]: any;
}
type Selectable = Surface | LineMap;
declare class ProjectionMapper {
    buffer: P5;
    bufferWEBGL: P5;
    bezBuffer: P5;
    surfaces: Draggable[];
    lines: LineMap[];
    private dragged;
    private selected;
    private pMousePressed;
    private moveMode;
    calibrate: boolean;
    pInst: P5 | null;
    private bezShader;
    bezierShaderLoaded: boolean;
    constructor();
    preload(shader: any): void;
    init(w: number, h: number): void;
    private initPMapperShaderStr;
    /** Creates and registers a new quad surface. */
    createQuadMap(w: number, h: number, res?: number): QuadMap;
    /** Creates and registers a new triangle surface. */
    createTriMap(w: number, h: number, res?: number): TriMap;
    /** Creates and registers a new poly surface. */
    createPolyMap(numPoints?: number): PolyMap;
    /** Creates and registers a new Bezier surface. */
    createBezierMap(numPoints?: number): BezierMap;
    /** Creates and registers a new line. */
    createLineMap(x0?: number, y0?: number, x1?: number, y1?: number): LineMap;
    onClick(): void;
    moveSurfaces(): void;
    moveControlPoints(): void;
    moveAll(): void;
    isMovingPoints(): boolean;
    private checkSurfacesClick;
    private checkPointsClick;
    onDrag(): void;
    onRelease(): void;
    isDragging(surface: Selectable): boolean;
    updateEvents(): void;
    load(filepath?: string, callback?: () => void): void;
    private loadedJson;
    private loadSurfaces;
    private loadLines;
    save(filename?: string): void;
    startCalibration(): void;
    stopCalibration(): void;
    toggleCalibration(): void;
    displayControlPoints(): void;
    private calibSharedGfx;
    private calibSharedGfxW;
    private calibSharedGfxH;
    private calibSharedGfxGeneration;
    /** Lazily creates (or resizes, on canvas resize) the shared calibration buffer. */
    getCalibSharedGfx(): any;
    /** See calibSharedGfxGeneration above. */
    getCalibSharedGfxGeneration(): number;
    /**
     * Blit the shared calibration buffer once, after every surface has had a
     * chance to draw into it this frame; free it the moment calibration mode
     * turns off, so the far more common non-calibrating steady state (and
     * every later re-entry into calibration mode) holds zero calibration-only
     * GPU resources rather than carrying a stale buffer over indefinitely.
     */
    blitCalibSharedGfx(): void;
    getOscillator(seconds: number, offset?: number): number;
    getBezierShader(): any;
}
declare const pMapper: ProjectionMapper;
declare global {
    interface Window {
        p5: any;
    }
}
declare global {
    interface p5 {
        createProjectionMapper(pInst: P5, w?: number, h?: number): ProjectionMapper;
        isCalibratingMapper(): boolean;
        isMovingPoints(): boolean;
        isDragging(surface: Selectable): boolean;
        initPMapperShader(): void;
    }
}
export default pMapper;
