import p5 from "p5";

class Draggable {
  pInst: p5;
  x: number;
  y: number;
  clickX: number;
  clickY: number;
  xStartDrag: number;
  yStartDrag: number;

  constructor(pInst: p5, x = 0, y = 0) {
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.clickX = 0;
    this.clickY = 0;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
  }

  startDrag(): void {
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.clickX = this.pInst.mouseX;
    this.clickY = this.pInst.mouseY;
  }

  moveTo(): void {
    this.x = this.xStartDrag + this.pInst.mouseX - this.clickX;
    this.y = this.yStartDrag + this.pInst.mouseY - this.clickY;
  }
}

export default Draggable;
