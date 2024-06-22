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
var CornerPinSurface_1 = __importDefault(require("./CornerPinSurface"));
var TriMap = /** @class */ (function (_super) {
    __extends(TriMap, _super);
    function TriMap(id, w, h, res, buffer, pInst) {
        var _this = _super.call(this, id, w, h, res, "TRI", buffer, pInst) || this;
        _this.setTriMesh();
        return _this;
    }
    /**
     * Returns true if the mouse is over this surface, false otherwise.
     */
    TriMap.prototype.isMouseOver = function () {
        var mx = this.pInst.mouseX - this.pInst.width / 2;
        var my = this.pInst.mouseY - this.pInst.height / 2;
        if (this.isPointInTriangle(mx - this.x, my - this.y, this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]))
            return true;
        return false;
    };
    // Compute barycentric coordinates (u, v, w) for
    // point p with respect to triangle (a, b, c)
    TriMap.prototype.Barycentric = function (p, a, b, c, u, v, w) {
        var v0 = b.sub(a), v1 = c.sub(a), v2 = p.sub(a);
        var d00 = v0.dot(v0);
        var d01 = v0.dot(v1);
        var d11 = v1.dot(v1);
        var d20 = v2.dot(v0);
        var d21 = v2.dot(v1);
        var denom = d00 * d11 - d01 * d01;
        v = (d11 * d20 - d01 * d21) / denom;
        w = (d00 * d21 - d01 * d20) / denom;
        u = 1.0 - v - w;
    };
    TriMap.prototype.setTriMesh = function () {
        this.TP = Math.floor(this.res / 2) - 1;
        this.mesh[this.TP].setControlPoint(true);
        this.mesh[this.TL].setControlPoint(false);
        this.mesh[this.TR].setControlPoint(false);
        this.controlPoints = [];
        this.controlPoints.push(this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]);
    };
    TriMap.prototype.displaySurface = function (isUV, tX, tY, tW, tH) {
        if (isUV === void 0) { isUV = true; }
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (tW === void 0) { tW = 1; }
        if (tH === void 0) { tH = 1; }
        this.pInst.beginShape();
        var u = 0 - tX;
        var v = this.height * tH - tY;
        // u *= this.width/tW;
        // v *= this.height/tH;
        if (isUV)
            this.pInst.vertex(this.mesh[this.BL].x, this.mesh[this.BL].y, u, v);
        else
            this.pInst.vertex(this.mesh[this.BL].x, this.mesh[this.BL].y);
        u = this.width / 2 * tW - tX;
        v = 0 - tY;
        // u *= this.width/tW;
        // v *= this.height/tH;
        if (isUV)
            this.pInst.vertex(this.mesh[this.TP].x, this.mesh[this.TP].y, u, v);
        else
            this.pInst.vertex(this.mesh[this.TP].x, this.mesh[this.TP].y);
        u = this.width * tW - tX;
        v = this.height * tH - tY;
        // u *= this.width/tW;
        // v *= this.height/tH;
        if (isUV)
            this.pInst.vertex(this.mesh[this.BR].x, this.mesh[this.BR].y, u, v);
        else
            this.pInst.vertex(this.mesh[this.BR].x, this.mesh[this.BR].y);
        this.pInst.endShape(this.pInst.CLOSE);
    };
    return TriMap;
}(CornerPinSurface_1.default));
exports.default = TriMap;
