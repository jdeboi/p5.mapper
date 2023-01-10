// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/


import BezierPoint from './BezierPoint';
import Surface from '../Surface';
class BezierMap extends Surface {


    constructor(id, pInst, pMapper) {
        super(id, 0, 0, 0, "BEZ", pInst.buffer);
        this.pInst = pInst;
        this.pMapper = pMapper;
        this.bufferSpace = 10;
        this.initEmpty();
        this.mode = "FREE";
        this.r = 8;
        // let filePath = "../../src/surfaces/Bezier/shader."
        // this.theShader = loadShader(filePath + "vert", filePath + "frag")

    }

    initEmpty() {
        this.points = [];
        this.x = 100;
        this.y = 100;
        this.width = 100;
        this.height = 100;
        this.points.push(new BezierPoint(0, 0, this));
        this.points.push(new BezierPoint(this.width, 0, this));
        this.points.push(new BezierPoint(this.width, this.height, this));
        this.points.push(new BezierPoint(0, this.height, this));
        this.closed = false;
        this.auto = false;
        this.toggleClosed();
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
        for (const p of this.points) {
            if (p.select()) {
                return p;
            }
        }
        return null;
    }

    getBounds() {
        let polyline = this.getPolyline();

        let minX = Math.min(...polyline.map((pt) => pt.x));
        let minY = Math.min(...polyline.map((pt) => pt.y));
        let maxX = Math.max(...polyline.map((pt) => pt.x));
        let maxY = Math.max(...polyline.map((pt) => pt.y));

        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
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
        if (isCalibratingMapper()) {
            this.display();
            return;
        }

        if (!this.isReady()) {
            return;
        }
        let buffer = this.pMapper.buffer;
        this.drawImage(img, buffer, x, y);
        this.displayGraphicsTexture(buffer);
    }

    displaySketch(sketch, x = 0, y = 0) {
        if (isCalibratingMapper()) {
            this.display();
            return;
        }

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


    displayGraphicsTexture(pg) {
        // 1 - white bezier mask should be recreated every time 
        // shape changes (this.setDimensions())

        // 2 - convert PGraphics into img for masking
        let bezBuffer = this.pMapper.bezBuffer;
        let img = pg.get();

        // 3 - mask it with step 1
        img.mask(bezBuffer);

        const { x, y } = this.getBounds();
        push();
        translate(this.x, this.y);
        translate(x - this.bufferSpace, y - this.bufferSpace);
        image(img, 0, 0);
        pop();
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
}

export default BezierMap;