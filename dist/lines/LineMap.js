"use strict";
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
var Draggable_1 = __importDefault(require("../surfaces/Draggable"));
var MovePoint_1 = __importDefault(require("../surfaces/MovePoint"));
var p5_1 = __importDefault(require("p5"));
var LineMap = /** @class */ (function (_super) {
    __extends(LineMap, _super);
    function LineMap(x0, y0, x1, y1, id, pInst) {
        var _this = _super.call(this, pInst, 0, 0) || this;
        _this.id = id;
        _this.x = 0;
        _this.y = 0;
        _this.type = "LINE";
        _this.lineW = 10;
        _this.endCapsOn = true;
        _this.lastChecked = 0;
        _this.lineC = _this.pInst.color(255);
        _this.highlightColor = _this.pInst.color(0, 255, 0);
        // this.controlPointColor = this.getLinearIdColor(this.id);
        _this.p0 = new MovePoint_1.default(_this, x0, y0, _this.pInst);
        _this.p1 = new MovePoint_1.default(_this, x1, y1, _this.pInst);
        _this.leftToRight();
        _this.ang = _this.pInst.atan2(_this.p0.y - _this.p1.y, _this.p0.x - _this.p1.x);
        if (_this.ang > _this.pInst.PI / 2)
            _this.ang -= 2 * _this.pInst.PI;
        _this.pInst.strokeCap(_this.pInst.SQUARE);
        return _this;
    }
    //////////////////////////////////////////////
    // LOADING / SAVING
    //////////////////////////////////////////////
    LineMap.prototype.load = function (json) {
        this.x = json.x;
        this.y = json.y;
        this.p0.x = json.x0;
        this.p0.y = json.y0;
        this.p1.x = json.x1;
        this.p1.y = json.y1;
        this.lineW =
            json.lineW !== undefined && json.lineW !== null ? json.lineW : 10;
        this.endCapsOn = json.endCapsOn !== undefined ? json.endCapsOn : true;
    };
    LineMap.prototype.getJson = function () {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            x0: this.p0.x,
            y0: this.p0.y,
            x1: this.p1.x,
            y1: this.p1.y,
            lineW: this.lineW,
            endCapsOn: this.endCapsOn,
        };
    };
    //////////////////////////////////////////////
    // DISPLAY METHODS
    //////////////////////////////////////////////
    LineMap.prototype.display = function (col, sw) {
        if (col === void 0) { col = this.lineC; }
        if (sw === void 0) { sw = this.lineW; }
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.setOGEndCaps();
        this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(this.p0, this.p1, col, col);
        this.pInst.pop();
    };
    LineMap.prototype.displayCenterPulse = function (per, col, sw) {
        if (col === void 0) { col = this.lineC; }
        if (sw === void 0) { sw = this.lineW; }
        var midX = (this.p0.x + this.p1.x) / 2;
        var midY = (this.p0.y + this.p1.y) / 2;
        var x0 = this.pInst.map(per, 0, 1.0, midX, this.p0.x);
        var x1 = this.pInst.map(per, 0, 1.0, midX, this.p1.x);
        var y0 = this.pInst.map(per, 0, 1.0, midY, this.p0.y);
        var y1 = this.pInst.map(per, 0, 1.0, midY, this.p1.y);
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.setOGEndCaps();
        this.pInst.line(x0, y0, x1, y1);
        this.drawEndCaps({ x: x0, y: y0 }, { x: x1, y: y1 }, col, col);
        this.pInst.pop();
    };
    LineMap.prototype.displayPercent = function (per, col, sw) {
        if (col === void 0) { col = this.lineC; }
        if (sw === void 0) { sw = this.lineW; }
        var p = per;
        var p0 = this.pInst.createVector(this.p0.x, this.p0.y);
        var p1 = this.pInst.createVector(this.p1.x, this.p1.y);
        var pTemp = p5_1.default.Vector.lerp(p0, p1, p);
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.setOGEndCaps();
        this.pInst.line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
        this.drawEndCaps(p0, pTemp, col, col);
        this.pInst.pop();
    };
    LineMap.prototype.displayPercentWidth = function (per, col) {
        if (col === void 0) { col = this.lineC; }
        per = this.pInst.constrain(per, 0, 1.0);
        var sw = this.pInst.map(per, 0, 1.0, 0, 10);
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.setOGEndCaps();
        this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        this.drawEndCaps(this.p0, this.p1, col, col, sw);
        this.pInst.pop();
    };
    LineMap.prototype.displayNone = function () {
        this.display(this.pInst.color(0));
    };
    LineMap.prototype.displayRainbowCycle = function () {
        this.pInst.colorMode(this.pInst.HSB, 255);
        var col = this.pInst.color(this.pInst.frameCount % 255, 255, 255);
        this.display(col);
        this.pInst.colorMode(this.pInst.RGB, 255);
    };
    LineMap.prototype.displayGradientLine = function (c1, c2, per, phase, flip) {
        if (phase === void 0) { phase = 1; }
        if (flip === void 0) { flip = false; }
        per += phase;
        per %= 1;
        var spacing = 1.0 / this.pInst.height;
        for (var i = 0; i < 1.0; i += spacing) {
            var grad = (i / 2 + per) % 1;
            var col = this.get2CycleColor(c1, c2, grad);
            this.displaySegment(i, spacing, col);
        }
    };
    LineMap.prototype.getCalibrationHue = function () {
        return (this.id * 15) % 255;
    };
    LineMap.prototype.getControlPointColor = function () {
        this.pInst.colorMode(this.pInst.HSB, 255);
        var h = this.getCalibrationHue();
        var col = this.pInst.color(h, 80, 255);
        this.pInst.colorMode(this.pInst.RGB);
        return col;
    };
    LineMap.prototype.getCalibrationColor = function () {
        this.pInst.colorMode(this.pInst.HSB, 255);
        var h = this.getCalibrationHue();
        var col = this.pInst.color(h, 255, 255);
        this.pInst.colorMode(this.pInst.RGB);
        return col;
    };
    //////////////////////////////////////////////
    // DISPLAY HELPERS
    //////////////////////////////////////////////
    LineMap.prototype.displayCalibration = function () {
        if (this.isMouseOver()) {
            this.display(this.pInst.color(200));
        }
        else {
            this.display(this.getCalibrationColor());
        }
    };
    LineMap.prototype.displayControlPoints = function () {
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        this.p0.display(this.getControlPointColor());
        this.p1.display(this.getControlPointColor());
        this.pInst.pop();
    };
    LineMap.prototype.setEndCapsOn = function () {
        this.endCapsOn = true;
    };
    LineMap.prototype.setEndCapsOff = function () {
        this.endCapsOn = false;
    };
    LineMap.prototype.drawEndCaps = function (p0, p1, col0, col1, sw) {
        if (col0 === void 0) { col0 = this.lineC; }
        if (col1 === void 0) { col1 = this.lineC; }
        if (sw === void 0) { sw = this.lineW; }
        if (!this.endCapsOn) {
            return;
        }
        this.pInst.noStroke();
        if (this.pInst.dist(p0.x, p0.y, p1.x, p1.y) > 1) {
            this.pInst.fill(col0);
            this.pInst.ellipse(p0.x, p0.y, sw);
            this.pInst.fill(col1);
            this.pInst.ellipse(p1.x, p1.y, sw);
        }
    };
    LineMap.prototype.displaySegment = function (startPer, sizePer, col, sw) {
        if (col === void 0) { col = this.lineC; }
        if (sw === void 0) { sw = this.lineW; }
        this.pInst.strokeWeight(sw);
        this.pInst.stroke(col);
        var p0 = this.pInst.createVector(this.p0.x, this.p0.y);
        var p1 = this.pInst.createVector(this.p1.x, this.p1.y);
        var pTemp = p5_1.default.Vector.lerp(p0, p1, startPer);
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        var pTempEnd = p5_1.default.Vector.lerp(pTemp, p1, startPer + sizePer);
        this.setOGEndCaps();
        this.pInst.line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
        this.drawEndCaps(pTemp, pTempEnd, col, col);
        this.pInst.pop();
    };
    //////////////////////////////////////////////
    // COLOR HELPERS
    //////////////////////////////////////////////
    LineMap.prototype.setOGEndCaps = function () {
        if (this.endCapsOn) {
            // this.pInst.strokeCap(this.pInst.ROUND);
        }
        else {
            this.pInst.strokeCap(this.pInst.SQUARE);
        }
    };
    LineMap.prototype.get2CycleColor = function (c1, c2, per) {
        per = this.pInst.constrain(per, 0, 1);
        per *= 2;
        if (per < 1) {
            return this.pInst.lerpColor(c1, c2, per);
        }
        else {
            per = this.pInst.map(per, 1, 2, 0, 1);
            return this.pInst.lerpColor(c2, c1, per);
        }
    };
    LineMap.prototype.get3CycleColor = function (c1, c2, per) {
        per = this.pInst.constrain(per, 0, 1);
        per *= 3;
        if (per < 1) {
            return this.pInst.lerpColor(c1, c2, per);
        }
        else if (per < 2) {
            per = this.pInst.map(per, 1, 2, 1, 0);
            return this.pInst.lerpColor(c2, c1, per);
        }
        else {
            per = this.pInst.map(per, 2, 3, 1, 0);
            return this.pInst.lerpColor(c1, c2, per);
        }
    };
    LineMap.prototype.getPointHighlight = function (p) {
        // this.pInst.colorMode(this.pInst.RGB, 255);
        // if (this.isMouseOverPoint(p)) this.pInst.stroke(0, 255, 0);
        // else
        this.pInst.stroke(255, 0, 0);
    };
    //////////////////////////////////////////////
    // CLICK DETECTION
    //////////////////////////////////////////////
    LineMap.prototype.isMouseOver = function () {
        var x1 = this.p0.x;
        var y1 = this.p0.y;
        var x2 = this.p1.x;
        var y2 = this.p1.y;
        var px = this.pInst.mouseX - this.pInst.width / 2 - this.x;
        var py = this.pInst.mouseY - this.pInst.height / 2 - this.y;
        var d1 = this.pInst.dist(px, py, x1, y1);
        var d2 = this.pInst.dist(px, py, x2, y2);
        var lineLen = this.pInst.dist(x1, y1, x2, y2);
        var buffer = 0.15 * this.lineW; // higher # = less accurate
        return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
    };
    LineMap.prototype.isMouseOverCallback = function (callback) {
        if (this.isMouseOver()) {
            callback(this);
        }
    };
    LineMap.prototype.selectSurface = function () {
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    };
    LineMap.prototype.selectPoints = function () {
        if (this.p0.isMouseOver()) {
            this.p0.startDrag();
            return this.p0;
        }
        if (this.p1.isMouseOver()) {
            this.p1.startDrag();
            return this.p1;
        }
        return null;
    };
    //////////////////////////////////////////////
    // OTHER HELPERS
    //////////////////////////////////////////////
    LineMap.prototype.leftToRight = function () {
        if (this.p0.x > this.p1.x) {
            var temp = this.pInst.createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    };
    LineMap.prototype.rightToLeft = function () {
        if (this.p0.x < this.p1.x) {
            var temp = this.pInst.createVector(this.p0.x, this.p0.y);
            this.p0.set(this.p1);
            this.p1.set(temp);
        }
    };
    LineMap.prototype.displayNumber = function () {
        this.pInst.push();
        this.pInst.translate(this.x + this.p1.x + 20, this.y + this.p1.y + 5, 2);
        this.pInst.textAlign(this.pInst.CENTER, this.pInst.CENTER);
        this.pInst.noStroke();
        this.pInst.fill(255, 0, 0);
        this.pInst.ellipse(0, 0, 10, 10);
        this.pInst.fill(255);
        this.pInst.text(this.id.toString(), 0, 0);
        this.pInst.pop();
    };
    LineMap.prototype.setLineThickness = function (thickness) {
        this.lineW = thickness;
        if (this.lineW < 0)
            this.lineW = 0;
    };
    return LineMap;
}(Draggable_1.default));
exports.default = LineMap;
