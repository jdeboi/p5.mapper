import Surface from "./Surface";
import MovePoint from "./MovePoint";

// TODO
// inside method could be reused in bezier
import { inside } from "../helpers/helpers";

class PolyMap extends Surface {
  constructor(id, numPoints, buffer, pInst) {
    super(id, 0, 0, 0, "POLY", buffer, pInst);

    this.points = [];

    for (let i = 0; i < numPoints; i++) {
      let r = 200;
      let x = r + r * Math.cos((i / numPoints) * 2 * this.pInst.PI);
      let y = r + r * Math.sin((i / numPoints) * 2 * this.pInst.PI);

      let cp = new MovePoint(this, x, y, this.pInst);
      cp.isControlPoint = true;
      this.points.push(cp);
    }

    this.setDimensions(this.points);
  }

  setPoints(pts) {
    this.points = [];
    for (const p of pts) {
      let cp = new MovePoint(this, p.x, p.y, this.pInst);
      cp.isControlPoint = true;
      this.points.push(cp);
    }
  }

  displaySurface(
    isUV = true,
    tX = 0,
    tY = 0,
    tW = this.width,
    tH = this.height
  ) {
    const { x, y } = this.getBounds(this.points);
    this.pInst.beginShape();
    for (const point of this.points) {
      if (isUV) {
        let dx = point.x - x;
        let dy = point.y - y;
        this.pInst.vertex(point.x, point.y, dx * tW - tX, dy * tH - tY);
      } else this.pInst.vertex(point.x, point.y);
    }
    this.pInst.endShape(this.pInst.CLOSE);
  }

  displayControlPoints() {
    this.pInst.push();
    this.pInst.translate(this.x, this.y, 2);
    for (const p of this.points) {
      p.display(this.controlPointColor);
    }
    this.pInst.pop();
  }

  isMouseOver() {
    let p = { x: this.pInst.mouseX, y: this.pInst.mouseY };
    // developed with p5.js 1.4 when WEBGL mode had a different coordinate system
    // (center was origin in WEBGL mode?)
    if (true) {
      p.x -= this.pInst.width / 2;
      p.y -= this.pInst.height / 2;
    }
    let ins = inside(p, this.points, { x: this.x, y: this.y });
    return ins;
  }

  load(json) {
    const { x, y, points } = json;
    this.x = x;
    this.y = y;

    for (const point of points) {
      let mp = this.points[point.i];
      mp.x = point.x;
      mp.y = point.y;
    }
  }

  getJson() {
    let sJson = {};
    sJson.id = this.id;
    sJson.x = this.x;
    sJson.y = this.y;
    sJson.type = this.type;
    sJson.points = [];

    for (let i = 0; i < this.points.length; i++) {
      let point = {};
      point.i = i;
      point.x = this.points[i].x;
      point.y = this.points[i].y;
      sJson.points.push(point);
    }
    return sJson;
  }

  selectSurface() {
    // then, see if the poly itself is selected
    if (this.isMouseOver()) {
      this.startDrag();
      return this;
    }
    return null;
  }

  selectPoints() {
    // check control points
    for (const p of this.points) {
      if (p.isMouseOver()) {
        p.startDrag();
        return p;
      }
    }
    return null;
  }
}

export default PolyMap;
