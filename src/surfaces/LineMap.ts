// LineMap.ts
import { P5 } from "../helpers/helpers";
import Draggable, { DraggableJSON } from "./Draggable";
import MovePoint from "./MovePoint";

export type LineJson = {
  id: string | number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type Vec = { x: number; y: number };

export default class LineMap extends Draggable {
  public id: string | number;
  public type = "LINE";

  public lineW = 10;
  public endCapsOn = true;

  public p0: MovePoint;
  public p1: MovePoint;

  public lineC: any; // p5.Color
  public highlightColor: any; // p5.Color
  public controlPointColor: any; // p5.Color

  private lastChecked = 0;
  private ang = 0;
  private _calibrationColor: any | null = null;
  /** Cached line length; recomputed lazily when endpoints change */
  private _lineLen = 0;
  private _cachedP0x = NaN;
  private _cachedP0y = NaN;
  private _cachedP1x = NaN;
  private _cachedP1y = NaN;

  constructor(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    id: string | number,
    pInst: P5
  ) {
    super(pInst, 0, 0);
    this.id = id;

    this.lineC = this.pInst.color(255);
    this.highlightColor = this.pInst.color(0, 255, 0);
    this.controlPointColor = this.getLinearIdColor(this.id);

    this.p0 = new MovePoint(this, x0, y0, this.pInst);
    this.p1 = new MovePoint(this, x1, y1, this.pInst);

    this.leftToRight();

    // angle (used if needed for orientation)
    this.ang = this.pInst.atan2(this.p0.y - this.p1.y, this.p0.x - this.p1.x);
    if (this.ang > this.pInst.PI / 2) this.ang -= 2 * this.pInst.PI;
  }

  // ------------------------- Loading / Saving ----------------------------

  load(json: DraggableJSON): void {
    this.x = json.x;
    this.y = json.y;
    this.p0.x = json.x0 || 0;
    this.p0.y = json.y0 || 0;
    this.p1.x = json.x1 || 0;
    this.p1.y = json.y1 || 0;
  }

  toJSON(): DraggableJSON {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      x0: this.p0.x,
      y0: this.p0.y,
      x1: this.p1.x,
      y1: this.p1.y,
    };
  }

  // ------------------------------ Display --------------------------------

  display(col: any = this.lineC, sw = this.lineW): void {
    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    this.drawEndCaps(this.p0, this.p1, col, col, sw);
    this.pInst.pop();
  }

  /** Pulses from the center toward endpoints */
  displayCenterPulse(
    per: number,
    col: any = this.lineC,
    sw = this.lineW
  ): void {
    const midX = (this.p0.x + this.p1.x) / 2;
    const midY = (this.p0.y + this.p1.y) / 2;

    const x0 = this.pInst.lerp(midX, this.p0.x, per);
    const y0 = this.pInst.lerp(midY, this.p0.y, per);
    const x1 = this.pInst.lerp(midX, this.p1.x, per);
    const y1 = this.pInst.lerp(midY, this.p1.y, per);

    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.line(x0, y0, x1, y1);
    this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col, sw);
    this.pInst.pop();
  }

  /** Draws the line from p0 to a percent along toward p1 */
  displayPercent(per: number, col: any = this.lineC, sw = this.lineW): void {
    const t = this.pInst.constrain(per, 0, 1);
    const x = this.pInst.lerp(this.p0.x, this.p1.x, t);
    const y = this.pInst.lerp(this.p0.y, this.p1.y, t);

    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.line(this.p0.x, this.p0.y, x, y);
    this.drawEndCaps(this.p0, { x, y }, col, col, sw);
    this.pInst.pop();
  }

  /** Keeps the whole line but varies stroke width by percent */
  displayPercentWidth(per: number, col: any = this.lineC): void {
    const p = this.pInst.constrain(per, 0, 1);
    const sw = this.pInst.map(p, 0, 1, 0, 10);
    this.display(col, sw);
  }

  displayNone(): void {
    this.display(this.pInst.color(0));
  }

  /** HSB hue cycle */
  displayRainbowCycle(): void {
    this.pInst.colorMode(this.pInst.HSB, 255);
    const col = this.pInst.color(this.pInst.frameCount % 255, 255, 255);
    this.display(col);
    this.pInst.colorMode(this.pInst.RGB, 255);
  }

  /** Swept gradient segments along the line */
  displayGradientLine(
    c1: any,
    c2: any,
    per: number,
    phase = 1,
    flip = false
  ): void {
    const t = (per + phase) % 1;
    const spacing = 1.0 / Math.max(1, this.pInst.height);
    const x0 = this.p0.x, y0 = this.p0.y;
    const dx = this.p1.x - x0, dy = this.p1.y - y0;

    // Hoist push/translate/strokeWeight out of the loop — previously each of the
    // ~height iterations called displaySegment() which had its own push/pop/translate
    // and drawEndCaps (2 ellipses each), totalling ~600 push/pop pairs per frame.
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.strokeWeight(this.lineW);

    for (let i = 0; i < 1.0; i += spacing) {
      const grad = (i / 2 + t) % 1;
      const col = this.get2CycleColor(c1, c2, flip ? 1 - grad : grad);
      const t0 = i < 0 ? 0 : i > 1 ? 1 : i;
      const t1 = i + spacing > 1 ? 1 : i + spacing;
      this.pInst.stroke(col);
      this.pInst.line(x0 + t0 * dx, y0 + t0 * dy, x0 + t1 * dx, y0 + t1 * dy);
    }

    this.pInst.pop();
  }

  getCalibrationColor(): any {
    if (!this._calibrationColor) {
      const p = this.pInst;
      p.colorMode(p.HSB, 255);
      this._calibrationColor = p.color(p.hue(this.controlPointColor), 180, 255);
      p.colorMode(p.RGB);
    }
    return this._calibrationColor;
  }

  private getLinearIdColor(id: string | number): any {
    const n = typeof id === "number" ? id : this.hashString(id.toString());
    this.pInst.colorMode(this.pInst.HSB, 255);
    const h = (n * 15) % 255;
    const col = this.pInst.color(h, 255, 255);
    this.pInst.colorMode(this.pInst.RGB);
    return col;
  }

  // --------------------------- Display helpers ---------------------------

  displayCalibration(): void {
    if (this.isMouseOver()) this.display(this.pInst.color(255));
    else this.display(this.getCalibrationColor());
  }

  displayControlPoints(): void {
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.p0.display(this.controlPointColor);
    this.p1.display(this.controlPointColor);
    this.pInst.pop();
  }

  setEndCapsOn(): void {
    this.endCapsOn = true;
  }
  setEndCapsOff(): void {
    this.endCapsOn = false;
  }

  private drawEndCaps(
    p0: Vec,
    p1: Vec,
    col0: any = this.lineC,
    col1: any = this.lineC,
    sw = this.lineW
  ): void {
    if (!this.endCapsOn) return;
    const ex = p1.x - p0.x, ey = p1.y - p0.y;
    if (ex * ex + ey * ey <= 1) return; // squared distance avoids Math.sqrt

    this.pInst.noStroke();
    this.pInst.fill(col0);
    this.pInst.ellipse(p0.x, p0.y, sw);
    this.pInst.fill(col1);
    this.pInst.ellipse(p1.x, p1.y, sw);
  }

  /** Draws a segment between t in [startPer, startPer+sizePer] */
  displaySegment(
    startPer: number,
    sizePer: number,
    col: any = this.lineC,
    sw = this.lineW
  ): void {
    const t0 = this.pInst.constrain(startPer, 0, 1);
    const t1 = this.pInst.constrain(startPer + sizePer, 0, 1);

    const x0 = this.pInst.lerp(this.p0.x, this.p1.x, t0);
    const y0 = this.pInst.lerp(this.p0.y, this.p1.y, t0);
    const x1 = this.pInst.lerp(this.p0.x, this.p1.x, t1);
    const y1 = this.pInst.lerp(this.p0.y, this.p1.y, t1);

    this.pInst.strokeWeight(sw);
    this.pInst.stroke(col);

    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.line(x0, y0, x1, y1);
    this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col, sw);
    this.pInst.pop();
  }

  // ------------------------------ Color utils ----------------------------

  get2CycleColor(c1: any, c2: any, per: number): any {
    const t = this.pInst.constrain(per, 0, 1) * 2;
    if (t < 1) return this.pInst.lerpColor(c1, c2, t);
    return this.pInst.lerpColor(c2, c1, this.pInst.map(t, 1, 2, 0, 1));
  }

  get3CycleColor(c1: any, c2: any, per: number): any {
    const t = this.pInst.constrain(per, 0, 1) * 3;
    if (t < 1) return this.pInst.lerpColor(c1, c2, t);
    if (t < 2)
      return this.pInst.lerpColor(c2, c1, this.pInst.map(t, 1, 2, 1, 0));
    return this.pInst.lerpColor(c1, c2, this.pInst.map(t, 2, 3, 1, 0));
  }

  getPointHighlight(_p: Vec): void {
    // You can enhance hover visuals here if desired.
    this.pInst.stroke(255, 0, 0);
  }

  // ---------------------------- Hit detection ----------------------------

  /** Local-space hit test against the line (distance-to-segment) */
  isMouseOver(): boolean {
    const x1 = this.p0.x, y1 = this.p0.y;
    const x2 = this.p1.x, y2 = this.p1.y;

    // Recompute line length only when endpoints have moved
    if (x1 !== this._cachedP0x || y1 !== this._cachedP0y ||
        x2 !== this._cachedP1x || y2 !== this._cachedP1y) {
      const dx = x2 - x1, dy = y2 - y1;
      this._lineLen = Math.sqrt(dx * dx + dy * dy);
      this._cachedP0x = x1; this._cachedP0y = y1;
      this._cachedP1x = x2; this._cachedP1y = y2;
    }
    if (this._lineLen < 1e-6) return false;

    const { x: mx, y: my } = this.getMouseCoords();
    const px = mx - this.x;
    const py = my - this.y;

    const t = this.clamp(this.projectParam(px, py, x1, y1, x2, y2), 0, 1);
    const cx = x1 + t * (x2 - x1);
    const cy = y1 + t * (y2 - y1);

    const tol = Math.max(2, this.lineW * 0.6);
    const dx = px - cx, dy = py - cy;
    return dx * dx + dy * dy <= tol * tol;
  }

  isMouseOverCallback(callback: (self: LineMap) => void): void {
    if (this.isMouseOver()) callback(this);
  }

  selectPoints() {
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

  // ------------------------------ Utilities ------------------------------

  leftToRight(): void {
    if (this.p0.x > this.p1.x) {
      const tmp = this.pInst.createVector(this.p0.x, this.p0.y);
      this.p0.set(this.p1);
      this.p1.set(tmp);
    }
  }

  rightToLeft(): void {
    if (this.p0.x < this.p1.x) {
      const tmp = this.pInst.createVector(this.p0.x, this.p0.y);
      this.p0.set(this.p1);
      this.p1.set(tmp);
    }
  }

  displayNumber(): void {
    this.pInst.push();
    this.pInst.noStroke();
    this.pInst.fill(255);
    const mx = (this.p0.x + this.p1.x) / 2;
    const my = (this.p0.y + this.p1.y) / 2;
    this.pInst.text(this.id.toString(), this.x + mx + 10, this.y + my);
    this.pInst.pop();
  }

  // param of projection of P onto AB
  private projectParam(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number
  ): number {
    const vx = bx - ax,
      vy = by - ay;
    const wx = px - ax,
      wy = py - ay;
    const vv = vx * vx + vy * vy;
    if (vv <= 1e-12) return 0;
    return (wx * vx + wy * vy) / vv;
  }

  private clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  private hashString(s: string): number {
    // simple, stable string hash for color variation
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
}
