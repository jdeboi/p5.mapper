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
var MovePoint_1 = __importDefault(require("./MovePoint"));
var MeshPoint = /** @class */ (function (_super) {
    __extends(MeshPoint, _super);
    function MeshPoint(parent, x, y, u, v, pInst) {
        var _this = _super.call(this, parent, x, y, pInst) || this;
        _this.u = u;
        _this.v = v;
        return _this;
    }
    MeshPoint.prototype.set = function (point) {
        _super.prototype.set.call(this, point);
        this.u = point.u;
        this.v = point.v;
    };
    MeshPoint.prototype.moveTo = function () {
        _super.prototype.moveTo.call(this);
        this.parent.calculateMesh();
    };
    /**
     * This creates a new MeshPoint with (u,v) = (0,0) and does
     * not modify the current MeshPoint. Its used to generate
     * temporary points for the interpolation.
     */
    MeshPoint.prototype.interpolateTo = function (p, f) {
        var nX = this.x + (p.x - this.x) * f;
        var nY = this.y + (p.y - this.y) * f;
        return new MeshPoint(this.parent, nX, nY, 0, 0, this.pInst);
    };
    return MeshPoint;
}(MovePoint_1.default));
exports.default = MeshPoint;
