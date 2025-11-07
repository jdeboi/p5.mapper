// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

// ControlPoint.ts
import Draggable, { Point } from "../Draggable";
type P5 = any;

type P5Vec = {
  x: number;
  y: number;
  set: (x: number, y: number) => void;
  add: (x: number, y: number) => void;
};

export type PathMode = "AUTOMATIC" | "ALIGNED" | "MIRRORED" | "FREE";

export interface ParentPath {
  x: number;
  y: number;
  points: BezierPoint[];
  mode: PathMode;
  auto?: boolean;
  controlPointColor: any;
  loopIndex(i: number): number;
  autoSetAllControlPoints(): void;
  setDimensions(): void;
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx,
    dy = ay - by;
  return Math.hypot(dx, dy);
}

function setFromAnchorAlong(
  out: { set: (x: number, y: number) => void },
  ax: number,
  ay: number,
  px: number,
  py: number,
  length: number
) {
  // dir = anchor - point (keeps handles collinear)
  let dx = ax - px,
    dy = ay - py;
  const mag = Math.hypot(dx, dy) || 1;
  dx = (dx / mag) * length;
  dy = (dy / mag) * length;
  out.set(ax + dx, ay + dy);
}

function mirrorAcrossAnchor(
  out: { set: (x: number, y: number) => void },
  ax: number,
  ay: number,
  px: number,
  py: number
) {
  // out = anchor + (anchor - point)
  out.set(2 * ax - px, 2 * ay - py);
}

export default class BezierPoint extends Draggable {
  public readonly pInst: P5;
  public readonly parentPath: ParentPath;

  public type = "CPOINT";
  public r = 8;

  /** Local position (mirrors Draggable.x/y) */
  public pos: P5Vec;

  constructor(x: number, y: number, parentPath: ParentPath, pInst: P5) {
    super(pInst, x, y);
    // this.id = parentPath.points.length;
    // super(pInst, x, y);
    this.pInst = pInst;
    this.pos = pInst.createVector(x, y);
    this.parentPath = parentPath;
    this.type = "CPOINT";
    this.r = 8;
  }

  add(x: number, y: number) {
    this.pos.add(x, y);
  }

  set(pos: Partial<Point>): this {
    const { x, y } = pos;
    this.pos.set(x || 0, y || 0);
    return this;
  }

  isMouseOver() {
    let px = this.pos.x + this.parentPath.x;
    let py = this.pos.y + this.parentPath.y;
    let mx = this.pInst.mouseX - this.pInst.width / 2;
    let my = this.pInst.mouseY - this.pInst.height / 2;
    if (this.pInst.dist(px, py, mx, my) < 5) {
      return true;
    }
    return false;
  }

  moveTo() {
    const x = this.pInst.mouseX - this.pInst.width / 2 - this.parentPath.x;
    const y = this.pInst.mouseY - this.pInst.height / 2 - this.parentPath.y;

    const closed = true;
    const path = this.parentPath;
    const i = path.points.indexOf(this);

    if (i % 3 == 0) {
      // anchor (red) points
      const dx = x - this.pos.x;
      const dy = y - this.pos.y;
      this.pos.set(x, y);
      if (i - 1 >= 0 || closed) {
        path.points[path.loopIndex(i - 1)].add(dx, dy);
      }
      if (i + 1 < path.points.length || closed) {
        path.points[path.loopIndex(i + 1)].add(dx, dy);
      }
      if (path.mode == "AUTOMATIC") path.autoSetAllControlPoints();
    } else if (path.mode != "AUTOMATIC") {
      // control (white) points
      this.pos.set(x, y);
      const anchorI = i % 3 == 1 ? i - 1 : i + 1;
      const otherI = i % 3 == 1 ? i - 2 : i + 2;
      if ((otherI >= 0 && otherI < path.points.length) || closed) {
        const anchor = path.points[path.loopIndex(anchorI)].pos;
        const other = path.points[path.loopIndex(otherI)].pos;
        if (path.mode == "ALIGNED") {
          const d = dist(anchor.x, anchor.y, other.x, other.y);
          setFromAnchorAlong(
            other,
            anchor.x,
            anchor.y,
            this.pos.x,
            this.pos.y,
            d
          );
        } else if (path.mode == "MIRRORED") {
          mirrorAcrossAnchor(other, anchor.x, anchor.y, this.pos.x, this.pos.y);
        }
      }
    }
    path.setDimensions();
  }

  isAnchor() {
    const i = this.parentPath.points.indexOf(this);
    return i % 3 == 0;
  }

  displayControlCircle(anchorCol: any, lighterCol: any) {
    const i = this.parentPath.points.indexOf(this);
    let colAnchor = anchorCol;
    let colSelect = lighterCol;
    if (this.isMouseOver()) {
      colAnchor = this.pInst.color(255);
      colSelect = this.pInst.color(200);
    }
    this.pInst.stroke(colAnchor);
    this.pInst.strokeWeight(2);
    if (i % 3 == 0) {
      // anchor
      this.displayCircle(colAnchor, this.r);
    } else if (!this.parentPath.auto) {
      //   let col = this.parentPath.controlPointColor;
      this.displayCircle(colSelect, this.r - 2);
    }
  }

  displayCircle(col: any, r: number) {
    this.pInst.noFill();
    this.pInst.stroke(col);
    this.pInst.ellipse(this.pos.x, this.pos.y, r * 2);
    this.pInst.noStroke();
    this.pInst.fill(col);
    this.pInst.ellipse(this.pos.x, this.pos.y, r);

    // const i = this.parentPath.points.indexOf(this);
    // text(i, this.pos.x, this.pos.y+20);
  }
}
