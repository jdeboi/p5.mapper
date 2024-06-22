"use strict";
// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/
Object.defineProperty(exports, "__esModule", { value: true });
var ControlPoint = /** @class */ (function () {
    function ControlPoint(x, y, parentPath, pInst) {
        // this.id = parentPath.points.length;
        this.pInst = pInst;
        this.pos = pInst.createVector(x, y);
        this.parentPath = parentPath;
        this.type = "CPOINT";
        this.r = 8;
    }
    ControlPoint.prototype.add = function (x, y) {
        this.pos.add(x, y);
    };
    ControlPoint.prototype.set = function (x, y) {
        this.pos.set(x, y);
    };
    ControlPoint.prototype.select = function () {
        var px = this.pos.x + this.parentPath.x;
        var py = this.pos.y + this.parentPath.y;
        var mx = this.pInst.mouseX - this.pInst.width / 2;
        var my = this.pInst.mouseY - this.pInst.height / 2;
        if (this.pInst.dist(px, py, mx, my) < 5) {
            return true;
        }
        return false;
    };
    ControlPoint.prototype.moveTo = function () {
        var x = this.pInst.mouseX - this.pInst.width / 2 - this.parentPath.x;
        var y = this.pInst.mouseY - this.pInst.height / 2 - this.parentPath.y;
        var closed = true;
        var path = this.parentPath;
        var i = path.points.indexOf(this);
        if (i % 3 == 0) {
            // anchor (red) points
            var dx = x - (this.pos.x);
            var dy = y - (this.pos.y);
            this.pos.set(x, y);
            if (i - 1 >= 0 || closed) {
                path.points[path.loopIndex(i - 1)].add(dx, dy);
            }
            if (i + 1 < path.points.length || closed) {
                path.points[path.loopIndex(i + 1)].add(dx, dy);
            }
            if (path.mode == "AUTOMATIC")
                path.autoSetAllControlPoints();
        }
        else if (path.mode != "AUTOMATIC") {
            // control (white) points
            this.pos.set(x, y);
            var anchorI = (i % 3 == 1) ? i - 1 : i + 1;
            var otherI = (i % 3 == 1) ? i - 2 : i + 2;
            if (otherI >= 0 && otherI < path.points.length || closed) {
                var anchor = path.points[path.loopIndex(anchorI)].pos;
                var other = path.points[path.loopIndex(otherI)].pos;
                if (path.mode == "ALIGNED") {
                    var dist = p5.Vector.dist(anchor, other);
                    var disp = p5.Vector.sub(anchor, this.pos);
                    disp.setMag(dist);
                    other.set(p5.Vector.add(anchor, disp));
                }
                else if (path.mode == "MIRRORED") {
                    other.set(p5.Vector.lerp(anchor, this.pos, -1));
                }
            }
        }
        path.setDimensions();
    };
    ControlPoint.prototype.isAnchor = function () {
        var i = this.parentPath.points.indexOf(this);
        return i % 3 == 0;
    };
    ControlPoint.prototype.displayControlCircle = function (strokeC) {
        if (strokeC === void 0) { strokeC = this.pInst.color(255, 0, 0); }
        var i = this.parentPath.points.indexOf(this);
        this.pInst.stroke(strokeC);
        this.pInst.strokeWeight(2);
        if (i % 3 == 0) {
            // anchor
            this.displayCircle(strokeC, this.r);
        }
        else if (!this.parentPath.auto) {
            var col = this.parentPath.controlPointColor;
            this.displayCircle(col, this.r - 2);
        }
    };
    ControlPoint.prototype.displayCircle = function (col, r) {
        this.pInst.noFill();
        this.pInst.stroke(col);
        this.pInst.ellipse(this.pos.x, this.pos.y, r * 2);
        this.pInst.noStroke();
        this.pInst.fill(col);
        this.pInst.ellipse(this.pos.x, this.pos.y, r);
        // const i = this.parentPath.points.indexOf(this);
        // text(i, this.pos.x, this.pos.y+20);
    };
    return ControlPoint;
}());
exports.default = ControlPoint;
