import Draggable, { DraggableJSON } from "./Draggable";
import { P5 } from "../helpers/helpers";
export interface Bounds {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface PointXY {
    x: number;
    y: number;
}
/**
 * Base surface: owns dimensions, a p5 buffer, and rendering hooks.
 * Subclasses should override `displaySurface`.
 */
export default class Surface extends Draggable {
    id: string | number;
    type: string;
    res: number;
    width: number;
    height: number;
    controlPointColor: any;
    buffer: any;
    protected pInst: P5;
    private rafHandle;
    private _mutedColor;
    /**
     * @param id        Identifier for the surface
     * @param w         width in px
     * @param h         height in px
     * @param res       grid resolution per axis (>= 2)
     * @param type      e.g. "QUAD" | "TRI"
     * @param buffer    optional p5.Graphics to draw into
     * @param pInst     p5 instance
     */
    constructor(id: string | number, w: number, h: number, res: number, type: string, buffer: any | null, pInst: P5);
    /** internal: create a 2D buffer and clear it */
    private createBuffer;
    /** Muted version of a p5 color (alpha default 50). Cached for the common default call. */
    getMutedControlColor(col?: any, alpha?: number): any;
    /** Clear buffer to a color and then draw the textured surface using that buffer */
    display(col?: any): void;
    /**
     * Override in subclasses to issue the actual geometry draw calls, e.g.:
     * - with texture:    isUV=true, arguments are [u0, v0, u1, v1]
     * - without texture: isUV=false, arguments are ignored
     */
    protected displaySurface(isUV?: boolean, u0?: number, v0?: number, u1?: number, v1?: number): void;
    /**
     * Draw a sketch into this.surface's buffer, then render that buffer as texture.
     * @param sketch draws into provided p5.Graphics
     * @param tX     source crop x (pixels) OR u0 if texW <= 0
     * @param tY     source crop y (pixels) OR v0 if texH <= 0
     * @param texW   source crop width (pixels). If <=0, treat tX,tY as u0,v0.
     * @param texH   source crop height (pixels). If <=0, treat as full [u1,v1]=[1,1].
     */
    displaySketch(sketch: (g: any) => void, tX?: number, tY?: number, texW?: number, texH?: number): void;
    /**
     * Render a texture onto the surface.
     * Two modes:
     *  1) Crop mode (texW>0 && texH>0): (tX,tY,texW,texH) in source pixels → mapped to UV [u0,v0,u1,v1]
     *  2) UV mode   (texW<=0 || texH<=0): (tX,tY) are u0,v0; u1=v1=1 by default
     */
    displayTexture(tex: any, tX?: number, tY?: number, texW?: number, texH?: number): void;
    /** Outline + fill overlay used in calibration mode */
    displayCalibration(): void;
    /** Draws the outline (no texture). Subclass displaySurface(false) should render the shape edges. */
    displayOutline(col?: any): void;
    /** Compare lightweight identity (id+type) */
    isEqual(json: {
        id: string | number;
        type: string;
    }): boolean;
    /** Compute tight bounds of an array of {x,y} points */
    getBounds(points: ReadonlyArray<PointXY>): Bounds;
    /**
     * Set width/height from points’ bounds (does not move the surface position).
     * If buffer size changes, we recreate it.
     */
    setDimensions(points: ReadonlyArray<PointXY>): void;
    /** Explicitly resize surface; recreates buffer if dimensions changed. */
    setSize(w: number, h: number): void;
    /** rAF-based debounce for heavy recomputes in subclasses */
    scheduleCalculateMesh(): void;
    displayControlPoints(): void;
    /** Basic JSON snapshot (dimensions + identity) */
    toJSON(): DraggableJSON;
}
