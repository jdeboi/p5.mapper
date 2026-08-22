import CornerPinSurface from "./CornerPinSurface";
export default class TriMap extends CornerPinSurface {
    /** Index of the top apex point in the base mesh */
    private TP;
    constructor(id: string | number, w: number, h: number, res: number, buffer: any, pInst: any);
    /**
     * Returns true if the mouse is over this triangular surface.
     * We evaluate in *local* coordinates (mouse - surface origin).
     */
    isMouseOver(): boolean;
    /**
     * Configure the triangle’s control points:
     * - Apex (TP) at the middle of the top row
     * - Bottom corners are BL and BR (inherited)
     * TL/TR are disabled for this triangle surface
     */
    private setTriMesh;
    /**
     * Draw the triangle.
     * When `isUV` is true, Surface has already set `textureMode(NORMAL)`,
     * and we pass UVs in [0,1] using the supplied rect (u0,v0,u1,v1).
     */
    protected displaySurface(isUV?: boolean, u0?: number, v0?: number, u1?: number, v1?: number): void;
    /** Optional: show an outline/fill in calibration mode */
    displayCalibration(): void;
}
