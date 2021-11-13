import MovePoint from "../surfaces/MovePoint";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class LineMap {



    constructor(x0, y0, x1, y1, id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.p0 = new MovePoint(this, x0, y0, 20);
        this.p1 = new MovePoint(this, x1, y1, 20);

        this.type = "LINE";
        this.lineW = 10;
        this.lastChecked = 0;
        this.lineC = color(255);
        this.highlightColor = color(0, 255, 0);

        this.leftToRight();
        this.ang = atan2(this.p0.y - this.p1.y, this.p0.x - this.p1.x);
        if (this.ang > PI / 2)
            this.ang -= 2 * PI;

    }

    //////////////////////////////////////////////
    // LOADING / SAVING
    //////////////////////////////////////////////
    load(json) {
        this.p0.x = json.x0;
        this.p0.y = json.y0;
        this.p1.x = json.x1;
        this.p1.y = json.y1;
    }

    getJson() {
        let json = {};
        json.id = this.id;
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
        strokeWeight(this.lineW);
        stroke(col);
        line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(this.p0, this.p1, col, col);
    }

    displayCenterPulse(per, col = this.lineC) {
        per = constrain(per, 0, 1.0);
        let midX = (this.p0.x + this.p1.x) / 2;
        let midY = (this.p0.y + this.p1.y) / 2;
        let x0 = map(per, 0, 1.0, midX, this.p0.x);
        let x1 = map(per, 0, 1.0, midX, this.p1.x);
        let y0 = map(per, 0, 1.0, midY, this.p0.y);
        let y1 = map(per, 0, 1.0, midY, this.p1.y);
        strokeWeight(this.lineW);
        stroke(col);
        line(x0, y0, x1, y1);
        this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col);
    }

    displayPercent(per, col = this.lineC) {
        per = constrain(per, 0, 1);
        per *= 2;
        let p = constrain(per, 0, 1.0);
        let p0 = createVector(this.p0.x, this.p0.y);
        let p1 = createVector(this.p1.x, this.p1.y);
        let pTemp = p5.Vector.lerp(p0, p1, p);
        strokeWeight(this.lineW);
        stroke(col);
        line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
        this.drawEndCaps(p0, pTemp, col, col);
    }

    displayPercentWidth(per, col = this.lineC) {
        per = constrain(per, 0, 1.0);
        let sw = map(per, 0, 1.0, 0, 10);
        strokeWeight(sw);
        stroke(col);
        line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(p0, p1, col, col);
    }

    displayNone() {
        this.display(color(0));
    }

    displayRainbowCycle() {
        colorMode(HSB, 255);
        let col = color(frameCount % 255, 255, 255);
        this.display(col);
        colorMode(RGB, 255);
    }

    displayGradientLine(c1, c2, per, phase = 1, flip = false) {
        per += phase;
        per %= 1;

        let spacing = 1.0 / height;
        for (let i = 0; i < 1.0; i += spacing) {
            let grad = (i / 2 + per) % 1;
            let col = this.get2CycleColor(c1, c2, grad);
            this.displaySegment(i, spacing, col);
            // if (flip)
            //     this.displayFlipSegment(i, spacing, col);
            // else
            //     this.displaySegment(i, spacing, col);
        }
    }

    //////////////////////////////////////////////
    // DISPLAY HELPERS
    //////////////////////////////////////////////
    displayControlPoints() {
        push();
        noFill();

        strokeWeight(2);
        translate(0, 0, .5);
        this.getPointHighlight(this.p0);
        ellipse(this.p0.x, this.p0.y, 20);

        this.getPointHighlight(this.p1);
        ellipse(this.p1.x, this.p1.y, 20);
        pop();
    }

    drawEndCaps(p0, p1, col0 = this.lineC, col1 = this.lineC) {
        noStroke();
        if (dist(p0.x, p0.y, p1.x, p1.y) > 1) {
            fill(col0);
            ellipse(p0.x, p0.y, this.lineW, this.lineW);
            fill(col1);
            ellipse(p1.x, p1.y, this.lineW, this.lineW);
        }
    }

    displaySegment(startPer, sizePer, col = this.lineC) {
        strokeWeight(this.lineW);
        stroke(col);
        let p0 = createVector(this.p0.x, this.p0.y);
        let p1 = createVector(this.p1.x, this.p1.y);
        let pTemp = p5.Vector.lerp(p0, p1, startPer);
        let pTempEnd = p5.Vector.lerp(pTemp, p1, startPer + sizePer);
        line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
        this.drawEndCaps(pTemp, pTempEnd, col, col);
    }

    //////////////////////////////////////////////
    // COLOR HELPERS
    //////////////////////////////////////////////
    get2CycleColor(c1, c2, per) {
        per = constrain(per, 0, 1);
        per *= 2;
        if (per < 1) {
            return lerpColor(c1, c2, per);
        } else {
            per = map(per, 1, 2, 0, 1);
            return lerpColor(c2, c1, per);
        }
    }

    get3CycleColor(c1, c2, per) {
        per = constrain(per, 0, 1);
        per *= 3;
        if (per < 1) {
            return lerpColor(c1, c2, per);
        } else if (per < 2) {
            per = map(per, 1, 2, 1, 0);
            return lerpColor(c3, c2, per);
        } else {
            per = map(per, 2, 3, 1, 0);
            return lerpColor(c1, c3, per);
        }
    }


    getPointHighlight(p) {
        colorMode(RGB, 255);
        if (this.isMouseOverPoint(p))
            stroke(0, 255, 0);
        else
            stroke(255, 0, 0);
    }

    //////////////////////////////////////////////
    // CLICK DETECTION
    //////////////////////////////////////////////
    isMouseOverPoint(p) {
        let d = dist(p.x, p.y, mouseX - width / 2, mouseY - height / 2);
        return d < p.r;
    }

    // www.jeffreythompson.org/collision-detection/line-point.php
    isMouseOver() {

        let x1 = this.p0.x;
        let y1 = this.p0.y;
        let x2 = this.p1.x;
        let y2 = this.p1.y;
        let px = mouseX - width / 2;
        let py = mouseY - height / 2;
        let d1 = dist(px, py, x1, y1);
        let d2 = dist(px, py, x2, y2);
        let lineLen = dist(x1, y1, x2, y2);
        let buffer = 0.2;    // higher # = less accurate
        if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
            return true;
        }
        return false;
    }

    select() {
        let x = mouseX - width / 2;
        let y = mouseY - height / 2;
        if (dist(this.p0.x, this.p0.y, x, y) < this.p0.r)
            return this.p0;
        if (dist(this.p1.x, this.p1.y, x, y) < this.p1.r)
            return this.p1;
        return null;
    }



    //////////////////////////////////////////////
    // OTHER HELPERS
    //////////////////////////////////////////////
    leftToRight() {
        if (this.p0.x > this.p1.x) {
            let temp = createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    }

    rightToLeft() {
        if (this.p0.x < this.p1.x) {
            let temp = createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    }

}

export default LineMap;