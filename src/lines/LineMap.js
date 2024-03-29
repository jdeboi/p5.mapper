import Draggable from "../surfaces/Draggable";
import MovePoint from "../surfaces/MovePoint";
import { getRandomizedColor } from '../helpers/helpers';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class LineMap extends Draggable {

    constructor(x0, y0, x1, y1, id, pInst) {
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
        this.controlPointColor = getRandomizedColor(this.id, this.type, this.pInst)

        this.p0 = new MovePoint(this, x0, y0, this.pInst);
        this.p1 = new MovePoint(this, x1, y1, this.pInst);

        // this.controlCol = getRandomizedColor(this.pInst, this.id+1, this.type);

        this.leftToRight();

        this.ang = this.pInst.atan2(this.p0.y - this.p1.y, this.p0.x - this.p1.x);
        if (this.ang > this.pInst.PI / 2)
            this.ang -= 2 * this.pInst.PI;

    }

    //////////////////////////////////////////////
    // LOADING / SAVING
    //////////////////////////////////////////////
    load(json) {
        this.x = json.x;
        this.y = json.y;
        this.p0.x = json.x0;
        this.p0.y = json.y0;
        this.p1.x = json.x1;
        this.p1.y = json.y1;
    }

    getJson() {
        let json = {};
        json.id = this.id;
        json.x = this.x;
        json.y = this.y;
        json.x0 = this.p0.x;
        json.y0 = this.p0.y;
        json.x1 = this.p1.x;
        json.y1 = this.p1.y;
        return json;
    }


    //////////////////////////////////////////////
    // DISPLAY METHODS
    //////////////////////////////////////////////
    display(col = this.lineC) {
        this.pInst.strokeWeight(this.lineW);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(this.p0, this.p1, col, col);
        this.pInst.pop();
    }

    displayCenterPulse(per, col = this.lineC) {
        // per = constrain(per, 0, 1.0);
        // let per = this. getPercentWave(this.pInst, speed);
        let midX = (this.p0.x + this.p1.x) / 2;
        let midY = (this.p0.y + this.p1.y) / 2;
        let x0 = this.pInst.map(per, 0, 1.0, midX, this.p0.x);
        let x1 = this.pInst.map(per, 0, 1.0, midX, this.p1.x);
        let y0 = this.pInst.map(per, 0, 1.0, midY, this.p0.y);
        let y1 = this.pInst.map(per, 0, 1.0, midY, this.p1.y);
        this.pInst.strokeWeight(this.lineW);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.line(x0, y0, x1, y1);
        this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col);
        this.pInst.pop();
    }

    displayPercent(per, col = this.lineC) {
        let p = per
        let p0 = this.pInst.createVector(this.p0.x, this.p0.y);
        let p1 = this.pInst.createVector(this.p1.x, this.p1.y);
        let pTemp = p5.Vector.lerp(p0, p1, p);
        this.pInst.strokeWeight(this.lineW);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
        this.drawEndCaps(p0, pTemp, col, col);
        this.pInst.pop();
    }

    displayPercentWidth(per, col = this.lineC) {
        per = this.pInst.constrain(per, 0, 1.0);
        let sw = this.pInst.map(per, 0, 1.0, 0, 10);
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(this.p0, this.p1, col, col, sw);
        this.pInst.pop();
    }

    displayNone() {
        this.display(this.pInst.color(0));
    }

    displayRainbowCycle() {
        // TODO - is this how we should handle color modes?
        // shouldn't we set to what it was before call? Can't presume RBG
        this.pInst.colorMode(HSB, 255);
        let col = this.pInst.color(this.pInst.frameCount % 255, 255, 255);
        this.display(col);
        this.pInst.colorMode(this.pInst.RGB, 255);
    }

    // TODO
    // way too expensive
    displayGradientLine(c1, c2, per, phase = 1, flip = false) {
        per += phase;
        per %= 1;

        let spacing = 1.0 / height;
        for (let i = 0; i < 1.0; i += spacing) {
            let grad = (i / 2 + per) % 1;
            let col = this.get2CycleColor(c1, c2, grad);
            this.displaySegment(i, spacing, col);
        }
    }

    //////////////////////////////////////////////
    // DISPLAY HELPERS
    //////////////////////////////////////////////
    displayCalibration() {
        this.pInst.colorMode(this.pInst.HSB, 255);
        let h = this.pInst.hue(this.controlPointColor);
        let col = this.pInst.color((h + 80) % 255, 255, 255);
        this.pInst.colorMode(this.pInst.RGB);
        if (this.isMouseOver()) {
            col = this.pInst.color(255);
        }
        this.display(col);
    }

    displayControlPoints() {
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.p0.display(this.controlPointColor);
        this.p1.display(this.controlPointColor);
        this.pInst.pop();
    }

    setEndCapsOn() {
        this.endCapsOn = true;
    }

    setEndCapsOff() {
        this.endCapsOn = false;
    }


    drawEndCaps(p0, p1, col0 = this.lineC, col1 = this.lineC) {
        if (!this.endCapsOn) {
            return;
        }
        this.pInst.noStroke();
        if (this.pInst.dist(p0.x, p0.y, p1.x, p1.y) > 1) {
            this.pInst.fill(col0);
            this.pInst.ellipse(p0.x, p0.y, this.lineW);
            this.pInst.fill(col1);
            this.pInst.ellipse(p1.x, p1.y, this.lineW);
        }
    }

    displaySegment(startPer, sizePer, col = this.lineC) {
        this.pInst.strokeWeight(this.lineW);
        this.pInst.stroke(col);
        let p0 = this.pInst.createVector(this.p0.x, this.p0.y);
        let p1 = this.pInst.createVector(this.p1.x, this.p1.y);
        let pTemp = p5.Vector.lerp(p0, p1, startPer);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        let pTempEnd = p5.Vector.lerp(pTemp, p1, startPer + sizePer);
        this.pInst.line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
        this.drawEndCaps(pTemp, pTempEnd, col, col);
        this.pInst.pop();
    }

    //////////////////////////////////////////////
    // COLOR HELPERS
    //////////////////////////////////////////////
    get2CycleColor(c1, c2, per) {
        per = this.pInst.constrain(per, 0, 1);
        per *= 2;
        if (per < 1) {
            return this.pInst.lerpColor(c1, c2, per);
        } else {
            per = this.pInst.map(per, 1, 2, 0, 1);
            return this.pInst.lerpColor(c2, c1, per);
        }
    }

    get3CycleColor(c1, c2, per) {
        per = this.pInst.constrain(per, 0, 1);
        per *= 3;
        if (per < 1) {
            return this.pInst.lerpColor(c1, c2, per);
        } else if (per < 2) {
            per = this.pInst.map(per, 1, 2, 1, 0);
            return this.pInst.lerpColor(c3, c2, per);
        } else {
            per = this.pInst.map(per, 2, 3, 1, 0);
            return this.pInst.lerpColor(c1, c3, per);
        }
    }


    getPointHighlight(p) {
        this.pInst.colorMode(this.pInst.RGB, 255);
        if (this.isMouseOverPoint(p))
            this.pInst.stroke(0, 255, 0);
        else
            this.pInst.stroke(255, 0, 0);
    }

    //////////////////////////////////////////////
    // CLICK DETECTION
    //////////////////////////////////////////////

    // www.jeffreythompson.org/collision-detection/line-point.php
    isMouseOver() {

        let x1 = this.p0.x;
        let y1 = this.p0.y;
        let x2 = this.p1.x;
        let y2 = this.p1.y;
        let px = this.pInst.mouseX - this.pInst.width / 2 - this.x;
        let py = this.pInst.mouseY - this.pInst.height / 2 - this.y;
        let d1 = this.pInst.dist(px, py, x1, y1);
        let d2 = this.pInst.dist(px, py, x2, y2);
        let lineLen = this.pInst.dist(x1, y1, x2, y2);
        let buffer = 0.15 * this.lineW;    // higher # = less accurate
        if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
            return true;
        }
        return false;
    }

    selectSurface() {
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    }



    selectPoints() {
        // check control points
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
    leftToRight() {
        if (this.p0.x > this.p1.x) {
            let temp = this.pInst.createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    }

    rightToLeft() {
        if (this.p0.x < this.p1.x) {
            let temp = this.pInst.createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    }

}

export default LineMap;