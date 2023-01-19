
'use strict';
// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/


import BezierPoint from './BezierPoint';
import Surface from '../Surface';
class BezierMap extends Surface {


    constructor(id, numPoints, pInst, pMapper) {
        super(id, 0, 0, 0, "BEZ", pInst.buffer);
        this.pInst = pInst;
        this.pMapper = pMapper;
        this.bufferSpace = 10;

        this.width = 100;
        this.height = 100;
        this.contentImg = createImage(this.width, this.height);
        this.maskImg = createImage(this.width, this.height);

        this.contentImg.drawingContext.willReadFrequently = true;
        this.maskImg.drawingContext.willReadFrequently = true;

        this.initEmpty(numPoints);

        this.mode = "FREE";
        this.r = 8;

        // let filePath = "../../src/surfaces/Bezier/shader."
        // this.theShader = loadShader(filePath + "vert", filePath + "frag")


    }

    initEmpty(numAnchors = 5) {
        this.points = [];
        this.x = 0;
        this.y = 0;
        let r = 100;
        let lineW = 50;

        let x = r * cos(0);
        let y = r * sin(0);
        let x0 = lineW * cos(Math.PI / 2);
        let y0 = -lineW * sin(Math.PI / 2);
        let x1 = -x0;
        let y1 = -y0;
        this.points.push(new BezierPoint(x, y, this));
        this.points.push(new BezierPoint(x + x1, y + y1, this));

        for (let i = 1; i < numAnchors; i++) {
            let ang = i * 2 * Math.PI / numAnchors;

            let x = r * cos(ang);
            let y = r * sin(ang);
            let x0 = -lineW * cos(Math.PI / 2 - ang);
            let y0 = lineW * sin(Math.PI / 2 - ang);
            let x1 = -x0;
            let y1 = -y0;
            this.points.push(new BezierPoint(x + x1, y + y1, this));
            this.points.push(new BezierPoint(x, y, this));

            this.points.push(new BezierPoint(x + x0, y + y0, this));

        }
        this.points.push(new BezierPoint(x + x0, y + y0, this));
        // 
        // this.points.push(new BezierPoint( r * cos(ang2),  r * sin(ang2), this));
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
        return this.pMapper.bezBuffer;
        // return this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded;
    }

    load(json) {
        this.points = [];
        this.x = json.x;
        this.y = json.y;
        this.closed = json.closed;
        this.auto = json.auto;
        for (const p of json.points) {
            this.points.push(new BezierPoint(p.x, p.y, this));
        }
        this.setDimensions();
    }


    getJson() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            points: this.points.map(p => { return { x: p.pos.x, y: p.pos.y } }),
            closed: this.closed,
            auto: this.auto
        }
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
            }
            else if (p.select())
                return p;
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
            const cp1 = new BezierPoint(newControl1.x, newControl1.y, this);
            const newControl2 = p5.Vector.lerp(anchor2, control2, -1);
            const cp2 = new BezierPoint(newControl2.x, newControl2.y, this)
            this.points.push(cp1, cp2);
        }

        this.setDimensions();
    }

    setDimensions() {
        const { w, h } = this.getBounds();
        this.width = w + this.bufferSpace * 2;
        this.height = h + this.bufferSpace * 2;

        this.contentImg.resize(this.width, this.height);
        this.maskImg.resize(this.width, this.height);

        let bezBuffer = this.pMapper.bezBuffer;
        this.displayBezierPG(bezBuffer);
    }

    numSegments() {
        return floor(this.points.length / 3);
    }

    getSegment(i) {
        return [
            this.points[this.loopIndex(i * 3 + 0)],
            this.points[this.loopIndex(i * 3 + 1)],
            this.points[this.loopIndex(i * 3 + 2)],
            this.points[this.loopIndex(i * 3 + 3)]
        ]
    }



    addSegment(x, y) {
        if (!x) {
            x = mouseX - width / 2 - this.x;
        }
        if (!y) {
            y = mouseY - height / 2 - this.y;
        }

        this.toggleClosed();
        const prevAnchor = this.points[this.points.length - 2].pos;
        const prevControl = this.points[this.points.length - 1].pos;

        const anchor = createVector(x, y);
        const aP = new BezierPoint(anchor.x, anchor.y, this);
        const control1 = p5.Vector.lerp(prevControl, prevAnchor, -1);
        const cp1 = new BezierPoint(control1.x, control1.y, this);
        const control2 = p5.Vector.lerp(control1, anchor, 0.5);
        const cp2 = new BezierPoint(control2.x, control2.y, this);

        this.points.push(cp1, cp2, aP);

        this.toggleClosed();

    }

    removeSegment() {
        if (this.points.length <= 3) {
            console.warn("cannot have a bezier with less than one anchor");
            return;
        }
        for (let i = 0; i < this.points.length; i+= 3) {
            if (this.points[i].select()) {
                this.points.splice(i, 3);
            }
        }
    }

    autoSetControlPoint(anchorI, controlSpacing) {
        if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed) return;

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
        this.points[this.loopIndex(anchorI - 1)].set(p5.Vector.add(anchor, dirLeft));
        this.points[this.loopIndex(anchorI + 1)].set(p5.Vector.add(anchor, dirRight));
    }

    autoSetEdgePoints(controlSpacing) {
        if (this.closed) return;

        this.points[1].set(p5.Vector.lerp(this.points[0].pos, this.points[2].pos, controlSpacing));
        this.points[this.points.length - 2].set(p5.Vector.lerp(this.points[this.points.length - 1].pos, this.points[this.points.length - 3].pos, controlSpacing));
    }

    autoSetAllControlPoints(controlSpacing) {
        for (let i = 0; i < this.points.length; i += 3) {
            this.autoSetControlPoint(i, controlSpacing);
        }
        this.autoSetEdgePoints(controlSpacing);
    }


    display(col = color('black')) {
        if (isCalibratingMapper()) {
            strokeWeight(3);
            stroke(this.controlPointColor);
            fill(this.getMutedControlColor());
        }
        else {
            noStroke();
            fill(col);
        }
        this.displayBezier();
    }


    displayTexture(img, x = 0, y = 0) {


        if (!this.isReady()) {
            return;
        }
        let buffer = this.pMapper.buffer;
        this.drawImage(img, buffer, x, y);
        this.displayGraphicsTexture(buffer);

        // if (isCalibratingMapper()) {
        //     this.display();
        //     return;
        // }
    }

    displaySketch(sketch, x = 0, y = 0) {


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

        // if (isCalibratingMapper()) {
        //     this.display();
        //     return;
        // }
    }


    displayGraphicsTexture(pg) {
        // white bezier mask should be recreated every time 
        // shape changes (this.setDimensions())
        let maskPG = this.pMapper.bezBuffer;
        this.pgMask(pg, maskPG);


        // TODO - issue with createImage() and createGraphics()
        // leading to memory leak
        const { x, y } = this.getBounds();
        push();
        translate(this.x, this.y);
        translate(x - this.bufferSpace, y - this.bufferSpace);
        image(this.contentImg, 0, 0);
        pop();

        if (isCalibratingMapper()) {
            this.display();
            return;
        }
    }



    // In the future when we can apply texture UVs to bezier vertices:
    // https://github.com/processing/p5.js/issues/5699

    // setShader(shader) {
    //     this.theShader = shader;
    // }

    // displayTexture(tex) {
    //     if (!this.isReady()) {
    //         return;
    //     }

    //     let buffer = this.pMapper.buffer;
    //     let bezBuffer = this.pMapper.bezBuffer;
    //     let theShader = this.pMapper.bezShader;

    //     this.drawImage(tex, buffer);

    //     textureMode(NORMAL);
    //     bezBuffer.shader(theShader);
    //     theShader.setUniform('resolution', [buffer.width, buffer.height]);
    //     theShader.setUniform('tex', buffer);

    //     // rect gives us some geometry on the screen
    //     bezBuffer.rect(0, 0, bezBuffer.width, bezBuffer.height);

    //     texture(bezBuffer);
    //     this.displayBezier();
    // }

    drawImage(img, pg, x = 0, y = 0) {
        if (img && pg) {
            pg.push();
            pg.clear();
            // useful for WEBGL mode...
            // pg.translate(-pg.width / 2, -pg.height / 2);
            pg.translate(x, y);
            pg.image(img, 0, 0);
            pg.pop();
        }
    }

    displayBezierPG(pg) {
        const { x, y } = this.getBounds();
        pg.push();
        pg.clear();
        pg.fill('white');
        pg.translate(-x, -y);
        pg.translate(this.bufferSpace, this.bufferSpace);

        pg.beginShape();
        pg.vertex(this.points[0].pos.x, this.points[0].pos.y);
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            pg.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
        pg.endShape();
        pg.pop();

        // if (isCalibratingMapper()) {
        //     translate(0, 0, 3);
        //     this.displayControls();
        // }
    }

    displayBezier() {
        push();
        translate(this.x, this.y);
        beginShape();
        vertex(this.points[0].pos.x, this.points[0].pos.y);
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
        endShape();

        // if (isCalibratingMapper()) {

        //     translate(0, 0, 3);
        //     this.displayControls();
        // }
        pop();
    }



    displayControlPoints() {
        if (isMovingPoints()) {
            let lineC = this.controlPointColor;

            push();
            translate(this.x, this.y);
            if (!this.auto) {
                this.displayControlLines(lineC);
            }
            this.displayControlCircles(lineC);
            pop();
        }
    }

    displayControlLines(strokeC) {
        strokeWeight(2);
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            stroke(strokeC);
            line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
            line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
    }

    displayControlCircles(strokeC) {
        for (const p of this.points) {
            p.displayControlCircle(strokeC);
        }
    }

    getPolyline() {
        let polyline = [];
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            let steps = 4;
            for (let i = 0; i <= steps; i++) {
                let t = i / steps;
                let x = bezierPoint(seg[0].pos.x, seg[1].pos.x, seg[2].pos.x, seg[3].pos.x, t);
                let y = bezierPoint(seg[0].pos.y, seg[1].pos.y, seg[2].pos.y, seg[3].pos.y, t);
                polyline.push({ x, y });
            }
        }
        return polyline;
    }

    //(x0,y0) is start point; (x1,y1),(x2,y2) is control points; (x3,y3) is end point.
    isMouseOver() {
        let polyline = this.getPolyline();
        let mx = mouseX - width / 2 - this.x;
        let my = mouseY - height / 2 - this.y;
        return this.inside(mx, my, polyline);
    }

    inside(x, y, vs) {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i].x, yi = vs[i].y;
            let xj = vs[j].x, yj = vs[j].y;

            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

    // https://editor.p5js.org/mikima/sketches/SkEXyPvpf
    pgMask(_content, _mask) {
        //Create the mask as image
        this.contentImg.copy(_content, 0, 0, this.contentImg.width, this.contentImg.height, 0, 0, this.contentImg.width, this.contentImg.height);

        // clear mask before copying
        this.maskImg.loadPixels();
        for (var i = 0; i < this.maskImg.pixels.length; i += 4) {
            this.maskImg.pixels[i] = 0;
            this.maskImg.pixels[i + 1] = 0;
            this.maskImg.pixels[i + 2] = 0;
            this.maskImg.pixels[i + 3] = 0;
        }
        this.maskImg.updatePixels();

        this.maskImg.copy(_mask, 0, 0, this.maskImg.width, this.maskImg.height, 0, 0, this.maskImg.width, this.maskImg.height);


        this.contentImg.mask(this.maskImg);
        // return the masked image
        // return contentImg;
    }
}


export default BezierMap;