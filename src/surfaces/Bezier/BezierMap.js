// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

import BezierPoint from "./BezierPoint";
import Surface from "../Surface";
class BezierMap extends Surface {
  constructor(id, numPoints, pMapper, pInst) {
    super(id, 0, 0, 0, "BEZ", pMapper.buffer, pInst);
    this.pMapper = pMapper;
    this.bufferSpace = 10;

    this.width = 100;
    this.height = 100;

    this.initEmpty(numPoints);

    this.mode = "FREE";
    this.r = 8;
  }

  initEmpty(numAnchors = 5) {
    this.points = [];
    this.x = 0;
    this.y = 0;
    let r = 100;
    let lineW = 50;

    let x = r * Math.cos(0);
    let y = r * Math.sin(0);
    let x0 = lineW * Math.cos(Math.PI / 2);
    let y0 = -lineW * Math.sin(Math.PI / 2);
    let x1 = -x0;
    let y1 = -y0;
    this.points.push(new BezierPoint(x, y, this, this.pInst));
    this.points.push(new BezierPoint(x + x1, y + y1, this, this.pInst));

    for (let i = 1; i < numAnchors; i++) {
      let ang = (i * 2 * Math.PI) / numAnchors;

      let x = r * Math.cos(ang);
      let y = r * Math.sin(ang);
      let x0 = -lineW * Math.cos(Math.PI / 2 - ang);
      let y0 = lineW * Math.sin(Math.PI / 2 - ang);
      let x1 = -x0;
      let y1 = -y0;
      this.points.push(new BezierPoint(x + x1, y + y1, this, this.pInst));
      this.points.push(new BezierPoint(x, y, this, this.pInst));

      this.points.push(new BezierPoint(x + x0, y + y0, this, this.pInst));
    }
    this.points.push(new BezierPoint(x + x0, y + y0, this, this.pInst));
    //
    // this.points.push(new BezierPoint( r * Math.cos(ang2),  r * sin(ang2), this));
    //
    this.closed = true;
    this.auto = false;
  }

  setAlignedMode() {
    this.mode = "ALIGNED";
  }

  setMirroredMode() {
    this.mode = "MIRRORED";
  }

  setFreeMode() {
    this.mode = "FREE";
  }

  setAutomaticMode() {
    this.mode = "AUTOMATIC";
  }

  setBezierDetail(num = 20) {
    this.pMapper.bezBuffer.bezierDetail(num);
    this.pMapper.buffer.bezierDetail(num);
  }

  isReady() {
    return this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded;
  }

  load(json) {
    this.points = [];
    this.x = json.x;
    this.y = json.y;
    this.closed = json.closed;
    this.auto = json.auto;
    for (const p of json.points) {
      this.points.push(new BezierPoint(p.x, p.y, this, this.pInst));
    }
    this.setDimensions();
  }

  getJson() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      points: this.points.map((p) => {
        return { x: p.pos.x, y: p.pos.y };
      }),
      closed: this.closed,
      auto: this.auto,
    };
  }

  serialize() {
    return JSON.stringify(this.getJson());
  }

  selectSurface() {
    if (this.isMouseOver()) {
      this.startDrag();
      return this;
    }
    return null;
  }

  selectPoints() {
    // check if control points are selected
    let controls = this.selectControls();
    if (controls) return controls;
    return this.selectAnchors();
  }

  selectAnchors() {
    // check if control points are selected
    for (let i = 0; i < this.points.length; i += 3) {
      const p = this.points[i];
      if (p.select()) {
        return p;
      }
    }
    return null;
  }

  selectControls() {
    // check if control points are selected
    for (const p of this.points) {
      if (p.isAnchor()) {
        continue;
      } else if (p.select()) return p;
    }
    return null;
  }

  getBounds() {
    let polyline = this.getPolyline();

    return super.getBounds(polyline);
  }

  loopIndex(i) {
    return (i + this.points.length) % this.points.length;
  }

  toggleClosed() {
    if (this.closed) {
      this.closed = false;
      this.points.pop();
      this.points.pop();
    } else {
      this.closed = true;
      const anchor1 = this.points[this.points.length - 1].pos;
      const control1 = this.points[this.points.length - 2].pos;
      const anchor2 = this.points[0].pos;
      const control2 = this.points[1].pos;
      const newControl1 = p5.Vector.lerp(anchor1, control1, -1);
      const cp1 = new BezierPoint(
        newControl1.x,
        newControl1.y,
        this,
        this.pInst
      );
      const newControl2 = p5.Vector.lerp(anchor2, control2, -1);
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

  setDimensions() {
    const { w, h } = this.getBounds();
    this.width = w + this.bufferSpace * 2;
    this.height = h + this.bufferSpace * 2;

    // editing the mask buffer of one bezier affects the others
    let bezBuffer = this.pMapper.bezBuffer;
    this.displayBezierPG(bezBuffer);
  }

  numSegments() {
    return Math.floor(this.points.length / 3);
  }

  getSegment(i) {
    return [
      this.points[this.loopIndex(i * 3 + 0)],
      this.points[this.loopIndex(i * 3 + 1)],
      this.points[this.loopIndex(i * 3 + 2)],
      this.points[this.loopIndex(i * 3 + 3)],
    ];
  }

  addSegment(x, y) {
    if (!x) {
      x = this.pInst.mouseX - this.pInst.width / 2 - this.x;
    }
    if (!y) {
      y = this.pInst.mouseY - this.pInst.height / 2 - this.y;
    }

    let closestAnchorId = this.getClosestAnchor();
    let nextClosestAnchorId = this.getNextClosestAnchor();

    const prevControl = this.points[closestAnchorId + 1].pos;

    let nextControlID = nextClosestAnchorId - 1;
    if (nextControlID == -1) {
      nextControlID = this.points.length - 1;
    }
    const nextControl = this.points[nextControlID].pos;

    const anchor = this.pInst.createVector(x, y);
    const aP = new BezierPoint(anchor.x, anchor.y, this, this.pInst);

    const control1 = p5.Vector.lerp(prevControl, anchor, 1 - 0.3);
    const control2 = p5.Vector.lerp(anchor, nextControl, 0.3);

    const cp1 = new BezierPoint(control1.x, control1.y, this, this.pInst);
    const cp2 = new BezierPoint(control2.x, control2.y, this, this.pInst);

    this.points.splice(closestAnchorId + 2, 0, cp1, aP, cp2);
  }

  removeSegment() {
    if (this.points.length <= 3) {
      console.warn("cannot have a bezier with less than one anchor");
      return;
    }
    for (let i = 0; i < this.points.length; i += 3) {
      if (this.points[i].select()) {
        this.points.splice(i, 3);
      }
    }
  }

  getClosestAnchor() {
    let mx = this.pInst.mouseX - this.pInst.width / 2 - this.x;
    let my = this.pInst.mouseY - this.pInst.height / 2 - this.y;
    let minDis = Infinity;
    let index = 0;
    for (let i = 0; i < this.points.length; i += 3) {
      if (i >= this.points.length - 3) {
        var p0 = this.points[i];
        var p1 = this.points[0];
      } else {
        var p0 = this.points[i];
        var p1 = this.points[i + 3];
      }
      let d0 = this.pInst.dist(p0.pos.x, p0.pos.y, mx, my);
      let d1 = this.pInst.dist(p1.pos.x, p1.pos.y, mx, my);
      if (d0 + d1 < minDis) {
        minDis = d0 + d1;
        index = i;
      }
    }
    return index;
  }

  getNextClosestAnchor() {
    let anchor = this.getClosestAnchor();
    let next = anchor + 3;
    if (next > this.points.length - 3) next = 0;
    return next;
  }

  autoSetControlPoint(anchorI, controlSpacing) {
    if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed)
      return;

    const anchorLeftI = this.loopIndex(anchorI - 3);
    const anchorRightI = this.loopIndex(anchorI + 3);
    const anchor = this.points[anchorI];
    const anchorLeft = this.points[anchorLeftI];
    const anchorRight = this.points[anchorRightI];
    const dispLeft = p5.Vector.sub(anchorLeft, anchor);
    const dispRight = p5.Vector.sub(anchorRight, anchor);
    const magLeft = dispLeft.mag();
    const magRight = dispRight.mag();
    dispLeft.normalize();
    dispRight.normalize();
    const dirLeft = p5.Vector.sub(dispLeft, dispRight);
    const dirRight = p5.Vector.sub(dispRight, dispLeft);
    dirLeft.setMag(magLeft * controlSpacing);
    dirRight.setMag(magRight * controlSpacing);
    this.points[this.loopIndex(anchorI - 1)].set(
      p5.Vector.add(anchor, dirLeft)
    );
    this.points[this.loopIndex(anchorI + 1)].set(
      p5.Vector.add(anchor, dirRight)
    );
  }

  autoSetEdgePoints(controlSpacing) {
    if (this.closed) return;

    this.points[1].set(
      p5.Vector.lerp(this.points[0].pos, this.points[2].pos, controlSpacing)
    );
    this.points[this.points.length - 2].set(
      p5.Vector.lerp(
        this.points[this.points.length - 1].pos,
        this.points[this.points.length - 3].pos,
        controlSpacing
      )
    );
  }

  autoSetAllControlPoints(controlSpacing) {
    for (let i = 0; i < this.points.length; i += 3) {
      this.autoSetControlPoint(i, controlSpacing);
    }
    this.autoSetEdgePoints(controlSpacing);
  }

  display(col = this.pInst.color("black")) {
    this.pInst.noStroke();
    this.pInst.fill(col);
    this.displayBezier();

    this.displayCalib();
  }

  displayCalib() {
    if (this.pInst.isCalibratingMapper()) {
      this.pInst.strokeWeight(3);
      this.pInst.stroke(this.controlPointColor);
      this.pInst.fill(this.getMutedControlColor());
      this.displayBezier();
    }
  }

  displayTexture(img, x = 0, y = 0, texW = 0, texH = 0) {
    if (!this.isReady()) {
      return;
    }

    let buffer = this.pMapper.buffer;
    this.drawImage(img, buffer, x, y, texW, texH);
    this.displayGraphicsTexture(buffer);

    this.displayCalib();
  }

  displaySketch(sketch, x = 0, y = 0, tW = 0, tH = 0) {
    let buffer = this.pMapper.buffer;

    buffer.push();

    // TODO
    // WEBGL origin or 2D origin ...
    // Does this make sense?
    // draw the sketch from top left corner
    // buffer.translate(-buffer.width / 2, -buffer.height / 2);

    // could also put graphics buffer
    // at center of bezier

    // const {w, h} = this.getBounds();
    // buffer.translate(w/2, h/2);
    buffer.translate(x, y);
    sketch(buffer);
    buffer.pop();
    this.displayGraphicsTexture(buffer);
  }

  displayGraphicsTexture(pBuffer) {
    if (!this.isReady()) {
      return;
    }
    // white bezier mask should be recreated every time
    // shape changes (this.setDimensions())
    this.setDimensions();
    let pMask = this.pMapper.bezBuffer;
    // let theShader = this.pMapper.bezShader;
    let pOutput = this.pMapper.bufferWEBGL;
    // had to clear for 1.9
    pOutput.clear();
    const frag = `// https://github.com/aferriss/p5jsShaderExamples 
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        // grab texcoords from vert shader
        varying vec2 vTexCoord;
        
        // our texture coming from p5
        uniform sampler2D texMask;
        uniform sampler2D texImg;
        
        
        void main() {
          vec2 uv = vTexCoord;
          
          // the texture is loaded upside down and backwards by default so lets flip it
          uv.y = 1.0 - uv.y;
          
          vec4 maskT = texture2D(texMask, uv);
          vec4 imgT = texture2D(texImg, uv);
          
          float gray = (maskT.r + maskT.g + maskT.b) / 3.0;
        
          // mask
          float threshR = imgT.r* gray ;
          float threshG = imgT.g* gray ;
          float threshB = imgT.b* gray ;
          vec3 thresh = vec3(threshR, threshG, threshB);
        
          // render the output
          gl_FragColor = vec4(thresh, gray);
        }`;
    const vert = `// vert file and comments from adam ferriss
        // https://github.com/aferriss/p5jsShaderExamples
        
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        // our vertex data
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        
        // lets get texcoords just for fun! 
        varying vec2 vTexCoord;
        
        void main() {
          // copy the texcoords
          vTexCoord = aTexCoord;
        
          // copy the position data into a vec4, using 1.0 as the w component
          vec4 positionVec4 = vec4(aPosition, 1.0);
          positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        
          // send the vertex information on to the fragment shader
          gl_Position = positionVec4;
        }`;

    // TODO - no need to create this every time... (?)
    // for some reason didn't work in the ProjectionMapper class...
    let theShader = pOutput.createShader(vert, frag);

    pOutput.setAttributes("alpha", true);
    pOutput.shader(theShader);
    theShader.setUniform("resolution", [this.pInst.width, this.pInst.height]);
    theShader.setUniform("time", millis() / 1000.0);
    theShader.setUniform("mouse", [
      this.pInst.mouseX,
      this.pInst.map(
        this.pInst.mouseY,
        0,
        this.pInst.height,
        this.pInst.height,
        0
      ),
    ]);
    theShader.setUniform("texMask", pMask);
    theShader.setUniform("texImg", pBuffer);

    pOutput.rect(0, 0, this.pInst.width, this.pInst.height);

    const { x, y } = this.getBounds();
    this.pInst.push();
    this.pInst.translate(this.x, this.y);
    this.pInst.translate(x - this.bufferSpace, y - this.bufferSpace);
    this.pInst.image(pOutput, 0, 0);

    this.pInst.pop();

    this.displayCalib();
  }

  drawImage(img, pg, x = 0, y = 0, texW = 0, texH = 0) {
    if (img && pg) {
      if (texH <= 0) texW = img.width;
      if (texH <= 0) texH = img.height;
      pg.push();
      pg.clear();
      // useful for WEBGL mode...
      // pg.translate(-pg.width / 2, -pg.height / 2);
      pg.translate(x, y);
      pg.image(img, 0, 0, texW, texH);
      pg.pop();
    }
  }

  displayBezierPG(pg) {
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

  displayBezier() {
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

  displayControlPoints() {
    if (this.pInst.isMovingPoints()) {
      let lineC = this.controlPointColor;

      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      if (!this.auto) {
        this.displayControlLines(lineC);
      }
      this.displayControlCircles(this.pInst.color("red"));
      this.pInst.pop();
    }
  }

  displayControlLines(strokeC) {
    this.pInst.strokeWeight(2);
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      this.pInst.stroke(strokeC);
      this.pInst.line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
      this.pInst.line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
    }
  }

  displayControlCircles(anchorCol) {
    let i = 0;
    let index = this.getClosestAnchor();
    let nextIndex = this.getNextClosestAnchor();
    for (const p of this.points) {
      let col = anchorCol;
      if (i == index) {
        col = this.pInst.color(255, 200, 200);
      } else if (i == nextIndex) {
        col = this.pInst.color(255, 200, 200);
      }
      p.displayControlCircle(col);
      i++;
    }
  }

  getPolyline() {
    let polyline = [];
    for (let i = 0; i < this.numSegments(); i++) {
      const seg = this.getSegment(i);
      let steps = 4;
      for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = this.pInst.bezierPoint(
          seg[0].pos.x,
          seg[1].pos.x,
          seg[2].pos.x,
          seg[3].pos.x,
          t
        );
        let y = this.pInst.bezierPoint(
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

  //(x0,y0) is start point; (x1,y1),(x2,y2) is control points; (x3,y3) is end point.
  isMouseOver() {
    let polyline = this.getPolyline();
    let mx = this.pInst.mouseX - this.pInst.width / 2 - this.x;
    let my = this.pInst.mouseY - this.pInst.height / 2 - this.y;
    return this.inside(mx, my, polyline);
  }

  inside(x, y, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].x,
        yi = vs[i].y;
      let xj = vs[j].x,
        yj = vs[j].y;

      let intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  // https://editor.p5js.org/mikima/sketches/SkEXyPvpf
  // pg_mask
}

export default BezierMap;
