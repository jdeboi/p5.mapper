import CornerPinSurface from "./CornerPinSurface";
export default class QuadMap extends CornerPinSurface {
    /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
    private resX;
    private resY;
    /** Throttle for the interior-point-rejection diagnostic warning below. */
    private _lastRejectLogAt;
    /** True once this surface's own region of the shared calibration buffer needs redrawing. */
    private _calibDirty;
    /**
     * The pMapper.getCalibSharedGfxGeneration() value as of this surface's last
     * draw into the shared buffer. When the buffer itself gets freed and
     * recreated (calibration exit/re-entry, or a canvas resize), every
     * surface's region is blank again even though this surface's own mesh may
     * not have changed - _calibDirty alone can't tell "my mesh changed" apart
     * from "the whole buffer got wiped out from under me", so this is checked
     * alongside it.
     */
    private _calibGfxGenerationDrawn;
    /**
     * this.x/this.y as of this surface's last draw into the shared buffer.
     * Unlike the old per-surface buffer (blitted via image() inside a live
     * translate(this.x, this.y), so a whole-surface drag repositioned it for
     * free with no redraw), this surface's offset is now baked directly into
     * the vertices written into the shared buffer - so a whole-surface drag
     * that doesn't touch the mesh (no calculateMesh() call, no _calibDirty)
     * still needs to be detected and redrawn here, or the old position is
     * left behind as a ghost.
     */
    private _calibDrawnX;
    private _calibDrawnY;
    /** This surface's last-drawn region in the shared buffer, so a subsequent
     *  redraw (position or mesh changed) can clear the *old* spot too - the
     *  new position's clearRect doesn't touch pixels left behind at the old
     *  one. Only meaningful when _calibGfxGenerationDrawn matches the shared
     *  buffer's current generation (a fresh/recreated buffer has nothing to
     *  clear there yet). */
    private _calibLastBox;
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
    constructor(id: string | number, w: number, h: number, res: number, buffer: any, pInst: any);
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
     * Calibration draw: redraw only this surface's own region of the single
     * shared calibration buffer (owned by ProjectionMapper), skipping the
     * redraw entirely on frames where this surface's mesh hasn't changed.
     * The buffer itself is blitted to screen exactly once per frame by
     * ProjectionMapper.blitCalibSharedGfx() in postdraw, after every
     * surface's displayCalibration() has had a chance to run - so this method
     * must NOT call image()/blit anything itself.
     */
    displayCalibration(): void;
    /** Emit two triangles for a cell with proper UVs (normalized 0..1). */
    private emitQuadAsTrianglesUV;
    /** Emit two triangles for outline/fill only (no UVs). */
    private emitQuadAsTrianglesOutline;
    /**
     * Set a new (square) resolution and rebuild the base mesh accordingly.
     * Higher values give a smoother perspective warp under heavy keystoning
     * (matters most for displayTexture/displaySketch content); lower values
     * cost fewer vertices per frame. A solid-color display() fill looks the
     * same at any resolution, so it's a good place to drop this toward 2.
     */
    setResolution(res: number): void;
}
