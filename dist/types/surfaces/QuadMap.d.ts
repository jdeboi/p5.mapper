import CornerPinSurface from "./CornerPinSurface";
export default class QuadMap extends CornerPinSurface {
    /** Throttle for the interior-point-rejection diagnostic warning below. */
    private _lastRejectLogAt;
    /**
     * Cached render mesh (WEBGL only — buildGeometry/model aren't available in P2D).
     * Rebuilt when the mesh changes or the requested UV rect differs from last time.
     */
    private _geom;
    private _geomDirty;
    private _geomIsUV;
    private _geomU0;
    private _geomV0;
    private _geomU1;
    private _geomV1;
    constructor(id: string | number, w: number, h: number, res: number, buffer: any, pInst: any, resY?: number);
    /**
     * `res` is a target pixel spacing between adjacent mesh vertices, not a
     * division count — divisions per axis are `round(dimension / res)`,
     * independently for width and height, each clamped to [2, MAX_AXIS_RES].
     * A quad twice as wide as another gets roughly twice the horizontal
     * divisions for the same `res`, so mesh density stays visually
     * consistent regardless of a surface's absolute size or aspect ratio,
     * instead of needing `res` hand-tuned per surface (e.g. a small painting
     * vs. a large wall panel). Pass `resY` explicitly (to the constructor or
     * setResolution()) to bypass this entirely and set literal division
     * counts on both axes — e.g. `createQuadMap(w, h, 2, 2)` for the
     * cheapest possible flat quad (a solid-color fill looks identical at
     * any resolution, so there's no reason to pay for interior vertices).
     */
    private static computeAxisRes;
    /**
     * Returns true if the mouse is over this surface.
     * We test in *local* space (mouse - surface origin) against the two triangles.
     */
    isMouseOver(): boolean;
    /**
     * Computes the homography from the source rect → current corner pins,
     * then maps every interior grid point.
     */
    protected calculateMesh(): void;
    /**
     * Draw the tessellated quad as two triangles per cell.
     * When `isUV` is true we pass normalized UVs in [0,1] (Surface sets `textureMode(NORMAL)`).
     * The four extra params are interpreted as [u0, v0, u1, v1].
     *
     * In WEBGL mode the mesh is cached as a p5.Geometry and redrawn with `model()`;
     * it's only rebuilt when the control points moved (`_geomDirty`) or the requested
     * UV rect changed. `buildGeometry`/`model` don't exist in P2D, so that renderer
     * falls back to the original per-frame vertex() immediate-mode path.
     */
    protected displaySurface(isUV?: boolean, u0?: number, v0?: number, u1?: number, v1?: number): void;
    /**
     * Calibration draw: redraw this surface's grid into the single shared
     * calibration buffer (owned by ProjectionMapper), which was already
     * fully cleared once this frame in predraw (see
     * ProjectionMapper.beginCalibFrame() - this can't be a per-surface
     * partial clear+skip-if-unchanged, since surfaces are allowed to overlap
     * on the wall, and one surface's region can't be judged in isolation from
     * its neighbors'). The buffer itself is blitted to screen exactly once
     * per frame by ProjectionMapper.blitCalibSharedGfx() in postdraw, after
     * every surface's displayCalibration() has had a chance to run - so this
     * method must NOT call image()/blit anything itself.
     */
    displayCalibration(): void;
    /** Emit two triangles for a cell with proper UVs (normalized 0..1). */
    private emitQuadAsTrianglesUV;
    /** Emit two triangles for outline/fill only (no UVs). */
    private emitQuadAsTrianglesOutline;
    /**
     * Set a new resolution and rebuild the base mesh accordingly. `resX` is
     * a target pixel spacing between mesh vertices — divisions on both axes
     * are derived from it and this quad's current width/height (see
     * computeAxisRes); pass `resY` explicitly to bypass that and set
     * literal division counts on both axes manually (e.g. `2, 2` for the
     * cheapest possible flat quad). Finer spacing gives a smoother
     * perspective warp under heavy keystoning (matters most for
     * displayTexture/displaySketch content); coarser spacing costs fewer
     * vertices per frame. A solid-color display() fill looks the same at
     * any resolution, so it's a good place to use the literal-2x2 override.
     *
     * Note: changing resolution reindexes the mesh, so any previously
     * calibrated corner pins for this surface will need to be redone.
     */
    setResolution(resX: number, resY?: number): void;
}
