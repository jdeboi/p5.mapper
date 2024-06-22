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
var Surface_1 = __importDefault(require("./Surface"));
var MovePoint_1 = __importDefault(require("./MovePoint"));
// TODO
// inside method could be reused in bezier
var helpers_1 = require("../helpers/helpers");
var PolyMap = /** @class */ (function (_super) {
    __extends(PolyMap, _super);
    function PolyMap(id, numPoints, buffer, pInst) {
        var _this = _super.call(this, id, 0, 0, 0, "POLY", buffer, pInst) || this;
        _this.points = [];
        for (var i = 0; i < numPoints; i++) {
            var r = 200;
            var x = r + r * Math.cos((i / numPoints) * 2 * _this.pInst.PI);
            var y = r + r * Math.sin((i / numPoints) * 2 * _this.pInst.PI);
            var cp = new MovePoint_1.default(_this, x, y, _this.pInst);
            cp.isControlPoint = true;
            _this.points.push(cp);
        }
        _this.setDimensions(_this.points);
        return _this;
    }
    PolyMap.prototype.setPoints = function (pts) {
        this.points = [];
        for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
            var p = pts_1[_i];
            var cp = new MovePoint_1.default(this, p.x, p.y, this.pInst);
            cp.isControlPoint = true;
            this.points.push(cp);
        }
    };
    PolyMap.prototype.displaySurface = function (isUV, tX, tY, tW, tH) {
        if (isUV === void 0) { isUV = true; }
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (tW === void 0) { tW = this.width; }
        if (tH === void 0) { tH = this.height; }
        var _a = this.getBounds(this.points), x = _a.x, y = _a.y;
        this.pInst.beginShape();
        for (var _i = 0, _b = this.points; _i < _b.length; _i++) {
            var point = _b[_i];
            if (isUV) {
                var dx = point.x - x;
                var dy = point.y - y;
                this.pInst.vertex(point.x, point.y, dx * tW - tX, dy * tH - tY);
            }
            else
                this.pInst.vertex(point.x, point.y);
        }
        this.pInst.endShape(this.pInst.CLOSE);
    };
    PolyMap.prototype.displayControlPoints = function () {
        this.pInst.push();
        this.pInst.translate(this.x, this.y, 2);
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            p.display(this.controlPointColor);
        }
        this.pInst.pop();
    };
    PolyMap.prototype.isMouseOver = function () {
        var p = { x: this.pInst.mouseX, y: this.pInst.mouseY };
        // developed with p5.js 1.4 when WEBGL mode had a different coordinate system
        // (center was origin in WEBGL mode?)
        if (true) {
            p.x -= this.pInst.width / 2;
            p.y -= this.pInst.height / 2;
        }
        var ins = (0, helpers_1.inside)(p, this.points, { x: this.x, y: this.y });
        return ins;
    };
    PolyMap.prototype.load = function (json) {
        var x = json.x, y = json.y, points = json.points;
        this.x = x;
        this.y = y;
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            var mp = this.points[point.i];
            mp.x = point.x;
            mp.y = point.y;
        }
    };
    PolyMap.prototype.getJson = function () {
        var sJson = {};
        sJson.id = this.id;
        sJson.x = this.x;
        sJson.y = this.y;
        sJson.type = this.type;
        sJson.points = [];
        for (var i = 0; i < this.points.length; i++) {
            var point = {};
            point.i = i;
            point.x = this.points[i].x;
            point.y = this.points[i].y;
            sJson.points.push(point);
        }
        return sJson;
    };
    PolyMap.prototype.selectSurface = function () {
        // then, see if the poly itself is selected
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    };
    PolyMap.prototype.selectPoints = function () {
        // check control points
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            if (p.isMouseOver()) {
                p.startDrag();
                return p;
            }
        }
        return null;
    };
    return PolyMap;
}(Surface_1.default));
exports.default = PolyMap;
