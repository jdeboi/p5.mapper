"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MovePoint = /** @class */ (function () {
    function MovePoint(parent, x, y, pInst) {
        this.pInst = pInst;
        this.x = x;
        this.y = y;
        this.type = "CPOINT";
        this.r = 8;
        this.isControlPoint = false;
        this.parent = parent;
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = 0;
        this.clickY = 0;
        this.col = this.pInst.color(0, 255, 255);
    }
    MovePoint.prototype.isMouseOver = function () {
        var mx = this.pInst.mouseX;
        var my = this.pInst.mouseY;
        // updated for p5.js 1.9
        mx -= this.pInst.width / 2;
        my -= this.pInst.height / 2;
        var d = this.pInst.dist(mx, my, this.x + this.parent.x, this.y + this.parent.y);
        return d < this.r;
    };
    MovePoint.prototype.set = function (point) {
        this.x = point.x;
        this.y = point.y;
    };
    MovePoint.prototype.startDrag = function () {
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = this.pInst.mouseX;
        this.clickY = this.pInst.mouseY;
    };
    MovePoint.prototype.moveToMouse = function () {
        this.x = this.pInst.mouseX - this.pInst.width / 2;
        this.y = this.pInst.mouseY - this.pInst.height / 2;
    };
    MovePoint.prototype.moveTo = function () {
        this.x = this.xStartDrag + this.pInst.mouseX - this.clickX;
        this.y = this.yStartDrag + this.pInst.mouseY - this.clickY;
    };
    MovePoint.prototype.setControlPoint = function (cp) {
        this.isControlPoint = cp;
    };
    MovePoint.prototype.interpolateBetween = function (start, end, f) {
        this.x = start.x + (end.x - start.x) * f;
        this.y = start.y + (end.y - start.y) * f;
    };
    MovePoint.prototype.display = function (col) {
        if (col === void 0) { col = this.col; }
        if (this.pInst.isMovingPoints()) {
            var c = col;
            if (this.isMouseOver()) {
                c = this.pInst.color(255);
            }
            var isLogo = false;
            if (isLogo) {
                c = this.pInst.color(255);
                this.r = 20;
            }
            this.pInst.push();
            this.pInst.translate(0, 0, 5);
            this.pInst.stroke(c);
            this.pInst.strokeWeight(2);
            this.pInst.noFill();
            this.pInst.ellipse(this.x, this.y, this.r * 2);
            this.pInst.fill(c);
            this.pInst.ellipse(this.x, this.y, this.r);
            this.pInst.pop();
        }
    };
    return MovePoint;
}());
exports.default = MovePoint;
