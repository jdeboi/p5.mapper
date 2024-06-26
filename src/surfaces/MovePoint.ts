import p5 from "p5";

import Draggable from "./Draggable";

class MovePoint {
  x: number;
  pInst: p5;
  y: number;
  type: string;
  r: number;
  isControlPoint: boolean;
  parent: Draggable;
  xStartDrag: number;
  yStartDrag: number;
  clickX: number;
  clickY: number;
  col: p5.Color;

  constructor(parent: Draggable, x: number, y: number, pInst: p5) {
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.type = "CPOINT";
    this.r = 8;
    this.isControlPoint = false;
    this.parent = parent;

    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.clickX = 0;
    this.clickY = 0;

    this.col = this.pInst.color(0, 255, 255);
  }

  isMouseOver(): boolean {
    let mx = this.pInst.mouseX;
    let my = this.pInst.mouseY;

    // updated for p5.js 1.9
    mx -= this.pInst.width / 2;
    my -= this.pInst.height / 2;

    let d = this.pInst.dist(
      mx,
      my,
      this.x + this.parent.x,
      this.y + this.parent.y
    );

    return d < this.r;
  }

  set(point: { x: number; y: number }): void {
    this.x = point.x;
    this.y = point.y;
  }

  startDrag(): void {
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.clickX = this.pInst.mouseX;
    this.clickY = this.pInst.mouseY;
  }

  moveToMouse(): void {
    this.x = this.pInst.mouseX - this.pInst.width / 2;
    this.y = this.pInst.mouseY - this.pInst.height / 2;
  }

  moveTo(): void {
    this.x = this.xStartDrag + this.pInst.mouseX - this.clickX;
    this.y = this.yStartDrag + this.pInst.mouseY - this.clickY;
  }

  setControlPoint(cp: boolean): void {
    this.isControlPoint = cp;
  }

  interpolateBetween(
    start: { x: number; y: number },
    end: { x: number; y: number },
    f: number
  ): void {
    this.x = start.x + (end.x - start.x) * f;
    this.y = start.y + (end.y - start.y) * f;
  }

  display(col: p5.Color = this.col): void {
    if ((this.pInst as any).isMovingPoints()) {
      let c = col;
      if (this.isMouseOver()) {
        c = this.pInst.color(255);
      }

      let isLogo = false;
      if (isLogo) {
        c = this.pInst.color(255);
        this.r = 20;
      }

      this.pInst.push();
      this.pInst.translate(0, 0, 5);
      this.pInst.stroke(c);
      this.pInst.strokeWeight(2);
      this.pInst.noFill();

      this.pInst.ellipse(this.x, this.y, this.r * 2);
      this.pInst.fill(c);
      this.pInst.ellipse(this.x, this.y, this.r);
      this.pInst.pop();
    }
  }
}

export default MovePoint;
