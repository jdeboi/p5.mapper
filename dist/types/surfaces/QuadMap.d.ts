import CornerPinSurface from "./CornerPinSurface";
export default class QuadMap extends CornerPinSurface {
    /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */
    private resX;
    private resY;
    /** Cached calibration grid — only rebuilt when the mesh changes */
    private _calibGfx;
    private _calibGfxOffX;
    private _calibGfxOffY;
    private _calibDirty;
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
    /** Set a new (square) resolution and rebuild the base mesh accordingly. */
    setResolution(res: number): void;
}
