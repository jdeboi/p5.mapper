import Draggable from "../surfaces/Draggable";
import MovePoint from "../surfaces/MovePoint";
import p5 from "p5";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface LineMapJson {
  id: number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  lineW: number;
  endCapsOn: boolean;
}

class LineMap extends Draggable {
  id: number;
  x: number;
  y: number;
  type: string;
  lineW: number;
  endCapsOn: boolean;
  lastChecked: number;
  lineC: p5.Color;
  highlightColor: p5.Color;
  p0: MovePoint;
  p1: MovePoint;
  ang: number;

  constructor(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    id: number,
    pInst: p5
  ) {
    super(pInst, 0, 0);

    this.id = id;
    this.x = 0;
    this.y = 0;
    this.type = "LINE";
    this.lineW = 10;
    this.endCapsOn = true;
    this.lastChecked = 0;
    this.lineC = this.pInst.color(255);
    this.highlightColor = this.pInst.color(0, 255, 0);
    // this.controlPointColor = this.getLinearIdColor(this.id);

    this.p0 = new MovePoint(this, x0, y0, this.pInst);
    this.p1 = new MovePoint(this, x1, y1, this.pInst);

    this.leftToRight();

    this.ang = this.pInst.atan2(this.p0.y - this.p1.y, this.p0.x - this.p1.x);
    if (this.ang > this.pInst.PI / 2) this.ang -= 2 * this.pInst.PI;

    this.pInst.strokeCap(this.pInst.SQUARE);
  }

  //////////////////////////////////////////////
  // LOADING / SAVING
  //////////////////////////////////////////////

  load(json: LineMapJson): void {
    this.x = json.x;
    this.y = json.y;
    this.p0.x = json.x0;
    this.p0.y = json.y0;
    this.p1.x = json.x1;
    this.p1.y = json.y1;
    this.lineW =
      json.lineW !== undefined && json.lineW !== null ? json.lineW : 10;
    this.endCapsOn = json.endCapsOn !== undefined ? json.endCapsOn : true;
  }

  getJson(): LineMapJson {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      x0: this.p0.x,
      y0: this.p0.y,
      x1: this.p1.x,
      y1: this.p1.y,
      lineW: this.lineW,
      endCapsOn: this.endCapsOn,
    };
  }

  //////////////////////////////////////////////
  // DISPLAY METHODS
  //////////////////////////////////////////////

  display(col: p5.Color = this.lineC, sw: number = this.lineW): void {
    this.pInst.strokeWeight(sw);

    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);

    this.setOGEndCaps();
    this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    this.drawEndCaps(this.p0, this.p1, col, col);
    this.pInst.pop();
  }

  displayCenterPulse(
    per: number,
    col: p5.Color = this.lineC,
    sw: number = this.lineW
  ): void {
    let midX = (this.p0.x + this.p1.x) / 2;
    let midY = (this.p0.y + this.p1.y) / 2;
    let x0 = this.pInst.map(per, 0, 1.0, midX, this.p0.x);
    let x1 = this.pInst.map(per, 0, 1.0, midX, this.p1.x);
    let y0 = this.pInst.map(per, 0, 1.0, midY, this.p0.y);
    let y1 = this.pInst.map(per, 0, 1.0, midY, this.p1.y);
    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);

    this.setOGEndCaps();
    this.pInst.line(x0, y0, x1, y1);
    this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col);
    this.pInst.pop();
  }

  displayPercent(
    per: number,
    col: p5.Color = this.lineC,
    sw: number = this.lineW
  ): void {
    let p = per;
    let p0 = this.pInst.createVector(this.p0.x, this.p0.y);
    let p1 = this.pInst.createVector(this.p1.x, this.p1.y);
    let pTemp = p5.Vector.lerp(p0, p1, p);
    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);

    this.setOGEndCaps();
    this.pInst.line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
    this.drawEndCaps(p0, pTemp, col, col);
    this.pInst.pop();
  }

  displayPercentWidth(per: number, col: p5.Color = this.lineC): void {
    per = this.pInst.constrain(per, 0, 1.0);
    let sw = this.pInst.map(per, 0, 1.0, 0, 10);
    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);

    this.setOGEndCaps();
    this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    this.drawEndCaps(this.p0, this.p1, col, col, sw);
    this.pInst.pop();
  }

  displayNone(): void {
    this.display(this.pInst.color(0));
  }

  displayRainbowCycle(): void {
    this.pInst.colorMode(this.pInst.HSB, 255);
    let col = this.pInst.color(this.pInst.frameCount % 255, 255, 255);
    this.display(col);
    this.pInst.colorMode(this.pInst.RGB, 255);
  }

  displayGradientLine(
    c1: p5.Color,
    c2: p5.Color,
    per: number,
    phase: number = 1,
    flip: boolean = false
  ): void {
    per += phase;
    per %= 1;

    let spacing = 1.0 / this.pInst.height;
    for (let i = 0; i < 1.0; i += spacing) {
      let grad = (i / 2 + per) % 1;
      let col = this.get2CycleColor(c1, c2, grad);
      this.displaySegment(i, spacing, col);
    }
  }

  getCalibrationHue(): number {
    return (this.id * 15) % 255;
  }

  getControlPointColor(): p5.Color {
    this.pInst.colorMode(this.pInst.HSB, 255);
    let h = this.getCalibrationHue();
    let col = this.pInst.color(h, 80, 255);
    this.pInst.colorMode(this.pInst.RGB);
    return col;
  }

  getCalibrationColor(): p5.Color {
    this.pInst.colorMode(this.pInst.HSB, 255);
    let h = this.getCalibrationHue();
    let col = this.pInst.color(h, 255, 255);
    this.pInst.colorMode(this.pInst.RGB);
    return col;
  }

  //////////////////////////////////////////////
  // DISPLAY HELPERS
  //////////////////////////////////////////////

  displayCalibration(): void {
    if (this.isMouseOver()) {
      this.display(this.pInst.color(200));
    } else {
      this.display(this.getCalibrationColor());
    }
  }

  displayControlPoints(): void {
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.p0.display(this.getControlPointColor());
    this.p1.display(this.getControlPointColor());
    this.pInst.pop();
  }

  setEndCapsOn(): void {
    this.endCapsOn = true;
  }

  setEndCapsOff(): void {
    this.endCapsOn = false;
  }

  drawEndCaps(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    col0: p5.Color = this.lineC,
    col1: p5.Color = this.lineC,
    sw: number = this.lineW
  ): void {
    if (!this.endCapsOn) {
      return;
    }
    this.pInst.noStroke();
    if (this.pInst.dist(p0.x, p0.y, p1.x, p1.y) > 1) {
      this.pInst.fill(col0);
      this.pInst.ellipse(p0.x, p0.y, sw);
      this.pInst.fill(col1);
      this.pInst.ellipse(p1.x, p1.y, sw);
    }
  }

  displaySegment(
    startPer: number,
    sizePer: number,
    col: p5.Color = this.lineC,
    sw: number = this.lineW
  ): void {
    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    let p0 = this.pInst.createVector(this.p0.x, this.p0.y);
    let p1 = this.pInst.createVector(this.p1.x, this.p1.y);
    let pTemp = p5.Vector.lerp(p0, p1, startPer);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    let pTempEnd = p5.Vector.lerp(pTemp, p1, startPer + sizePer);

    this.setOGEndCaps();

    this.pInst.line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
    this.drawEndCaps(pTemp, pTempEnd, col, col);
    this.pInst.pop();
  }

  //////////////////////////////////////////////
  // COLOR HELPERS
  //////////////////////////////////////////////

  setOGEndCaps() {
    if (this.endCapsOn) {
      // this.pInst.strokeCap(this.pInst.ROUND);
    } else {
      this.pInst.strokeCap(this.pInst.SQUARE);
    }
  }
  get2CycleColor(c1: p5.Color, c2: p5.Color, per: number): p5.Color {
    per = this.pInst.constrain(per, 0, 1);
    per *= 2;
    if (per < 1) {
      return this.pInst.lerpColor(c1, c2, per);
    } else {
      per = this.pInst.map(per, 1, 2, 0, 1);
      return this.pInst.lerpColor(c2, c1, per);
    }
  }

  get3CycleColor(c1: p5.Color, c2: p5.Color, per: number): p5.Color {
    per = this.pInst.constrain(per, 0, 1);
    per *= 3;
    if (per < 1) {
      return this.pInst.lerpColor(c1, c2, per);
    } else if (per < 2) {
      per = this.pInst.map(per, 1, 2, 1, 0);
      return this.pInst.lerpColor(c2, c1, per);
    } else {
      per = this.pInst.map(per, 2, 3, 1, 0);
      return this.pInst.lerpColor(c1, c2, per);
    }
  }

  getPointHighlight(p: { x: number; y: number }): void {
    // this.pInst.colorMode(this.pInst.RGB, 255);
    // if (this.isMouseOverPoint(p)) this.pInst.stroke(0, 255, 0);
    // else
    this.pInst.stroke(255, 0, 0);
  }

  //////////////////////////////////////////////
  // CLICK DETECTION
  //////////////////////////////////////////////

  isMouseOver(): boolean {
    let x1 = this.p0.x;
    let y1 = this.p0.y;
    let x2 = this.p1.x;
    let y2 = this.p1.y;
    let px = this.pInst.mouseX - this.pInst.width / 2 - this.x;
    let py = this.pInst.mouseY - this.pInst.height / 2 - this.y;
    let d1 = this.pInst.dist(px, py, x1, y1);
    let d2 = this.pInst.dist(px, py, x2, y2);
    let lineLen = this.pInst.dist(x1, y1, x2, y2);
    let buffer = 0.15 * this.lineW; // higher # = less accurate
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
  }

  isMouseOverCallback(callback: (line: LineMap) => void): void {
    if (this.isMouseOver()) {
      callback(this);
    }
  }

  selectSurface(): Draggable | null {
    if (this.isMouseOver()) {
      this.startDrag();
      return this;
    }
    return null;
  }

  selectPoints(): MovePoint | null {
    if (this.p0.isMouseOver()) {
      this.p0.startDrag();
      return this.p0;
    }
    if (this.p1.isMouseOver()) {
      this.p1.startDrag();
      return this.p1;
    }
    return null;
  }

  //////////////////////////////////////////////
  // OTHER HELPERS
  //////////////////////////////////////////////

  leftToRight(): void {
    if (this.p0.x > this.p1.x) {
      let temp = this.pInst.createVector(this.p0.x, this.p0.y);
      this.p0.set(this.p1);
      this.p1.set(temp);
    }
  }

  rightToLeft(): void {
    if (this.p0.x < this.p1.x) {
      let temp = this.pInst.createVector(this.p0.x, this.p0.y);
      this.p0.set(this.p1);
      this.p1.set(temp);
    }
  }

  displayNumber(): void {
    this.pInst.push();
    this.pInst.translate(this.x + this.p1.x + 20, this.y + this.p1.y + 5, 2);
    this.pInst.textAlign(this.pInst.CENTER, this.pInst.CENTER);

    this.pInst.noStroke();

    this.pInst.fill(255, 0, 0);
    this.pInst.ellipse(0, 0, 10, 10);

    this.pInst.fill(255);
    this.pInst.text(this.id.toString(), 0, 0);

    this.pInst.pop();
  }

  setLineThickness(thickness: number): void {
    this.lineW = thickness;
    if (this.lineW < 0) this.lineW = 0;
  }
}

export default LineMap;
