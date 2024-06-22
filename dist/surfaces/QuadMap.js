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
var PerspT_1 = __importDefault(require("../perspective/PerspT"));
var CornerPinSurface_1 = __importDefault(require("./CornerPinSurface"));
var QuadMap = /** @class */ (function (_super) {
    __extends(QuadMap, _super);
    function QuadMap(id, w, h, res, buffer, pInst) {
        var _this = _super.call(this, id, w, h, res, "QUAD", buffer, pInst) || this;
        // TODO
        _this.resX = 20;
        _this.resY = 20; // pInst.constrain( pInst.floor(pInst.map(h, 0, 2000, 2, 50)), 2, 50 ); //h / space;
        return _this;
    }
    /**
     * Returns true if the mouse is over this surface, false otherwise.
     */
    QuadMap.prototype.isMouseOver = function () {
        var x = this.pInst.mouseX - this.pInst.width / 2;
        var y = this.pInst.mouseY - this.pInst.height / 2;
        if (this.isPointInTriangle(x - this.x, y - this.y, this.mesh[this.TL], this.mesh[this.TR], this.mesh[this.BL]) ||
            this.isPointInTriangle(x - this.x, y - this.y, this.mesh[this.BL], this.mesh[this.TR], this.mesh[this.BR]))
            return true;
        return false;
    };
    QuadMap.prototype.calculateMesh = function () {
        // The float constructor is deprecated, so casting everything to double
        var srcCorners = [
            0,
            0,
            this.width,
            0,
            this.width,
            this.height,
            0,
            this.height,
        ];
        var dstCorners = [
            this.mesh[this.TL].x,
            this.mesh[this.TL].y,
            this.mesh[this.TR].x,
            this.mesh[this.TR].y,
            this.mesh[this.BR].x,
            this.mesh[this.BR].y,
            this.mesh[this.BL].x,
            this.mesh[this.BL].y,
        ];
        this.perspT = (0, PerspT_1.default)(srcCorners, dstCorners);
        // this.warpPerspective = new WarpPerspective(transform);
        var xStep = this.width / (this.resX - 1);
        var yStep = this.height / (this.resY - 1);
        for (var i = 0; i < this.mesh.length; i++) {
            if (this.TL == i || this.BR == i || this.TR == i || this.BL == i)
                continue;
            var x = i % this.resX;
            var y = Math.floor(i / this.resX);
            x *= xStep;
            y *= yStep;
            // let point = this.warpPerspective.mapDestPoint(new Point((x, y));
            // this.mesh[i].x = point.getX();
            // this.mesh[i].y = point.getY();
            var dest = this.perspT.transform(x, y);
            this.mesh[i].x = dest[0];
            this.mesh[i].y = dest[1];
        }
    };
    QuadMap.prototype.displaySurface = function (isUV, tX, tY, tW, tH) {
        if (isUV === void 0) { isUV = true; }
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (tW === void 0) { tW = 1; }
        if (tH === void 0) { tH = 1; }
        this.pInst.beginShape(this.pInst.TRIANGLES);
        for (var x = 0; x < this.resX - 1; x++) {
            for (var y = 0; y < this.resY - 1; y++) {
                if (isUV)
                    this.getQuadTriangles(x, y, tX, tY, tW, tH);
                else
                    this.getQuadTrianglesOutline(x, y);
            }
        }
        this.pInst.endShape(this.pInst.CLOSE);
    };
    QuadMap.prototype.displayCalibration = function () {
        this.displayGrid();
    };
    QuadMap.prototype.displayGrid = function (col) {
        if (col === void 0) { col = this.controlPointColor; }
        this.pInst.strokeWeight(2); // 2
        this.pInst.stroke(col); // col
        this.pInst.fill(this.getMutedControlColor(col));
        var isLogo = false;
        if (isLogo) {
            this.pInst.strokeWeight(6);
            this.pInst.stroke("white");
            this.pInst.fill(50);
        }
        this.pInst.beginShape(this.pInst.TRIANGLES);
        for (var x = 0; x < this.resX - 1; x++) {
            for (var y = 0; y < this.resY - 1; y++) {
                this.getQuadTrianglesOutline(x, y);
            }
        }
        this.pInst.endShape(this.pInst.CLOSE);
    };
    QuadMap.prototype.getQuadTriangles = function (x, y, tX, tY, tW, tH) {
        ////////////////////////////////
        var mp = this.mesh[x + y * this.resX];
        this.getVertexUV(mp, tX, tY, tW, tH);
        mp = this.mesh[x + 1 + y * this.resX];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, -1, 0, u, 0);
        mp = this.mesh[x + 1 + (y + 1) * this.resX];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, 1, 0, u, v);
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, 1, 0, u, v);
        mp = this.mesh[x + (y + 1) * this.resX];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(-1, 1, 0, 0, v);
        mp = this.mesh[x + y * this.resX];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(-1, -1, 0, 0, 0);
    };
    QuadMap.prototype.getQuadTrianglesOutline = function (x, y) {
        var mp = this.mesh[x + y * this.resX];
        this.pInst.vertex(mp.x, mp.y);
        mp = this.mesh[x + 1 + y * this.resX];
        this.pInst.vertex(mp.x, mp.y);
        mp = this.mesh[x + 1 + (y + 1) * this.resX];
        this.pInst.vertex(mp.x, mp.y);
        this.pInst.vertex(mp.x, mp.y);
        mp = this.mesh[x + (y + 1) * this.resX];
        this.pInst.vertex(mp.x, mp.y);
        mp = this.mesh[x + y * this.resX];
        this.pInst.vertex(mp.x, mp.y);
    };
    QuadMap.prototype.getVertexUV = function (mp, tX, tY, tW, tH) {
        this.pInst.vertex(mp.x, mp.y, mp.u * this.width * tW - tX, mp.v * this.height * tH - tY);
    };
    return QuadMap;
}(CornerPinSurface_1.default));
exports.default = QuadMap;
