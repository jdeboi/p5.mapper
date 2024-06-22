"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Draggable = /** @class */ (function () {
    function Draggable(pInst, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.pInst = pInst;
        this.x = x;
        this.y = y;
        this.clickX = 0;
        this.clickY = 0;
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
    }
    Draggable.prototype.startDrag = function () {
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = this.pInst.mouseX;
        this.clickY = this.pInst.mouseY;
    };
    Draggable.prototype.moveTo = function () {
        this.x = this.xStartDrag + this.pInst.mouseX - this.clickX;
        this.y = this.yStartDrag + this.pInst.mouseY - this.clickY;
    };
    return Draggable;
}());
exports.default = Draggable;
