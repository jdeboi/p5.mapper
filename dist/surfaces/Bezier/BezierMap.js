"use strict";
// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BezierPoint_1 = __importDefault(require("./BezierPoint"));
var Surface_1 = __importDefault(require("../Surface"));
var BezierMap = /** @class */ (function (_super) {
    __extends(BezierMap, _super);
    function BezierMap(id, numPoints, pMapper, pInst) {
        var _this = _super.call(this, id, 0, 0, 0, "BEZ", pMapper.buffer, pInst) || this;
        _this.pMapper = pMapper;
        _this.bufferSpace = 10;
        _this.width = 100;
        _this.height = 100;
        _this.initEmpty(numPoints);
        _this.mode = "FREE";
        _this.r = 8;
        return _this;
    }
    BezierMap.prototype.initEmpty = function (numAnchors) {
        if (numAnchors === void 0) { numAnchors = 5; }
        this.points = [];
        this.x = 0;
        this.y = 0;
        var r = 100;
        var lineW = 50;
        var x = r * Math.cos(0);
        var y = r * Math.sin(0);
        var x0 = lineW * Math.cos(Math.PI / 2);
        var y0 = -lineW * Math.sin(Math.PI / 2);
        var x1 = -x0;
        var y1 = -y0;
        this.points.push(new BezierPoint_1.default(x, y, this, this.pInst));
        this.points.push(new BezierPoint_1.default(x + x1, y + y1, this, this.pInst));
        for (var i = 1; i < numAnchors; i++) {
            var ang = (i * 2 * Math.PI) / numAnchors;
            var x_1 = r * Math.cos(ang);
            var y_1 = r * Math.sin(ang);
            var x0_1 = -lineW * Math.cos(Math.PI / 2 - ang);
            var y0_1 = lineW * Math.sin(Math.PI / 2 - ang);
            var x1_1 = -x0_1;
            var y1_1 = -y0_1;
            this.points.push(new BezierPoint_1.default(x_1 + x1_1, y_1 + y1_1, this, this.pInst));
            this.points.push(new BezierPoint_1.default(x_1, y_1, this, this.pInst));
            this.points.push(new BezierPoint_1.default(x_1 + x0_1, y_1 + y0_1, this, this.pInst));
        }
        this.points.push(new BezierPoint_1.default(x + x0, y + y0, this, this.pInst));
        //
        // this.points.push(new BezierPoint( r * Math.cos(ang2),  r * sin(ang2), this));
        //
        this.closed = true;
        this.auto = false;
    };
    BezierMap.prototype.setAlignedMode = function () {
        this.mode = "ALIGNED";
    };
    BezierMap.prototype.setMirroredMode = function () {
        this.mode = "MIRRORED";
    };
    BezierMap.prototype.setFreeMode = function () {
        this.mode = "FREE";
    };
    BezierMap.prototype.setAutomaticMode = function () {
        this.mode = "AUTOMATIC";
    };
    BezierMap.prototype.setBezierDetail = function (num) {
        if (num === void 0) { num = 20; }
        this.pMapper.bezBuffer.bezierDetail(num);
        this.pMapper.buffer.bezierDetail(num);
    };
    BezierMap.prototype.isReady = function () {
        return this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded;
    };
    BezierMap.prototype.load = function (json) {
        this.points = [];
        this.x = json.x;
        this.y = json.y;
        this.closed = json.closed;
        this.auto = json.auto;
        for (var _i = 0, _a = json.points; _i < _a.length; _i++) {
            var p = _a[_i];
            this.points.push(new BezierPoint_1.default(p.x, p.y, this, this.pInst));
        }
        this.setDimensions();
    };
    BezierMap.prototype.getJson = function () {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            points: this.points.map(function (p) {
                return { x: p.pos.x, y: p.pos.y };
            }),
            closed: this.closed,
            auto: this.auto,
        };
    };
    BezierMap.prototype.serialize = function () {
        return JSON.stringify(this.getJson());
    };
    BezierMap.prototype.selectSurface = function () {
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    };
    BezierMap.prototype.selectPoints = function () {
        // check if control points are selected
        var controls = this.selectControls();
        if (controls)
            return controls;
        return this.selectAnchors();
    };
    BezierMap.prototype.selectAnchors = function () {
        // check if control points are selected
        for (var i = 0; i < this.points.length; i += 3) {
            var p = this.points[i];
            if (p.select()) {
                return p;
            }
        }
        return null;
    };
    BezierMap.prototype.selectControls = function () {
        // check if control points are selected
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            if (p.isAnchor()) {
                continue;
            }
            else if (p.select())
                return p;
        }
        return null;
    };
    BezierMap.prototype.getBounds = function () {
        var polyline = this.getPolyline();
        return _super.prototype.getBounds.call(this, polyline);
    };
    BezierMap.prototype.loopIndex = function (i) {
        return (i + this.points.length) % this.points.length;
    };
    BezierMap.prototype.toggleClosed = function () {
        if (this.closed) {
            this.closed = false;
            this.points.pop();
            this.points.pop();
        }
        else {
            this.closed = true;
            var anchor1 = this.points[this.points.length - 1].pos;
            var control1 = this.points[this.points.length - 2].pos;
            var anchor2 = this.points[0].pos;
            var control2 = this.points[1].pos;
            var newControl1 = p5.Vector.lerp(anchor1, control1, -1);
            var cp1 = new BezierPoint_1.default(newControl1.x, newControl1.y, this, this.pInst);
            var newControl2 = p5.Vector.lerp(anchor2, control2, -1);
            var cp2 = new BezierPoint_1.default(newControl2.x, newControl2.y, this, this.pInst);
            this.points.push(cp1, cp2);
        }
        this.setDimensions();
    };
    BezierMap.prototype.setDimensions = function () {
        var _a = this.getBounds(), w = _a.w, h = _a.h;
        this.width = w + this.bufferSpace * 2;
        this.height = h + this.bufferSpace * 2;
        // editing the mask buffer of one bezier affects the others
        var bezBuffer = this.pMapper.bezBuffer;
        this.displayBezierPG(bezBuffer);
    };
    BezierMap.prototype.numSegments = function () {
        return Math.floor(this.points.length / 3);
    };
    BezierMap.prototype.getSegment = function (i) {
        return [
            this.points[this.loopIndex(i * 3 + 0)],
            this.points[this.loopIndex(i * 3 + 1)],
            this.points[this.loopIndex(i * 3 + 2)],
            this.points[this.loopIndex(i * 3 + 3)],
        ];
    };
    BezierMap.prototype.addSegment = function (x, y) {
        if (!x) {
            x = this.pInst.mouseX - this.pInst.width / 2 - this.x;
        }
        if (!y) {
            y = this.pInst.mouseY - this.pInst.height / 2 - this.y;
        }
        var closestAnchorId = this.getClosestAnchor();
        var nextClosestAnchorId = this.getNextClosestAnchor();
        var prevControl = this.points[closestAnchorId + 1].pos;
        var nextControlID = nextClosestAnchorId - 1;
        if (nextControlID == -1) {
            nextControlID = this.points.length - 1;
        }
        var nextControl = this.points[nextControlID].pos;
        var anchor = this.pInst.createVector(x, y);
        var aP = new BezierPoint_1.default(anchor.x, anchor.y, this, this.pInst);
        var control1 = p5.Vector.lerp(prevControl, anchor, 1 - 0.3);
        var control2 = p5.Vector.lerp(anchor, nextControl, 0.3);
        var cp1 = new BezierPoint_1.default(control1.x, control1.y, this, this.pInst);
        var cp2 = new BezierPoint_1.default(control2.x, control2.y, this, this.pInst);
        this.points.splice(closestAnchorId + 2, 0, cp1, aP, cp2);
    };
    BezierMap.prototype.removeSegment = function () {
        if (this.points.length <= 3) {
            console.warn("cannot have a bezier with less than one anchor");
            return;
        }
        for (var i = 0; i < this.points.length; i += 3) {
            if (this.points[i].select()) {
                this.points.splice(i, 3);
            }
        }
    };
    BezierMap.prototype.getClosestAnchor = function () {
        var mx = this.pInst.mouseX - this.pInst.width / 2 - this.x;
        var my = this.pInst.mouseY - this.pInst.height / 2 - this.y;
        var minDis = Infinity;
        var index = 0;
        for (var i = 0; i < this.points.length; i += 3) {
            if (i >= this.points.length - 3) {
                var p0 = this.points[i];
                var p1 = this.points[0];
            }
            else {
                var p0 = this.points[i];
                var p1 = this.points[i + 3];
            }
            var d0 = this.pInst.dist(p0.pos.x, p0.pos.y, mx, my);
            var d1 = this.pInst.dist(p1.pos.x, p1.pos.y, mx, my);
            if (d0 + d1 < minDis) {
                minDis = d0 + d1;
                index = i;
            }
        }
        return index;
    };
    BezierMap.prototype.getNextClosestAnchor = function () {
        var anchor = this.getClosestAnchor();
        var next = anchor + 3;
        if (next > this.points.length - 3)
            next = 0;
        return next;
    };
    BezierMap.prototype.autoSetControlPoint = function (anchorI, controlSpacing) {
        if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed)
            return;
        var anchorLeftI = this.loopIndex(anchorI - 3);
        var anchorRightI = this.loopIndex(anchorI + 3);
        var anchor = this.points[anchorI];
        var anchorLeft = this.points[anchorLeftI];
        var anchorRight = this.points[anchorRightI];
        var dispLeft = p5.Vector.sub(anchorLeft, anchor);
        var dispRight = p5.Vector.sub(anchorRight, anchor);
        var magLeft = dispLeft.mag();
        var magRight = dispRight.mag();
        dispLeft.normalize();
        dispRight.normalize();
        var dirLeft = p5.Vector.sub(dispLeft, dispRight);
        var dirRight = p5.Vector.sub(dispRight, dispLeft);
        dirLeft.setMag(magLeft * controlSpacing);
        dirRight.setMag(magRight * controlSpacing);
        this.points[this.loopIndex(anchorI - 1)].set(p5.Vector.add(anchor, dirLeft));
        this.points[this.loopIndex(anchorI + 1)].set(p5.Vector.add(anchor, dirRight));
    };
    BezierMap.prototype.autoSetEdgePoints = function (controlSpacing) {
        if (this.closed)
            return;
        this.points[1].set(p5.Vector.lerp(this.points[0].pos, this.points[2].pos, controlSpacing));
        this.points[this.points.length - 2].set(p5.Vector.lerp(this.points[this.points.length - 1].pos, this.points[this.points.length - 3].pos, controlSpacing));
    };
    BezierMap.prototype.autoSetAllControlPoints = function (controlSpacing) {
        for (var i = 0; i < this.points.length; i += 3) {
            this.autoSetControlPoint(i, controlSpacing);
        }
        this.autoSetEdgePoints(controlSpacing);
    };
    BezierMap.prototype.display = function (col) {
        if (col === void 0) { col = this.pInst.color("black"); }
        this.pInst.noStroke();
        this.pInst.fill(col);
        this.displayBezier();
        this.displayCalib();
    };
    BezierMap.prototype.displayCalib = function () {
        if (this.pInst.isCalibratingMapper()) {
            this.pInst.strokeWeight(3);
            this.pInst.stroke(this.controlPointColor);
            this.pInst.fill(this.getMutedControlColor());
            this.displayBezier();
        }
    };
    BezierMap.prototype.displayTexture = function (img, x, y, texW, texH) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (texW === void 0) { texW = 0; }
        if (texH === void 0) { texH = 0; }
        if (!this.isReady()) {
            return;
        }
        var buffer = this.pMapper.buffer;
        this.drawImage(img, buffer, x, y, texW, texH);
        this.displayGraphicsTexture(buffer);
        this.displayCalib();
    };
    BezierMap.prototype.displaySketch = function (sketch, x, y, tW, tH) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (tW === void 0) { tW = 0; }
        if (tH === void 0) { tH = 0; }
        var buffer = this.pMapper.buffer;
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
    };
    BezierMap.prototype.displayGraphicsTexture = function (pBuffer) {
        if (!this.isReady()) {
            return;
        }
        // white bezier mask should be recreated every time
        // shape changes (this.setDimensions())
        this.setDimensions();
        var pMask = this.pMapper.bezBuffer;
        // let theShader = this.pMapper.bezShader;
        var pOutput = this.pMapper.bufferWEBGL;
        // had to clear for 1.9
        pOutput.clear();
        var frag = "// https://github.com/aferriss/p5jsShaderExamples \n        #ifdef GL_ES\n        precision mediump float;\n        #endif\n        \n        // grab texcoords from vert shader\n        varying vec2 vTexCoord;\n        \n        // our texture coming from p5\n        uniform sampler2D texMask;\n        uniform sampler2D texImg;\n        \n        \n        void main() {\n          vec2 uv = vTexCoord;\n          \n          // the texture is loaded upside down and backwards by default so lets flip it\n          uv.y = 1.0 - uv.y;\n          \n          vec4 maskT = texture2D(texMask, uv);\n          vec4 imgT = texture2D(texImg, uv);\n          \n          float gray = (maskT.r + maskT.g + maskT.b) / 3.0;\n        \n          // mask\n          float threshR = imgT.r* gray ;\n          float threshG = imgT.g* gray ;\n          float threshB = imgT.b* gray ;\n          vec3 thresh = vec3(threshR, threshG, threshB);\n        \n          // render the output\n          gl_FragColor = vec4(thresh, gray);\n        }";
        var vert = "// vert file and comments from adam ferriss\n        // https://github.com/aferriss/p5jsShaderExamples\n        \n        #ifdef GL_ES\n        precision mediump float;\n        #endif\n        \n        // our vertex data\n        attribute vec3 aPosition;\n        attribute vec2 aTexCoord;\n        \n        // lets get texcoords just for fun! \n        varying vec2 vTexCoord;\n        \n        void main() {\n          // copy the texcoords\n          vTexCoord = aTexCoord;\n        \n          // copy the position data into a vec4, using 1.0 as the w component\n          vec4 positionVec4 = vec4(aPosition, 1.0);\n          positionVec4.xy = positionVec4.xy * 2.0 - 1.0;\n        \n          // send the vertex information on to the fragment shader\n          gl_Position = positionVec4;\n        }";
        // TODO - no need to create this every time... (?)
        // for some reason didn't work in the ProjectionMapper class...
        var theShader = pOutput.createShader(vert, frag);
        pOutput.setAttributes("alpha", true);
        pOutput.shader(theShader);
        theShader.setUniform("resolution", [this.pInst.width, this.pInst.height]);
        theShader.setUniform("time", millis() / 1000.0);
        theShader.setUniform("mouse", [
            this.pInst.mouseX,
            this.pInst.map(this.pInst.mouseY, 0, this.pInst.height, this.pInst.height, 0),
        ]);
        theShader.setUniform("texMask", pMask);
        theShader.setUniform("texImg", pBuffer);
        pOutput.rect(0, 0, this.pInst.width, this.pInst.height);
        var _a = this.getBounds(), x = _a.x, y = _a.y;
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.translate(x - this.bufferSpace, y - this.bufferSpace);
        this.pInst.image(pOutput, 0, 0);
        this.pInst.pop();
        this.displayCalib();
    };
    BezierMap.prototype.drawImage = function (img, pg, x, y, texW, texH) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (texW === void 0) { texW = 0; }
        if (texH === void 0) { texH = 0; }
        if (img && pg) {
            if (texH <= 0)
                texW = img.width;
            if (texH <= 0)
                texH = img.height;
            pg.push();
            pg.clear();
            // useful for WEBGL mode...
            // pg.translate(-pg.width / 2, -pg.height / 2);
            pg.translate(x, y);
            pg.image(img, 0, 0, texW, texH);
            pg.pop();
        }
    };
    BezierMap.prototype.displayBezierPG = function (pg) {
        var _a = this.getBounds(), x = _a.x, y = _a.y;
        pg.push();
        pg.clear();
        pg.fill("white");
        pg.translate(-x, -y);
        pg.translate(this.bufferSpace, this.bufferSpace);
        pg.beginShape();
        pg.vertex(this.points[0].pos.x, this.points[0].pos.y);
        for (var i = 0; i < this.numSegments(); i++) {
            var seg = this.getSegment(i);
            pg.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
        pg.endShape();
        pg.pop();
    };
    BezierMap.prototype.displayBezier = function () {
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.pInst.beginShape();
        this.pInst.vertex(this.points[0].pos.x, this.points[0].pos.y);
        for (var i = 0; i < this.numSegments(); i++) {
            var seg = this.getSegment(i);
            this.pInst.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
        this.pInst.endShape();
        this.pInst.pop();
    };
    BezierMap.prototype.displayControlPoints = function () {
        if (this.pInst.isMovingPoints()) {
            var lineC = this.controlPointColor;
            this.pInst.push();
            this.pInst.translate(this.x, this.y);
            if (!this.auto) {
                this.displayControlLines(lineC);
            }
            this.displayControlCircles(this.pInst.color("red"));
            this.pInst.pop();
        }
    };
    BezierMap.prototype.displayControlLines = function (strokeC) {
        this.pInst.strokeWeight(2);
        for (var i = 0; i < this.numSegments(); i++) {
            var seg = this.getSegment(i);
            this.pInst.stroke(strokeC);
            this.pInst.line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
            this.pInst.line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
        }
    };
    BezierMap.prototype.displayControlCircles = function (anchorCol) {
        var i = 0;
        var index = this.getClosestAnchor();
        var nextIndex = this.getNextClosestAnchor();
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            var col = anchorCol;
            if (i == index) {
                col = this.pInst.color(255, 200, 200);
            }
            else if (i == nextIndex) {
                col = this.pInst.color(255, 200, 200);
            }
            p.displayControlCircle(col);
            i++;
        }
    };
    BezierMap.prototype.getPolyline = function () {
        var polyline = [];
        for (var i = 0; i < this.numSegments(); i++) {
            var seg = this.getSegment(i);
            var steps = 4;
            for (var i_1 = 0; i_1 <= steps; i_1++) {
                var t = i_1 / steps;
                var x = this.pInst.bezierPoint(seg[0].pos.x, seg[1].pos.x, seg[2].pos.x, seg[3].pos.x, t);
                var y = this.pInst.bezierPoint(seg[0].pos.y, seg[1].pos.y, seg[2].pos.y, seg[3].pos.y, t);
                polyline.push({ x: x, y: y });
            }
        }
        return polyline;
    };
    //(x0,y0) is start point; (x1,y1),(x2,y2) is control points; (x3,y3) is end point.
    BezierMap.prototype.isMouseOver = function () {
        var polyline = this.getPolyline();
        var mx = this.pInst.mouseX - this.pInst.width / 2 - this.x;
        var my = this.pInst.mouseY - this.pInst.height / 2 - this.y;
        return this.inside(mx, my, polyline);
    };
    BezierMap.prototype.inside = function (x, y, vs) {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].x, yi = vs[i].y;
            var xj = vs[j].x, yj = vs[j].y;
            var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect)
                inside = !inside;
        }
        return inside;
    };
    return BezierMap;
}(Surface_1.default));
exports.default = BezierMap;
