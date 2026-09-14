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
     * Optional parent surface. When set, this surface's own x/y is pinned to
     * (0,0) and its calibration is expressed relative to the parent's local
     * pre-warp space instead of absolute screen coordinates — see
     * resolveToScreen/resolveToLocal and setParent(). Nesting is one level
     * only: a parent cannot itself have a parent, and a surface with children
     * cannot be given a parent (enforced in setParent()).
     */
    parentSurface: Surface | null;
    protected children: Surface[];
    /**
     * @param id        Identifier for the surface
     * @param w         width in px
     * @param h         height in px
     * @param res       grid resolution per axis (>= 2). Meaningful for QuadMap, where it
     *                  sets the density of the mesh used to tessellate the perspective
     *                  warp — see `CornerPinSurface` and the resolution notes in
     *                  reference/README.md. TriMap accepts the same param but always
     *                  renders as a single flat (untessellated) triangle, so there `res`
     *                  only affects where the apex control point is placed at construction.
     * @param type      e.g. "QUAD" | "TRI"
     * @param buffer    optional p5.Graphics to draw into
     * @param pInst     p5 instance
     */
    constructor(id: string | number, w: number, h: number, res: number, type: string, buffer: any | null, pInst: P5);
    /** internal: create a 2D buffer and clear it */
    private createBuffer;
    /** Muted version of a p5 color (alpha default 50). Cached for the common default call. */
    getMutedControlColor(col?: any, alpha?: number): any;
    /** Fill the surface's mesh directly with a solid color (no offscreen buffer/texture needed) */
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
    /**
     * Resolve a point local to this surface into absolute screen coordinates.
     * Default (no perspective warp): plain translate by this.x/this.y — this
     * is exactly today's implicit behavior for every unparented surface, and
     * remains correct for PolyMap (no warp) without needing an override.
     * CornerPinSurface overrides this to route through its homography.
     */
    resolveToScreen(lx: number, ly: number): PointXY;
    /** Inverse of resolveToScreen — absolute screen coords -> this surface's local space. */
    resolveToLocal(ax: number, ay: number): PointXY;
    /**
     * Re-derive this surface's render-facing geometry from its stored
     * parent-relative calibration, using the parent's *current* transform.
     * No-op when there's no parent. Overridden by CornerPinSurface
     * (-> calculateMesh()) and PolyMap (-> re-resolve each point).
     */
    recalcFromParent(): void;
    /**
     * Subclass hook: fold this surface's own point storage by (dx,dy) — the
     * absolute offset this surface's x/y held right before being parented —
     * and convert those points into parent-relative local coordinates via
     * `this.parentSurface!.resolveToLocal()`. Called once, from setParent(),
     * after this.parentSurface is set and this.x/this.y have been zeroed.
     */
    protected onParentAttached(dx: number, dy: number): void;
    /**
     * Subclass hook: freeze this surface's current resolved absolute position
     * into its own point storage and clear any parent-relative local shadow
     * state, so a future re-parent starts clean. Called once, from
     * setParent(null), while this.parentSurface still points at the old parent.
     */
    protected onParentDetached(): void;
    /**
     * Attach (or clear, via null) this surface's parent. Nesting is one level
     * only: rejects making a surface its own parent, rejects a target that
     * already has a parent (would create depth > 1, and structurally rules
     * out an A<->B swap cycle since if `this` is already `target`'s parent,
     * `target.parentSurface` is non-null), and rejects giving a parent to a
     * surface that already has children (would make it a grandchild-producing
     * middle node from the other direction).
     *
     * `opts.fromLoad` is for ProjectionMapper's loader only: load() (see
     * CornerPinSurface/PolyMap) already reads this surface's parent-relative
     * calibration straight out of the saved file into the local shadow
     * fields, *before* setParent() runs (parent/child relationships are
     * reattached in a second pass, after every surface has loaded its own
     * saved position). The normal (interactive) attach path instead *derives*
     * those local values by folding this surface's current absolute position
     * through the parent's transform (onParentAttached) — which, at load
     * time, would clobber the just-loaded real values with junk computed
     * from this surface's stale pre-load default-seed position. fromLoad
     * skips that fold and only resolves the (already-correct) local values
     * into real x/y.
     */
    setParent(parent: Surface | null, opts?: {
        fromLoad?: boolean;
    }): this;
    getParent(): Surface | null;
    /**
     * Whole-surface rigid dragging is disabled once parented: a raw
     * screen-space mouse delta applied to this.x/this.y is only approximately
     * correct once the parent has any keystone (exact at its center, worse
     * toward its edges), unlike per-point dragging (which goes through
     * resolveToLocal and stays exact). Per-point dragging remains the only
     * way to position/adjust a parented child.
     */
    selectDraggable(): this | null;
    /** Fan a position change out to any children so they re-derive their own geometry. */
    protected onPositionChanged(): void;
}
