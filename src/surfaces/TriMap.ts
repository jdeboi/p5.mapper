// TriMap.ts
import CornerPinSurface from "./CornerPinSurface";

type UVRect = { u0: number; v0: number; u1: number; v1: number };

export default class TriMap extends CornerPinSurface {
  /** Index of the top apex point in the base mesh */
  private TP!: number;

  constructor(
    id: string | number,
    w: number,
    h: number,
    res: number,
    buffer: any,
    pInst: any
  ) {
    super(id, w, h, res, "TRI", buffer, pInst);
    this.setTriMesh();
  }

  /**
   * Returns true if the mouse is over this triangular surface.
   * We evaluate in *local* coordinates (mouse - surface origin).
   */
  public isMouseOver(): boolean {
    const { x, y } = this.getMouseCoords();
    const mx = x - this.x;
    const my = y - this.y;

    return this.isPointInTriangle(
      mx,
      my,
      this.mesh[this.TP],
      this.mesh[this.BL],
      this.mesh[this.BR]
    );
  }

  /**
   * Configure the triangle’s control points:
   * - Apex (TP) at the middle of the top row
   * - Bottom corners are BL and BR (inherited)
   * TL/TR are disabled for this triangle surface
   */
  private setTriMesh(): void {
    // Middle of the top row: x = floor((res-1)/2), y = 0
    const xTop = Math.floor((this.res - 1) / 2);
    this.TP = 0 * this.res + xTop;

    // Make only TP, BL, BR the control points
    this.mesh[this.TP].setControlPoint(true);
    this.mesh[this.TL].setControlPoint(false);
    this.mesh[this.TR].setControlPoint(false);
    this.mesh[this.BL].setControlPoint(true);
    this.mesh[this.BR].setControlPoint(true);

    this.controlPoints = [
      this.mesh[this.TP],
      this.mesh[this.BL],
      this.mesh[this.BR],
    ];
  }

  /**
   * Draw the triangle.
   * When `isUV` is true, Surface has already set `textureMode(NORMAL)`,
   * and we pass UVs in [0,1] using the supplied rect (u0,v0,u1,v1).
   */
  protected displaySurface(isUV = true, u0 = 0, v0 = 0, u1 = 1, v1 = 1): void {
    const p = this.pInst;
    const apex = this.mesh[this.TP];
    const bl = this.mesh[this.BL];
    const br = this.mesh[this.BR];

    // Choose UVs: BL → (u0,v1), TP → mid-top ((u0+u1)/2, v0), BR → (u1,v1)
    const uv: UVRect = { u0, v0, u1, v1 };
    const uMid = (uv.u0 + uv.u1) * 0.5;

    p.beginShape(p.TRIANGLES);

    if (isUV) p.vertex(bl.x, bl.y, uv.u0, uv.v1);
    else p.vertex(bl.x, bl.y);

    if (isUV) p.vertex(apex.x, apex.y, uMid, uv.v0);
    else p.vertex(apex.x, apex.y);

    if (isUV) p.vertex(br.x, br.y, uv.u1, uv.v1);
    else p.vertex(br.x, br.y);

    p.endShape(p.CLOSE);
  }

  /** Optional: show an outline/fill in calibration mode */
  public displayCalibration(): void {
    const p = this.pInst;
    const apex = this.mesh[this.TP];
    const bl = this.mesh[this.BL];
    const br = this.mesh[this.BR];

    p.push();
    p.strokeWeight(2);
    p.stroke(this.controlPointColor);
    p.fill(this.getMutedControlColor());

    p.beginShape();
    p.vertex(bl.x, bl.y);
    p.vertex(apex.x, apex.y);
    p.vertex(br.x, br.y);
    p.endShape(p.CLOSE);

    p.pop();
  }
}
