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
var Draggable_1 = __importDefault(require("./Draggable"));
var helpers_1 = require("../helpers/helpers");
var Surface = /** @class */ (function (_super) {
    __extends(Surface, _super);
    // since there's a limit on WEBGL context
    function Surface(id, w, h, res, type, buffer, pInst) {
        var _this = _super.call(this, pInst, 0, 0) || this;
        // https://github.com/processing/p5.js/issues/3736
        // let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
        // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);
        // TODO - think about size of surface...
        _this.width = _this.pInst.constrain(w, 0, _this.pInst.width);
        _this.height = _this.pInst.constrain(h, 0, _this.pInst.height);
        _this.id = id;
        _this.res = Math.floor(res);
        _this.type = type;
        _this.controlPointColor = (0, helpers_1.getRandomizedColor)(_this.id, _this.type, _this.pInst);
        _this.buffer = buffer;
        return _this;
    }
    Surface.prototype.getMutedControlColor = function (col) {
        if (col === void 0) { col = this.controlPointColor; }
        return this.pInst.color(this.pInst.red(col), this.pInst.green(col), this.pInst.blue(col), 50);
    };
    Surface.prototype.display = function (col) {
        if (col === void 0) { col = this.pInst.color('black'); }
        this.buffer.background(col);
        this.displayTexture(this.buffer);
    };
    // override with geometry specifics
    Surface.prototype.displaySurface = function (isUV, tX, tY, tW, tH) {
        if (isUV === void 0) { isUV = true; }
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (tW === void 0) { tW = 1; }
        if (tH === void 0) { tH = 1; }
        console.warn("should be overriding with specific geometry...");
    };
    Surface.prototype.displaySketch = function (sketch, tX, tY, texW, texH) {
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (texW === void 0) { texW = 0; }
        if (texH === void 0) { texH = 0; }
        this.buffer.clear();
        this.buffer.push();
        // this.buffer.translate(-this.buffer.width/2, -this.buffer.height/2);
        // draw all textures from top left of surface
        sketch(this.buffer);
        this.buffer.pop();
        this.displayTexture(this.buffer, tX, tY, texW, texH);
    };
    Surface.prototype.displayTexture = function (tex, tX, tY, texW, texH) {
        if (tX === void 0) { tX = 0; }
        if (tY === void 0) { tY = 0; }
        if (texW === void 0) { texW = 0; }
        if (texH === void 0) { texH = 0; }
        if (!tex || tex.width <= 0 || tex.height <= 0)
            return;
        if (texW <= 0)
            texW = tex.width;
        if (texH <= 0)
            texH = tex.height;
        var tW = tex.width / texW;
        var tH = tex.height / texH;
        this.pInst.push();
        this.pInst.noStroke();
        this.pInst.translate(this.x, this.y);
        this.pInst.textureMode(this.pInst.IMAGE);
        this.pInst.texture(tex);
        this.displaySurface(true, tX, tY, tW, tH);
        if (this.pInst.isCalibratingMapper()) {
            this.displayCalibration();
        }
        this.pInst.pop();
    };
    Surface.prototype.displayCalibration = function () {
        this.pInst.push();
        // TODO -
        // why translate??
        // to do with the way lines overlap in z dimension?
        // translate(0, 0, 3); 
        this.displayOutline();
        this.pInst.pop();
    };
    Surface.prototype.displayOutline = function (col) {
        if (col === void 0) { col = this.controlPointColor; }
        this.pInst.strokeWeight(3);
        this.pInst.stroke(col);
        this.pInst.fill(this.getMutedControlColor());
        this.displaySurface(false);
    };
    Surface.prototype.isEqual = function (json) {
        return json.id === this.id && json.type === this.type;
    };
    Surface.prototype.getBounds = function (points) {
        var minX = Math.floor(Math.min.apply(Math, points.map(function (pt) { return pt.x; })));
        var minY = Math.floor(Math.min.apply(Math, points.map(function (pt) { return pt.y; })));
        var maxX = Math.floor(Math.max.apply(Math, points.map(function (pt) { return pt.x; })));
        var maxY = Math.floor(Math.max.apply(Math, points.map(function (pt) { return pt.y; })));
        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    };
    Surface.prototype.setDimensions = function (points) {
        var _a = this.getBounds(points), w = _a.w, h = _a.h;
        this.width = w;
        this.height = h;
    };
    return Surface;
}(Draggable_1.default));
// TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);
exports.default = Surface;
