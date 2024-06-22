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
var MeshPoint_1 = __importDefault(require("./MeshPoint"));
var Surface_1 = __importDefault(require("./Surface"));
var CornerPinSurface = /** @class */ (function (_super) {
    __extends(CornerPinSurface, _super);
    /**
     * @param id
     *            Identifier for surface
     * @param w
     *            The surface's width, in pixels
     * @param h
     *            The surface's height, in pixels
     * @param res
     *            The surface's grid resolution
     * @param type
     *            "QUAD" or "TRI" ...
     * @param pInst
     *            p5 sketch instance
     */
    function CornerPinSurface(id, w, h, res, type, buffer, pInst) {
        var _this = _super.call(this, id, w, h, res, type, buffer, pInst) || this;
        _this.perspT = null;
        _this.initMesh();
        _this.calculateMesh();
        return _this;
    }
    CornerPinSurface.prototype.initMesh = function () {
        this.mesh = [];
        for (var y = 0; y < this.res; y++) {
            for (var x = 0; x < this.res; x++) {
                var mx = Math.floor(this.pInst.map(x, 0, this.res, 0, this.width));
                var my = Math.floor(this.pInst.map(y, 0, this.res, 0, this.height));
                var u = this.pInst.map(x, 0, this.res, 0, 1);
                var v = this.pInst.map(y, 0, this.res, 0, 1);
                this.mesh[y * this.res + x] = new MeshPoint_1.default(this, mx, my, u, v, this.pInst);
            }
        }
        this.TL = 0 + 0; // x + y
        this.TR = this.res - 1 + 0;
        this.BL = 0 + (this.res - 1) * (this.res);
        this.BR = this.res - 1 + (this.res - 1) * (this.res);
        // make the corners control points
        this.mesh[this.TL].setControlPoint(true);
        this.mesh[this.TR].setControlPoint(true);
        this.mesh[this.BR].setControlPoint(true);
        this.mesh[this.BL].setControlPoint(true);
        this.controlPoints = [];
        this.controlPoints.push(this.mesh[this.TL]);
        this.controlPoints.push(this.mesh[this.TR]);
        this.controlPoints.push(this.mesh[this.BR]);
        this.controlPoints.push(this.mesh[this.BL]);
    };
    // abstract
    CornerPinSurface.prototype.calculateMesh = function () { };
    CornerPinSurface.prototype.load = function (json) {
        var x = json.x, y = json.y, points = json.points;
        this.x = x;
        this.y = y;
        // this.setMeshPoints(points);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            var mp = this.mesh[point.i];
            mp.x = point.x;
            mp.y = point.y;
            mp.u = point.u;
            mp.v = point.v;
            // I think the control point is already set... ?
            // mp.setControlPoint(true);
        }
        this.calculateMesh();
    };
    CornerPinSurface.prototype.getJson = function () {
        var sJson = {};
        sJson.id = this.id;
        sJson.res = this.res;
        sJson.x = this.x;
        sJson.y = this.y;
        sJson.w = this.w;
        sJson.h = this.h;
        sJson.type = this.type;
        sJson.points = [];
        for (var i = 0; i < this.mesh.length; i++) {
            if (this.mesh[i].isControlPoint) {
                var point = {};
                point.i = i;
                point.x = this.mesh[i].x;
                point.y = this.mesh[i].y;
                point.u = this.mesh[i].u;
                point.v = this.mesh[i].v;
                sJson.points.push(point);
            }
        }
        // saveJSON(sJson, `${this.type}_${this.id}.json`)
        return sJson;
    };
    CornerPinSurface.prototype.getControlPoints = function () {
        return this.controlPoints;
    };
    /*
    returns PVector
    */
    // getPointOnTransformedPlane(x, y) {
    //     const srcCorners = [0, this.w, 0, this.w, this.h, 0, this.h];
    //     const dstCorners = [
    //         this.mesh[this.TL].x, this.mesh[this.TL].y,
    //         this.mesh[this.TR].x, this.mesh[this.TR].y,
    //         this.mesh[this.BR].x, this.mesh[this.BR].y,
    //         this.mesh[this.BL].x, this.mesh[this.BL].y
    //     ]; // dest
    //     this.perspT = PerspT(srcCorners, dstCorners);
    //     let point = this.perspT.transform(x, y);
    //     let mapped = this.pInst.createVector(point[0], point[1]);
    //     return mapped;
    // }
    // ///////////////
    // MANUAL MESHPOINT MOVE FUNCTIONS
    // added by Daniel Wiedemann
    // to move meshpoints via keyboard for example (in OSX the mouse can not go
    // further then the screen bounds, which is obviously a very unpleasant
    // thing if corner points have to be moved across them)
    // ///////////////
    /**
     * Manually move one of the corners for this surface by some amount.
     * The "corner" parameter should be either: CornerPinSurface.TL, CornerPinSurface.BL,
     * CornerPinSurface.TR or CornerPinSurface.BR*
     */
    // moveMeshPointBy(corner, moveX, moveY) {
    //     this.mesh[corner].moveTo(this.mesh[corner].x + moveX, this.mesh[corner].y + moveY);
    // }
    CornerPinSurface.prototype.selectSurface = function () {
        // if the surface itself is selected
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    };
    CornerPinSurface.prototype.selectPoints = function () {
        // check if control points are selected
        var cp = this.isMouseOverControlPoints();
        if (cp) {
            cp.startDrag();
            return cp;
        }
    };
    CornerPinSurface.prototype.isMouseOverControlPoints = function () {
        for (var _i = 0, _a = this.controlPoints; _i < _a.length; _i++) {
            var cp = _a[_i];
            if (cp.isMouseOver()) {
                return cp;
            }
        }
        return false;
    };
    /**
     * Used for mouse selection of surfaces
     * http://www.blackpawn.com/texts/pointinpoly/default.html
     */
    CornerPinSurface.prototype.isPointInTriangle = function (x, y, a, b, c) {
        var v0 = this.pInst.createVector(c.x - a.x, c.y - a.y);
        var v1 = this.pInst.createVector(b.x - a.x, b.y - a.y);
        var v2 = this.pInst.createVector(x - a.x, y - a.y);
        var dot00 = v0.dot(v0);
        var dot01 = v1.dot(v0);
        var dot02 = v2.dot(v0);
        var dot11 = v1.dot(v1);
        var dot12 = v2.dot(v1);
        // Compute barycentric coordinates
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        // Check if point is in triangle
        return (u > 0) && (v > 0) && (u + v < 1);
    };
    CornerPinSurface.prototype.displayControlPoints = function () {
        this.pInst.push();
        this.pInst.translate(this.x, this.y);
        for (var _i = 0, _a = this.controlPoints; _i < _a.length; _i++) {
            var p = _a[_i];
            p.display(this.controlPointColor);
        }
        this.pInst.pop();
    };
    /**
        * This function will give you the position of the mouse in the surface's
        * coordinate system.
        *
        * @return The transformed mouse position
        */
    CornerPinSurface.prototype.getTransformedCursor = function (cx, cy) {
        var point = this.perspT(cx - this.x, cy - this.y);
        return this.pInst.createVector(point[0], point[1]);
    };
    CornerPinSurface.prototype.getTransformedMouse = function () {
        return getTransformedCursor(this.pInst.mouseX, this.pInst.mouseY);
    };
    // 2d cross product
    CornerPinSurface.prototype.cross2 = function (x0, y0, x1, y1) {
        return x0 * y1 - y0 * x1;
    };
    return CornerPinSurface;
}(Surface_1.default));
exports.default = CornerPinSurface;
