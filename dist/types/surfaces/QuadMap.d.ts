import CornerPinSurface from "./CornerPinSurface";
export default class QuadMap extends CornerPinSurface {
    /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
    private resX;
    private resY;
    /**
     * Hard ceiling on the calibration overlay's offscreen buffer, in pixels per
     * axis. Well under every GPU's real MAX_TEXTURE_SIZE/MAX_RENDERBUFFER_SIZE
     * floor (even old/software renderers), and far larger than any canvas the
     * overlay actually needs to cover.
     */
    private static readonly MAX_CALIB_GFX_DIM;
    /** Throttle for the interior-point-rejection diagnostic warning below. */
    private _lastRejectLogAt;
    /** Cached calibration grid — only rebuilt when the mesh changes */
    private _calibGfx;
    private _calibGfxCapW;
    private _calibGfxCapH;
    /** Rate limit for the buffer's actual (re)allocation — see _rebuildCalibGfx. */
    private _lastCalibGfxAllocAt;
    private _calibGfxOffX;
    private _calibGfxOffY;
    private _calibDirty;
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
    /** Calibration draw: blit a cached grid image instead of re-tessellating every frame */
    displayCalibration(): void;
    /** Render the grid mesh into an offscreen 2D buffer once; reused until mesh changes. */
    private _rebuildCalibGfx;
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
