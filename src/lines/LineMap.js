import MovePoint from "../surfaces/MovePoint";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class LineMap {



    constructor(x0, y0, x1, y1) {
        this.p1 = new MovePoint(this, x0, y0, 20);
        this.p2 = new MovePoint(this, x1, y1, 20);

        this.lineW = 10;
        this.lastChecked = 0;
        this.lineC = color(255);
        this.highlightColor = color(0, 255, 0);

        this.leftToRight();
        this.ang = atan2(this.p1.y - this.p2.y, this.p1.x - this.p2.x);
        if (this.ang > PI / 2)
            this.ang -= 2 * PI;

    }

    select() {
        let x = mouseX - width / 2;
        let y = mouseY - height / 2;
        // first, see if one of the control points are selected
        // x -= this.x;
        // y -= this.y;
        if (dist(this.p1.x, this.p1.y, x, y) < this.p1.r)
            return this.p1;
        if (dist(this.p2.x, this.p2.y, x, y) < this.p2.r)
            return this.p2;

        // then, see if the line itself is selected
        // if (this.isMouseOver()) {
        //     this.clickX = x;
        //     this.clickY = y;
        //     return this;
        // }

        return null;
    }


    display(col = this.lineC) {
        // strokeCap(ROUND);
        strokeWeight(this.lineW);
        stroke(col);
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        // this.drawEndCaps(this.p1, this.p2);

        if (isCalibratingMapper()) {

            push();
            noFill();

            strokeWeight(2);
            translate(0, 0, .5);
            this.getPointHighlight(this.p1);
            ellipse(this.p1.x, this.p1.y, 20);

            this.getPointHighlight(this.p2);
            ellipse(this.p2.x, this.p2.y, 20);
            pop();


        }
        // strokeCap(SQUARE);
    }

    // drawEndCaps(p1, p2) {
    //     if (dist(p1.x, p1.y, p2.x, p2.y) > 1) {
    //         ellipse(p1.x, p1.y, this.lineW / 6, this.lineW / 6);
    //         ellipse(p2.x, p2.y, this.lineW / 6, this.lineW / 6);
    //     }
    // }

    displayCenterPulse(per) {
        per = constrain(per, 0, 1.0);
        let midX = (this.p1.x + this.p2.x) / 2;
        let midY = (this.p1.y + this.p2.y) / 2;
        let x1 = map(per, 0, 1.0, midX, this.p1.x);
        let x2 = map(per, 0, 1.0, midX, this.p2.x);
        let y1 = map(per, 0, 1.0, midY, this.p1.y);
        let y2 = map(per, 0, 1.0, midY, this.p2.y);
        strokeWeight(this.lineW);
        line(this.x1, this.y1, this.x2, this.y2);
    }

    // moveP1(x, y) {
    //     this.p1.x += x;
    //     this.p1.y += y;
    // }

    // moveP2(x, y) {
    //     this.p2.x += x;
    //     this.p2.y += y;
    // }


    leftToRight() {
        if (this.p1.x > this.p2.x) {
            let temp = createVector(this.p1.x, this.p1.y);
            this.p1.set(this.p2);
            this.p2.set(temp);
        }
    }

    rightToLeft() {
        if (this.p1.x < this.p2.x) {
            let temp = createVector(this.p1.x, this.p1.y);
            this.p1.set(this.p2);
            this.p2.set(temp);
        }
    }

    displayPercent(per) {
        per *= 2;
        let p = constrain(per, 0, 1.0);
        let pTemp = p5.Vector.lerp(this.p1, this.p2, p);
        strokeWeight(this.lineW);
        line(this.p1.x, this.p1.y, pTemp.x, pTemp.y);
        // this.drawEndCaps(this.p1, pTemp);
    }

    displayGradientLine(c1, c2, per, phase, flip) {
        per += phase;
        per %= 1;

        let spacing = 1.0 / height;
        for (let i = 0; i < 1.0; i += spacing) {
            let grad = (i / 2 + per) % 1;
            stroke(this.getCycleColor(c1, c2, grad));
            if (flip)
                this.displayFlipSegment(i, spacing);
            else
                this.displaySegment(i, spacing);
        }
    }

    displayPercentWid(per) {
        per = constrain(per, 0, 1.0);
        let sw = floor(map(per, 0, 1.0, 0, 5));
        strokeWeight(sw);
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        // this.drawEndCaps(this.p1, this.p2);
    }

    //void fftLine() {
    //  lineW = int(map(bands[0], 0, 600, 0, 10));
    //  lineW = constrain(lineW, 0, 10);

    //  display();
    //  lineW = origLineW;
    //}

    // void twinkle(int wait) {
    //       int num = int(dist(p1.x, p1.y, p2.x, p2.y) / 100);

    //     if (millis() - lastChecked > wait) {
    //         twinkleT = int(random(100, 255));
    //         lastChecked = millis();
    //         //if (twinkleT > 220) twinkleRange = num + int(random(3));
    //     }

    //     noStroke();
    //     fill(twinkleT);
    //     for (int i = 0; i < num; i++) {
    //         float x = map(i, -.5, twinkleRange, p1.x, p2.x);
    //         float y = map(i, -.5, twinkleRange, p1.y, p2.y);
    //         ellipse(x, y, 4, 10);
    //     }
    // }

    // void displayBandX(int start, int end, color c) {
    //     if (p1.x > start && p1.x < end) {
    //         display(c);
    //     }
    // }

    // void displayBandX(int start, int end) {
    //     if (p1.x > start && p1.x < end) {
    //         display(color(255));
    //     } else {
    //         displayNone();
    //     }
    // }

    // void displayBandY(int start, int end, color c) {
    //     if (p1.y > start && p1.y < end) {
    //         display(c);
    //     } else {
    //         displayNone();
    //     }
    // }

    // void displayBandZ(int start, int end, color c) {
    //     if (z1 >= start && z1 < end) {
    //         display(c);
    //     } else {
    //         displayNone();
    //     }
    // }

    // void displayBandZ(int band, color c) {
    //     if (z1 == band) {
    //         display(c);
    //     } else {
    //         displayNone();
    //     }
    // }

    displayNone() {
        //strokeWeight(18);
        this.display(color(0));
        //strokeWeight(2);
    }


    // void displayEqualizer(int[] bandH, color c) {
    //     if (p1.x >= 0 && p1.x < width / 4) {
    //         displayBandY(0, bandH[0], c);
    //     } else if (p1.x >= width / 4 && p1.x < width / 2) {
    //         displayBandY(0, bandH[1], c);
    //     } else if (p1.x >= width / 2 && p1.x < width * 3.0 / 4) {
    //         displayBandY(0, bandH[2], c);
    //     } else {
    //         displayBandY(0, bandH[3], c);
    //     }
    // }

    // void displayPointX(int x) {
    //       float ym;

    //     if (x > p1.x && x < p2.x) {
    //         ym = map(x, p1.x, p2.x, p1.y, p2.y);
    //         ellipse(x, ym, 10, 10);
    //     } else if (x > p2.x && x < p1.x) {
    //         ym = map(x, p2.x, p1.x, p2.y, p1.y);
    //         ellipse(x, ym, 10, 10);
    //     }
    // }

    // displayPointY(float per, boolean flip) {
    //       float y = map(per, 0, 1, p1.y, p2.y);
    //     if (flip) y = map(per, 0, 1, p2.y, p1.y);
    //       float xm;
    //     if ((y > p1.y && y < p2.y)) {
    //         xm = map(y, p1.y, p2.y, p1.x, p2.x);
    //         ellipse(xm, y, 10, 10);
    //         //println(y + " " + xm);
    //     } else if (y > p2.y && y < p1.y) {
    //         xm = map(y, p2.y, p1.y, p2.x, p1.x);
    //         ellipse(xm, y, 10, 10);
    //         //println(y + " " + xm);
    //     }
    // }

    getPointHighlight(p) {
        if (this.isMouseOverPoint(p))
            stroke(0, 255, 0);
        else
            stroke(255, 0, 0);
    }

    isMouseOverPoint(p) {
        let d = dist(p.x, p.y, mouseX - width / 2, mouseY - height / 2);
        return d < p.r;
    }

    // isMouseOverEndPoint() {
    //     let d = dist(this.p1.x, this.p1.y, mouseX - width / 2, mouseY - height / 2);
    //     if (d < 5) {
    //         return 0;
    //     }
    //     d = dist(this.p2.x, this.p2.y, mouseX - width / 2, mouseY - height / 2);
    //     if (d < 5) {
    //         return 1;
    //     }
    //     return -1;
    // }

    // highlightOver() {
    //     if (this.isMouseOverEndPoint() == 0) {
    //         this.highlightEndPoint(this.p1);
    //     }
    //     else if (this.isMouseOverEndPoint() == 1) {
    //         this.highlightEndPoint(this.p2);
    //     }
    //     else if (this.isMouseOver()) {
    //         this.highlightLine();
    //     }

    // }

    // highlightLine() {
    //     this.display(this.highlightColor);
    // }

    // highlightEndPoint(p) {
    //     let x = p.x;
    //     let y = p.y;
    //     // strokeWeight(1);
    //     // noFill();
    //     // stroke(this.highlightColor);
    //     // ellipse(x, y, 20);
    //     push();
    //     translate(0, 0, .5);
    //     strokeWeight(2);
    //     noFill();
    //     stroke(this.highlightColor);
    //     ellipse(x, y, 30);
    //     pop();
    // }

    // www.jeffreythompson.org/collision-detection/line-point.php
    isMouseOver() {

        let x1 = this.p1.x;
        let y1 = this.p1.y;
        let x2 = this.p2.x;
        let y2 = this.p2.y;
        let px = mouseX - width / 2;
        let py = mouseY - height / 2;
        let d1 = dist(px, py, x1, y1);
        let d2 = dist(px, py, x2, y2);
        let lineLen = dist(x1, y1, x2, y2);
        let buffer = 0.2;    // higher # = less accurate
        // console.log("ok", d1, d2);
        if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
            return true;
        }
        return false;
    }

    // void setZIndex(int k) {
    //     zIndex = k;
    //     println("zIndex of " + id1 + "" + id2 + " is now " + k);
    // }


    // void displayZIndex() {
    //     colorMode(HSB, 255);
    //     //display(color(map(zIndex, 0, numRectZ-1, 0, 255), 255, 255));
    // }


    // void displayRainbowCycle(int pulse) {
    //     //color c =  color(((i * 256 / lines.size()) + pulseIndex) % 255, 255, 255);
    //     colorMode(HSB, 255);
    //     for (float i = 0; i < 50; i++) {
    //         if (z1 <= z2) {
    //           float z = map(i, 0, 50, z1, z2);
    //           float s = map(z, 0, 9, 0, 255);
    //             stroke((s + pulse) % 255, 255, 255);

    //           PVector pTemp = PVector.lerp(p1, p2, i / 50.0);
    //           PVector pTempEnd = PVector.lerp(pTemp, p2, (i + 1) / 50.0);
    //             strokeWeight(lineW);
    //             line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
    //             drawEndCaps(pTemp, pTempEnd);
    //         }
    //     }
    //     colorMode(RGB, 255);
    // }

    // void displayRainbowRandom() {
    //     rainbowIndex++;
    //     if (rainbowIndex > 255) rainbowIndex = 0;
    //     colorMode(HSB, 255);
    //     display(color(rainbowIndex, 255, 255));
    //     colorMode(RGB, 255);
    // }

    // void displayFlipSegment(float startPer, float sizePer) {
    //     strokeWeight(lineW);
    //       PVector pTemp = PVector.lerp(p2, p1, startPer);
    //       PVector pTempEnd = PVector.lerp(pTemp, p1, startPer + sizePer);
    //     line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
    //     drawEndCaps(pTemp, pTempEnd);
    // }

    // void displaySegment(float startPer, float sizePer) {
    //     strokeWeight(lineW);
    //     strokeCap(ROUND);
    //       PVector pTemp = PVector.lerp(p1, p2, startPer);
    //       PVector pTempEnd = PVector.lerp(pTemp, p2, startPer + sizePer);

    //     line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
    //     drawEndCaps(pTemp, pTempEnd);
    // }

    // void setGradientZ(color c1, color c2, int jump) {
    //     colorMode(HSB, 255);
    //       int colhue = (frameCount % 255) + zIndex * jump;
    //     if (colhue < 0) colhue += 255;
    //     else if (colhue > 255) colhue -= 255;
    //     colorMode(RGB, 255);
    //       float m;
    //     if (colhue < 127) {
    //         m = constrain(map(colhue, 0, 127, 0, 1), 0, 1);
    //         display(lerpColor(c1, c2, m));
    //     } else {
    //         m = constrain(map(colhue, 127, 255, 0, 1), 0, 1);
    //         display(lerpColor(c2, c1, m));
    //     }
    // }
    //   }


    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // UTILITIES
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // void moveSelectedLine() {
    //     if (selectedP != null) {
    //         selectedP.move();
    //     }
    // }

    // void snapOutlinesToMask() {
    //     lines = new ArrayList < Line > ();
    //     int[][] pts = {  
    //       { 0, 1, 8, 9 },
    //     { 1, 2, 7, 8 },
    //     { 2, 3, 6, 7 },
    //     { 3, 4, 5, 6 }
    // };
    // for (int i = 0; i < 4; i++) {
    //       int g = 3;
    //     lines.add(new Line(maskPoints[keystoneNum][pts[i][0]].x + g, maskPoints[keystoneNum][pts[i][0]].y + g, maskPoints[keystoneNum][pts[i][1]].x - g, maskPoints[keystoneNum][pts[i][1]].y + g));
    //     lines.add(new Line(maskPoints[keystoneNum][pts[i][1]].x - g, maskPoints[keystoneNum][pts[i][1]].y + g, maskPoints[keystoneNum][pts[i][2]].x - g, maskPoints[keystoneNum][pts[i][2]].y - g));
    //     lines.add(new Line(maskPoints[keystoneNum][pts[i][2]].x - g, maskPoints[keystoneNum][pts[i][2]].y - g, maskPoints[keystoneNum][pts[i][3]].x + g, maskPoints[keystoneNum][pts[i][3]].y - g));
    //     lines.add(new Line(maskPoints[keystoneNum][pts[i][3]].x + g, maskPoints[keystoneNum][pts[i][3]].y - g, maskPoints[keystoneNum][pts[i][0]].x + g, maskPoints[keystoneNum][pts[i][0]].y + g));
    // }
    //   }


    // void checkLineClick() {
    //     for (Line l : lines) {
    //       int ptOver = l.mouseOver();
    //         if (ptOver > -1) {
    //             if (ptOver == 0) selectedLineP = l.p1;
    //             else selectedLineP = l.p2;
    //             isDragging = true;
    //             return;
    //         }
    //     }
    // }

    // void linesReleaseMouse() {
    //     isDragging = false;
    //     selectedLineP = null;
    // }

    // void loadLines() {
    //     lines = new ArrayList < Line > ();
    //     processing.data.JSONObject linesJson;
    //     if (useTestKeystone) linesJson = loadJSONObject("data/lines/lines_Test.json");
    //     else linesJson = loadJSONObject("data/lines/lines.json");

    //     processing.data.JSONArray linesArray = linesJson.getJSONArray("lineList");
    //     for (int i = 0; i < 16; i++) {
    //         processing.data.JSONObject l = linesArray.getJSONObject(i);
    //       float x0 = l.getFloat("x0");
    //       float y0 = l.getFloat("y0");
    //       float x1 = l.getFloat("x1");
    //       float y1 = l.getFloat("y1");
    //         lines.add(new Line(x0, y0, x1, y1));
    //     }
    // }

    // void saveMappedLines() {
    //     processing.data.JSONObject json;
    //     json = new processing.data.JSONObject();

    //     processing.data.JSONArray linesList = new processing.data.JSONArray();

    //     for (int i = 0; i < lines.size(); i++) {
    //         processing.data.JSONObject lineJSON = new processing.data.JSONObject();
    //       Line l = lines.get(i);
    //         lineJSON.setFloat("x0", l.p1.x);
    //         lineJSON.setFloat("y0", l.p1.y);
    //         lineJSON.setFloat("x1", l.p2.x);
    //         lineJSON.setFloat("y1", l.p2.y);

    //         linesList.setJSONObject(i, lineJSON);
    //     }
    //     json.setJSONArray("lineList", linesList);
    //     if (useTestKeystone) saveJSONObject(json, "data/lines/lines_Test.json");
    //     else saveJSONObject(json, "data/lines/lines.json");
    // }

    //   color getCycleColor(color c1, color c2, float per) {
    //     per *= 2;
    //     if (per < 1) {
    //         return lerpColor(c1, c2, per);
    //     } else {
    //         per = map(per, 1, 2, 0, 1);
    //         return lerpColor(c2, c1, per);
    //     }
    // }

    //   color getCycleColor(color c1, color c2, color c3, float per) {
    //     per *= 3;
    //     if (per < 1) {
    //         return lerpColor(c1, c2, per);
    //     } else if (per < 2) {
    //         per = map(per, 1, 2, 1, 0);
    //         return lerpColor(c3, c2, per);
    //     } else {
    //         per = map(per, 2, 3, 1, 0);
    //         return lerpColor(c1, c3, per);
    //     }
}

export default LineMap;