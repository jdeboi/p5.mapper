class BezierMap {

    // constructor(json = null) {
    //     if (json) {
    //         this.load(json);
    //     }
    //     else {
    //         this.initEmpty();
    //     }

    //     // let filePath = "../../src/surfaces/Bezier/shader."
    //     // this.theShader = loadShader(filePath + "vert", filePath + "frag")
    // }

    constructor(buffer) {
        this.buffer = buffer;
        this.initEmpty();
    }

    initEmpty() {
        this.points = [];
        this.points.push(createVector(- 100, 0));
        this.points.push(createVector(- 50, - 50));
        this.points.push(createVector(50, 50));
        this.points.push(createVector(100, 0));
        this.closed = false;
        this.auto = false;
        this.toggleClosed();
    }

    load(json) {
        this.points = [];
        for (const p of json.points) {
            this.points.push(createVector(p.x, p.y));
        }
        this.closed = json.closed;
        this.auto = json.auto;
    }


    getJson() {
        return {
            points: this.points.map(p => { return { x: p.x - width / 2, y: p.y - height / 2 } }),
            closed: this.closed,
            auto: this.auto
        }
    }

    serialize() {
        return JSON.stringify(this.getJson());
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
            const anchor1 = this.points[this.points.length - 1];
            const control1 = this.points[this.points.length - 2];
            const anchor2 = this.points[0];
            const control2 = this.points[1];
            const newControl1 = p5.Vector.lerp(anchor1, control1, -1);
            const newControl2 = p5.Vector.lerp(anchor2, control2, -1);
            this.points.push(newControl1, newControl2);
        }
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
        const prevAnchor = this.points[this.points.length - 2];
        const prevControl = this.points[this.points.length - 1];

        const anchor = createVector(x, y);
        const control1 = p5.Vector.lerp(prevControl, prevAnchor, -1);
        const control2 = p5.Vector.lerp(control1, anchor, 0.5);

        this.points.push(control1, control2, anchor);
    }

    movePoint(point, x, y, mode) {
        const i = this.points.indexOf(point);

        if (i % 3 == 0) {
            const dx = x - point.x;
            const dy = y - point.y;
            point.set(x, y);
            if (i - 1 >= 0 || this.closed) {
                this.points[this.loopIndex(i - 1)].add(dx, dy);
            }
            if (i + 1 < this.points.length || this.closed) {
                this.points[this.loopIndex(i + 1)].add(dx, dy);
            }
            if (mode == AUTOMATIC) this.autoSetAllControlPoints();
        } else if (mode != AUTOMATIC) {
            point.set(x, y);
            const anchorI = (i % 3 == 1) ? i - 1 : i + 1;
            const otherI = (i % 3 == 1) ? i - 2 : i + 2;
            if (otherI >= 0 && otherI < this.points.length || this.closed) {
                const anchor = this.points[this.loopIndex(anchorI)];
                const other = this.points[this.loopIndex(otherI)];
                if (mode == ALIGNED) {
                    const dist = p5.Vector.dist(anchor, other);
                    const disp = p5.Vector.sub(anchor, point);
                    disp.setMag(dist);
                    other.set(p5.Vector.add(anchor, disp));
                } else if (mode == MIRRORED) {
                    other.set(p5.Vector.lerp(anchor, point, -1))
                }
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

        this.points[1].set(p5.Vector.lerp(this.points[0], this.points[2], controlSpacing));
        this.points[this.points.length - 2].set(p5.Vector.lerp(this.points[this.points.length - 1], this.points[this.points.length - 3], controlSpacing));
    }

    autoSetAllControlPoints(controlSpacing) {
        for (let i = 0; i < this.points.length; i += 3) {
            this.autoSetControlPoint(i, controlSpacing);
        }
        this.autoSetEdgePoints(controlSpacing);
    }

    // render(fillC, strokeC) {
    //     stroke(strokeC);

    //     beginShape();
    //     vertex(this.points[0].x, this.points[0].y)
    //     for (let i = 0; i < this.numSegments(); i++) {
    //         const seg = this.getSegment(i);
    //         bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
    //     }
    //     endShape();

    // }


    displayTexture(tex) {
        const { x, y, w, h } = this.getBounds();
        this.buffer.clear();
        this.buffer.push();
        this.buffer.background('white')
        // this.buffer.translate(-this.buffer.width / 2-x/2, -this.buffer.height / 2-y/2);
        this.buffer.fill(255);
        // this.buffer.beginShape();

        // this.buffer.vertex(this.points[0].x, this.points[0].y)
        // for (let i = 0; i < this.numSegments(); i++) {
        //     const seg = this.getSegment(i);
        //     this.buffer.bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
        // }
        // this.buffer.endShape();
        this.buffer.pop();

        tex.mask(this.buffer);
        image(tex, 0, 0);
        
        // this.buffer.pop();

        // tex.mask(this.buffer);

        // image(tex, 0, 0);
    }


    displaySolid(col) {
        noStroke();
        fill(col);
        beginShape();
        vertex(this.points[0].x, this.points[0].y)
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
        }
        endShape();

        if (isCalibratingMapper()) {
            translate(0, 0, 3);
            this.displayControls();
        }
    }

    getBounds() {
        let minX = Math.min(...this.points.map(pt => pt.x));
        let maxX = Math.max(...this.points.map(pt => pt.x));
        let minY = Math.min(...this.points.map(pt => pt.y));
        let maxY = Math.max(...this.points.map(pt => pt.y));
        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
    }



    displayControls() {
        let lineC = color(255);
        // this.render(color(0, 255, 0), lineC);

        this.displayControlCircles(lineC);
        if (!this.auto) {
            this.displayControlLines(lineC);
        }
    }

    displayControlLines(strokeC) {
        for (let i = 0; i < this.numSegments(); i++) {
            const seg = this.getSegment(i);
            stroke(strokeC);
            line(seg[0].x, seg[0].y, seg[1].x, seg[1].y);
            line(seg[2].x, seg[2].y, seg[3].x, seg[3].y);
        }
    }

    displayControlCircles(strokeC) {
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            stroke(strokeC);
            strokeWeight(1);
            if (i % 3 == 0) {
                fill(255, 0, 0);
                circle(p.x, p.y, 10);
            } else if (!this.auto) {
                fill(255);
                circle(p.x, p.y, 8);
            }
        }
    }
}

export default BezierMap;