// BezierMap.ts
// Credit: https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

import Surface from "../Surface";
import BezierPoint from "./BezierPoint";
import { inside } from "../../helpers/helpers"; // assumes your typed helper
import { DraggableJSON } from "../Draggable";

type P5 = any;

type P5Vec = {
  x: number;
  y: number;
  set: (x: number, y: number) => void;
  add: (x: number, y: number) => void;
};

export type BezierMode = "FREE" | "ALIGNED" | "MIRRORED" | "AUTOMATIC";

export interface PMapper {
  // Shared 2D mask buffer for the Bezier (white mask)
  bezBuffer: any; // p5.Graphics (2D)
  // 2D buffer for the texture to be masked
  buffer: any; // p5.Graphics (2D)
  // WEBGL output buffer where the shader composes mask/texture
  bufferWEBGL: any; // p5.Graphics (WEBGL)
  // Whether shader assets / GL are ready
  bezierShaderLoaded: boolean;
}

export interface BezierJSONPoint {
  x: number;
  y: number;
}
export interface BezierJSON {
  id: string | number;
  type: "BEZ";
  x: number;
  y: number;
  points: BezierJSONPoint[];
  closed: boolean;
  auto: boolean;
}

export default class BezierMap extends Surface {
  public readonly pMapper: PMapper;
  public mode: BezierMode = "FREE";
  public r = 8;

  /** Points laid out as [anchor, ctrl, ctrl, anchor, ctrl, ctrl, ...] */
  public points: BezierPoint[] = [];

  /** Whether first and last anchors connect and have control handles */
  public closed = true;

  /** Whether control points auto-update (AUTOMATIC mode helper) */
  public auto = false;

  /** Extra padding around the polygon bounds to avoid clipping the mask */
  private bufferSpace = 10;

  /** Cached shader (mask + image compose) */
  private shaderProg: any | null = null;

  constructor(
    id: string | number,
    numAnchors: number,
    pMapper: PMapper,
    pInst: P5
  ) {
    super(id, /*w*/ 0, /*h*/ 0, /*res*/ 2, "BEZ", pMapper.buffer, pInst);
    this.pMapper = pMapper;

    // give a nominal size; setDimensions() will update from bounds
    this.width = 100;
    this.height = 100;

    this.initEmpty(numAnchors);
  }

  // --- Initialization ----------------------------------------------------

  /** Create a closed ring of anchors/controls */
  private initEmpty(numAnchors = 5): void {
    this.points = [];
    this.x = 0;
    this.y = 0;

    const r = 100; // ring radius
    const lineW = 50; // initial handle distance

    // first anchor (angle = 0) and its trailing control
    {
      const x = r * Math.cos(0);
      const y = r * Math.sin(0);
      const x0 = lineW * Math.cos(Math.PI / 2);
      const y0 = -lineW * Math.sin(Math.PI / 2);
      const x1 = -x0;
      const y1 = -y0;

      // anchor at (x,y), trailing control at (x+x1, y+y1)
      this.points.push(new BezierPoint(x, y, this, this.pInst));
      this.points.push(new BezierPoint(x + x1, y + y1, this, this.pInst));
    }

    // intermediate anchors + entering/leaving controls
    for (let i = 1; i < numAnchors; i++) {
      const ang = (i * 2 * Math.PI) / numAnchors;

      const x = r * Math.cos(ang);
      const y = r * Math.sin(ang);
      const x0 = -lineW * Math.cos(Math.PI / 2 - ang);
      const y0 = lineW * Math.sin(Math.PI / 2 - ang);
      const x1 = -x0;
      const y1 = -y0;

      // enter control, anchor, exit control
      this.points.push(new BezierPoint(x + x1, y + y1, this, this.pInst));
      this.points.push(new BezierPoint(x, y, this, this.pInst));
      this.points.push(new BezierPoint(x + x0, y + y0, this, this.pInst));
    }

    // close the ring with the last control
    {
      const last = this.points[this.points.length - 1].pos as P5Vec;
      this.points.push(new BezierPoint(last.x, last.y, this, this.pInst));
    }

    this.closed = true;
    this.auto = false;
    this.setDimensions();
  }

  // --- Modes -------------------------------------------------------------

  public setAlignedMode() {
    this.mode = "ALIGNED";
  }
  public setMirroredMode() {
    this.mode = "MIRRORED";
  }
  public setFreeMode() {
    this.mode = "FREE";
  }
  public setAutomaticMode() {
    this.mode = "AUTOMATIC";
  }

  /** p5 setting passthrough for curve quality */
  public setBezierDetail(num = 20) {
    this.pMapper.bezBuffer?.bezierDetail?.(num);
    this.pMapper.buffer?.bezierDetail?.(num);
  }

  public isReady(): boolean {
    return Boolean(this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded);
  }

  // --- Persistence -------------------------------------------------------

  public load(json: DraggableJSON): void {
    this.points = [];
    this.x = json.x;
    this.y = json.y;
    this.closed = json.closed || false;
    this.auto = json.auto || false;
    for (const p of json.points || []) {
      this.points.push(new BezierPoint(p.x, p.y, this, this.pInst));
    }
    this.setDimensions();
  }

  public getJson(): BezierJSON {
    return {
      id: this.id,
      type: "BEZ",
      x: this.x,
      y: this.y,
      points: this.points.map((p) => ({ x: p.pos.x, y: p.pos.y })),
      closed: this.closed,
      auto: this.auto,
    };
  }

  public serialize(): string {
    return JSON.stringify(this.getJson());
  }

  // --- Selection / Interaction ------------------------------------------

  //   public selectSurface(): this | null {
  //     if (this.isMouseOver()) {
  //       this.startDrag();
  //       return this;
  //     }
  //     return null;
  //   }

  public selectPoints(): BezierPoint | null {
    const c = this.selectControls();
    if (c) return c;
    return this.selectAnchors();
  }

  private selectAnchors(): BezierPoint | null {
    for (let i = 0; i < this.points.length; i += 3) {
      const p = this.points[i];
      if (p.isMouseOver()) return p;
    }
    return null;
  }

  private selectControls(): BezierPoint | null {
    for (const p of this.points) {
      if (p.isAnchor()) continue;
      if (p.isMouseOver()) return p;
    }
    return null;
  }

  // --- Geometry helpers --------------------------------------------------

  /** Axis-aligned bounds of the *polyline* approximation (in local coords) */
  public override getBounds(): { x: number; y: number; w: number; h: number } {
    const polyline = this.getPolyline();
    return super.getBounds(polyline);
  }

  public loopIndex(i: number): number {
    return (i + this.points.length) % this.points.length;
  }

  public toggleClosed(): void {
    if (this.closed) {
      this.closed = false;
      // remove last two control points used to close the loop
      this.points.pop();
      this.points.pop();
    } else {
      this.closed = true;

      const anchor1 = this.points[this.points.length - 1].pos as P5Vec;
      const control1 = this.points[this.points.length - 2].pos as P5Vec;
      const anchor2 = this.points[0].pos as P5Vec;
      const control2 = this.points[1].pos as P5Vec;

      const newControl1 = this.pInst.constructor.Vector.lerp(
        anchor1,
        control1,
        -1
      );
      const cp1 = new BezierPoint(
        newControl1.x,
        newControl1.y,
        this,
        this.pInst
      );

      const newControl2 = this.pInst.constructor.Vector.lerp(
        anchor2,
        control2,
        -1
      );
      const cp2 = new BezierPoint(
        newControl2.x,
        newControl2.y,
        this,
        this.pInst
      );

      this.points.push(cp1, cp2);
    }

    this.setDimensions();
  }

  public setDimensions(): void {
    const { w, h } = this.getBounds();
    this.width = w + this.bufferSpace * 2;
    this.height = h + this.bufferSpace * 2;

    // update the white mask into bezBuffer when shape changes
    const bezBuffer = this.pMapper.bezBuffer;
    this.displayBezierPG(bezBuffer);
  }

  public numSegments(): number {
    return Math.floor(this.points.length / 3);
  }

  public getSegment(
    i: number
  ): [BezierPoint, BezierPoint, BezierPoint, BezierPoint] {
    return [
      this.points[this.loopIndex(i * 3 + 0)],
      this.points[this.loopIndex(i * 3 + 1)],
      this.points[this.loopIndex(i * 3 + 2)],
      this.points[this.loopIndex(i * 3 + 3)],
    ];
  }

  public addSegment(x?: number, y?: number): void {
    // default to mouse in local space
    const { x: mx, y: my } = this.getMouseCoords();
    if (typeof x !== "number") x = mx - this.x;
    if (typeof y !== "number") y = my - this.y;

    const closestAnchorId = this.getClosestAnchor();
    const nextClosestAnchorId = this.getNextClosestAnchor();

    const prevControl = this.points[closestAnchorId + 1].pos as P5Vec;

    let nextControlID = nextClosestAnchorId - 1;
    if (nextControlID === -1) nextControlID = this.points.length - 1;
    const nextControl = this.points[nextControlID].pos as P5Vec;

    const anchor = this.pInst.createVector(x, y) as P5Vec;
    const aP = new BezierPoint(anchor.x, anchor.y, this, this.pInst);

    const control1 = this.pInst.constructor.Vector.lerp(
      prevControl,
      anchor,
      1 - 0.3
    );
    const control2 = this.pInst.constructor.Vector.lerp(
      anchor,
      nextControl,
      0.3
    );

    const cp1 = new BezierPoint(control1.x, control1.y, this, this.pInst);
    const cp2 = new BezierPoint(control2.x, control2.y, this, this.pInst);

    this.points.splice(closestAnchorId + 2, 0, cp1, aP, cp2);
    this.setDimensions();
  }

  public removeSegment(): void {
    if (this.points.length <= 3) {
      console.warn("cannot have a bezier with less than one anchor");
      return;
    }
    for (let i = 0; i < this.points.length; i += 3) {
      if (this.points[i].isMouseOver()) {
        this.points.splice(i, 3);
        this.setDimensions();
        return;
      }
    }
  }

  public getClosestAnchor(): number {
    const { x, y } = this.getMouseCoords();
    const mx = x - this.x;
    const my = y - this.y;

    let minDis = Infinity;
    let index = 0;

    for (let i = 0; i < this.points.length; i += 3) {
      const p0 = this.points[i];
      const p1 =
        i >= this.points.length - 3 ? this.points[0] : this.points[i + 3];

      const d0 = this.pInst.dist(p0.pos.x, p0.pos.y, mx, my);
      const d1 = this.pInst.dist(p1.pos.x, p1.pos.y, mx, my);
      const cost = d0 + d1;

      if (cost < minDis) {
        minDis = cost;
        index = i;
      }
    }
    return index;
  }

  public getNextClosestAnchor(): number {
    const anchor = this.getClosestAnchor();
    let next = anchor + 3;
    if (next > this.points.length - 3) next = 0;
    return next;
  }

  public autoSetControlPoint(anchorI: number, controlSpacing: number): void {
    if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed)
      return;

    const anchorLeftI = this.loopIndex(anchorI - 3);
    const anchorRightI = this.loopIndex(anchorI + 3);
    const anchor = this.points[anchorI].pos as P5Vec;
    const anchorLeft = this.points[anchorLeftI].pos as P5Vec;
    const anchorRight = this.points[anchorRightI].pos as P5Vec;

    const V = this.pInst.constructor.Vector;

    const dispLeft = V.sub(V.copy(anchorLeft), anchor);
    const dispRight = V.sub(V.copy(anchorRight), anchor);

    const magLeft = dispLeft.mag();
    const magRight = dispRight.mag();

    dispLeft.normalize();
    dispRight.normalize();

    const dirLeft = V.sub(dispLeft, dispRight);
    const dirRight = V.sub(dispRight, dispLeft);

    dirLeft.setMag(magLeft * controlSpacing);
    dirRight.setMag(magRight * controlSpacing);

    this.points[this.loopIndex(anchorI - 1)].set(
      V.add(V.copy(anchor), dirLeft)
    );
    this.points[this.loopIndex(anchorI + 1)].set(
      V.add(V.copy(anchor), dirRight)
    );
  }

  public autoSetEdgePoints(controlSpacing: number): void {
    if (this.closed) return;

    const V = this.pInst.constructor.Vector;

    this.points[1].set(
      V.lerp(this.points[0].pos, this.points[2].pos, controlSpacing)
    );
    this.points[this.points.length - 2].set(
      V.lerp(
        this.points[this.points.length - 1].pos,
        this.points[this.points.length - 3].pos,
        controlSpacing
      )
    );
  }

  public autoSetAllControlPoints(controlSpacing = 0.3): void {
    for (let i = 0; i < this.points.length; i += 3) {
      this.autoSetControlPoint(i, controlSpacing);
    }
    this.autoSetEdgePoints(controlSpacing);
    this.setDimensions();
  }

  // --- Display -----------------------------------------------------------

  public override display(col: any = this.pInst.color("black")): void {
    this.pInst.noStroke();
    this.pInst.fill(col);
    this.displayBezier();
    this.displayCalib();
  }

  private displayCalib(): void {
    if (this.pInst.isCalibratingMapper()) {
      this.pInst.strokeWeight(3);
      this.pInst.stroke(this.controlPointColor);
      this.pInst.fill(this.getMutedControlColor());
      this.displayBezier();
    }
  }

  /** Composite an *image* through the Bezier mask using the shader */
  public displayTexture(img: any, x = 0, y = 0, texW = 0, texH = 0): void {
    if (!this.isReady()) return;

    const buffer = this.pMapper.buffer;
    this.drawImage(img, buffer, x, y, texW, texH);
    this.displayGraphicsTexture(buffer);
    this.displayCalib();
  }

  /** Draw a *sketch* into the buffer and then composite it through the mask */
  public displaySketch(
    sketch: (pg: any) => void,
    x = 0,
    y = 0,
    tW = 0,
    tH = 0
  ): void {
    const buffer = this.pMapper.buffer;
    buffer.push();
    buffer.translate(x, y);
    sketch(buffer);
    buffer.pop();
    this.displayGraphicsTexture(buffer);
  }

  /** Apply mask (bezBuffer) to pBuffer via shader, draw to screen */
  private displayGraphicsTexture(pBuffer: any): void {
    if (!this.isReady()) return;

    // update mask for current shape
    this.setDimensions();

    const pMask = this.pMapper.bezBuffer;
    const pOutput = this.pMapper.bufferWEBGL;

    // Lazily create and cache the shader
    if (!this.shaderProg) {
      const frag = `#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D texMask;
uniform sampler2D texImg;

void main() {
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y); // flip Y
  vec4 maskT = texture2D(texMask, uv);
  vec4 imgT  = texture2D(texImg,  uv);

  float gray = (maskT.r + maskT.g + maskT.b) / 3.0;
  vec3 outRGB = imgT.rgb * gray;

  gl_FragColor = vec4(outRGB, gray);
}`;
      const vert = `#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // NDC
  gl_Position = positionVec4;
}`;
      this.shaderProg = pOutput.createShader(vert, frag);
    }

    pOutput.clear();
    pOutput.setAttributes("alpha", true);
    pOutput.shader(this.shaderProg);
    this.shaderProg.setUniform("texMask", pMask);
    this.shaderProg.setUniform("texImg", pBuffer);

    pOutput.rect(0, 0, this.pInst.width, this.pInst.height);

    const { x, y } = this.getBounds();
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.translate(x - this.bufferSpace, y - this.bufferSpace);
    this.pInst.image(pOutput, 0, 0);
    this.pInst.pop();

    this.displayCalib();
  }

  /** Draw img into pg; default size to intrinsic if not provided */
  private drawImage(img: any, pg: any, x = 0, y = 0, texW = 0, texH = 0): void {
    if (!img || !pg) return;
    if (texW <= 0) texW = img.width;
    if (texH <= 0) texH = img.height;

    pg.push();
    pg.clear();
    pg.translate(x, y);
    pg.image(img, 0, 0, texW, texH);
    pg.pop();
  }

  /** Rasterize the white Bezier mask into the mask buffer */
  private displayBezierPG(pg: any): void {
    const { x, y } = this.getBounds();
    pg.push();
    pg.clear();
    pg.fill("white");
    pg.translate(-x, -y);
    pg.translate(this.bufferSpace, this.bufferSpace);

    pg.beginShape();
    pg.vertex(this.points[0].pos.x, this.points[0].pos.y);
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      pg.bezierVertex(
        seg[1].pos.x,
        seg[1].pos.y,
        seg[2].pos.x,
        seg[2].pos.y,
        seg[3].pos.x,
        seg[3].pos.y
      );
    }
    pg.endShape();
    pg.pop();
  }

  /** Draw the path (no texture) in screen space for previews/calibration */
  private displayBezier(): void {
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.beginShape();
    this.pInst.vertex(this.points[0].pos.x, this.points[0].pos.y);
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      this.pInst.bezierVertex(
        seg[1].pos.x,
        seg[1].pos.y,
        seg[2].pos.x,
        seg[2].pos.y,
        seg[3].pos.x,
        seg[3].pos.y
      );
    }
    this.pInst.endShape();
    this.pInst.pop();
  }

  public displayControlPoints(): void {
    if (!this.pInst.isMovingPoints?.()) return;

    const lineC = this.controlPointColor;
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    // if (!this.auto)
    const lighterLineC = this.pInst.lerpColor(
      lineC,
      this.pInst.color(255, 255, 255),
      0.5
    );
    this.displayControlLines(lighterLineC);
    this.displayControlCircles(lineC, lighterLineC);
    this.pInst.pop();
  }

  private displayControlLines(strokeC: any): void {
    this.pInst.strokeWeight(2);
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      this.pInst.stroke(strokeC);
      this.pInst.line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
      this.pInst.line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
    }
  }

  private displayControlCircles(anchorCol: any, lighterCol: any): void {
    let i = 0;
    const index = this.getClosestAnchor();
    const nextIndex = this.getNextClosestAnchor();
    for (const p of this.points) {
      //   let col = anchorCol;
      //   if (i === index || i === nextIndex) col = this.pInst.color(255, 200, 200);
      p.displayControlCircle(anchorCol, lighterCol);
      i++;
    }
  }

  /** Polyline approximation of the curve, in local coords */
  private getPolyline(): Array<{ x: number; y: number }> {
    const polyline: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      const steps = 4; // sampling density per segment
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = this.pInst.bezierPoint(
          seg[0].pos.x,
          seg[1].pos.x,
          seg[2].pos.x,
          seg[3].pos.x,
          t
        );
        const y = this.pInst.bezierPoint(
          seg[0].pos.y,
          seg[1].pos.y,
          seg[2].pos.y,
          seg[3].pos.y,
          t
        );
        polyline.push({ x, y });
      }
    }
    return polyline;
  }

  /** Hit-test using the polyline and a ray cast in local space */
  public isMouseOver(): boolean {
    const polyline = this.getPolyline();
    const mouse = this.getMouseCoords();
    return inside(mouse, polyline, { x: this.x, y: this.y });
  }
}
