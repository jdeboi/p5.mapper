import PerspT from "../perspective/PerspT";
import CornerPinSurface from "./CornerPinSurface";

class QuadMap extends CornerPinSurface {
  constructor(id, w, h, res, buffer, pInst) {
    super(id, w, h, res, "QUAD", buffer, pInst);

    // TODO
    this.resX = 20;
    this.resY = 20; // pInst.constrain( pInst.floor(pInst.map(h, 0, 2000, 2, 50)), 2, 50 ); //h / space;
  }

  /**
   * Returns true if the mouse is over this surface, false otherwise.
   */
  isMouseOver() {
    let x = this.pInst.mouseX - this.pInst.width / 2;
    let y = this.pInst.mouseY - this.pInst.height / 2;

    if (
      this.isPointInTriangle(
        x - this.x,
        y - this.y,
        this.mesh[this.TL],
        this.mesh[this.TR],
        this.mesh[this.BL]
      ) ||
      this.isPointInTriangle(
        x - this.x,
        y - this.y,
        this.mesh[this.BL],
        this.mesh[this.TR],
        this.mesh[this.BR]
      )
    )
      return true;
    return false;
  }

  calculateMesh() {
    // The float constructor is deprecated, so casting everything to double

    const srcCorners = [
      0,
      0,
      this.width,
      0,
      this.width,
      this.height,
      0,
      this.height,
    ];
    const dstCorners = [
      this.mesh[this.TL].x,
      this.mesh[this.TL].y,
      this.mesh[this.TR].x,
      this.mesh[this.TR].y,
      this.mesh[this.BR].x,
      this.mesh[this.BR].y,
      this.mesh[this.BL].x,
      this.mesh[this.BL].y,
    ];

    this.perspT = PerspT(srcCorners, dstCorners);

    // this.warpPerspective = new WarpPerspective(transform);

    let xStep = this.width / (this.resX - 1);
    let yStep = this.height / (this.resY - 1);

    for (let i = 0; i < this.mesh.length; i++) {
      if (this.TL == i || this.BR == i || this.TR == i || this.BL == i)
        continue;

      let x = i % this.resX;
      let y = Math.floor(i / this.resX);

      x *= xStep;
      y *= yStep;

      // let point = this.warpPerspective.mapDestPoint(new Point((x, y));
      // this.mesh[i].x = point.getX();
      // this.mesh[i].y = point.getY();
      let dest = this.perspT.transform(x, y);
      this.mesh[i].x = dest[0];
      this.mesh[i].y = dest[1];
    }
  }

  displaySurface(isUV = true, tX = 0, tY = 0, tW = 1, tH = 1) {
    this.pInst.beginShape(this.pInst.TRIANGLES);
    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        if (isUV) this.getQuadTriangles(x, y, tX, tY, tW, tH);
        else this.getQuadTrianglesOutline(x, y);
      }
    }
    this.pInst.endShape(this.pInst.CLOSE);
  }

  displayCalibration() {
    this.displayGrid();
  }

  displayGrid(col = this.controlPointColor) {
    this.pInst.strokeWeight(2); // 2
    this.pInst.stroke(col); // col
    this.pInst.fill(this.getMutedControlColor(col));

    let isLogo = false;
    if (isLogo) {
      this.pInst.strokeWeight(6);
      this.pInst.stroke("white");
      this.pInst.fill(50);
    }

    this.pInst.beginShape(this.pInst.TRIANGLES);

    for (let x = 0; x < this.resX - 1; x++) {
      for (let y = 0; y < this.resY - 1; y++) {
        this.getQuadTrianglesOutline(x, y);
      }
    }
    this.pInst.endShape(this.pInst.CLOSE);
  }

  getQuadTriangles(x, y, tX, tY, tW, tH) {
    ////////////////////////////////
    let mp = this.mesh[x + y * this.resX];
    this.getVertexUV(mp, tX, tY, tW, tH);

    mp = this.mesh[x + 1 + y * this.resX];
    this.getVertexUV(mp, tX, tY, tW, tH);
    // vertex(1, -1, 0, u, 0);

    mp = this.mesh[x + 1 + (y + 1) * this.resX];
    this.getVertexUV(mp, tX, tY, tW, tH);
    // vertex(1, 1, 0, u, v);

    this.getVertexUV(mp, tX, tY, tW, tH);
    // vertex(1, 1, 0, u, v);

    mp = this.mesh[x + (y + 1) * this.resX];
    this.getVertexUV(mp, tX, tY, tW, tH);
    // vertex(-1, 1, 0, 0, v);

    mp = this.mesh[x + y * this.resX];
    this.getVertexUV(mp, tX, tY, tW, tH);
    // vertex(-1, -1, 0, 0, 0);
  }

  getQuadTrianglesOutline(x, y) {
    let mp = this.mesh[x + y * this.resX];
    this.pInst.vertex(mp.x, mp.y);

    mp = this.mesh[x + 1 + y * this.resX];
    this.pInst.vertex(mp.x, mp.y);

    mp = this.mesh[x + 1 + (y + 1) * this.resX];
    this.pInst.vertex(mp.x, mp.y);

    this.pInst.vertex(mp.x, mp.y);

    mp = this.mesh[x + (y + 1) * this.resX];
    this.pInst.vertex(mp.x, mp.y);

    mp = this.mesh[x + y * this.resX];
    this.pInst.vertex(mp.x, mp.y);
  }

  getVertexUV(mp, tX, tY, tW, tH) {
    this.pInst.vertex(
      mp.x,
      mp.y,
      mp.u * this.width * tW - tX,
      mp.v * this.height * tH - tY
    );
  }
}

export default QuadMap;
