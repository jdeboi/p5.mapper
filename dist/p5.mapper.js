(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["p5.mapper"] = factory();
	else
		root["p5.mapper"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_ProjectionMapper)
});

;// ./src/perspective/numeric.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var numeric = {};
numeric.dim = function dim(x) {
  var y, z;
  if (_typeof(x) === "object") {
    y = x[0];
    if (_typeof(y) === "object") {
      z = y[0];
      if (_typeof(z) === "object") {
        return numeric._dim(x);
      }
      return [x.length, y.length];
    }
    return [x.length];
  }
  return [];
};
numeric._foreach2 = function _foreach2(x, s, k, f) {
  if (k === s.length - 1) {
    return f(x);
  }
  var i,
    n = s[k],
    ret = Array(n);
  for (i = n - 1; i >= 0; i--) {
    ret[i] = _foreach2(x[i], s, k + 1, f);
  }
  return ret;
};
numeric.cloneV = function (x) {
  var _n = x.length;
  var i,
    ret = Array(_n);
  for (i = _n - 1; i !== -1; --i) {
    ret[i] = x[i];
  }
  return ret;
};
numeric.clone = function (x) {
  if (_typeof(x) !== "object") return x;
  var V = numeric.cloneV;
  var s = numeric.dim(x);
  return numeric._foreach2(x, s, 0, V);
};
numeric.diag = function diag(d) {
  var i,
    i1,
    j,
    n = d.length,
    A = Array(n),
    Ai;
  for (i = n - 1; i >= 0; i--) {
    Ai = Array(n);
    i1 = i + 2;
    for (j = n - 1; j >= i1; j -= 2) {
      Ai[j] = 0;
      Ai[j - 1] = 0;
    }
    if (j > i) {
      Ai[j] = 0;
    }
    Ai[i] = d[i];
    for (j = i - 1; j >= 1; j -= 2) {
      Ai[j] = 0;
      Ai[j - 1] = 0;
    }
    if (j === 0) {
      Ai[0] = 0;
    }
    A[i] = Ai;
  }
  return A;
};
numeric.rep = function rep(s, v, k) {
  if (typeof k === "undefined") {
    k = 0;
  }
  var n = s[k],
    ret = Array(n),
    i;
  if (k === s.length - 1) {
    for (i = n - 2; i >= 0; i -= 2) {
      ret[i + 1] = v;
      ret[i] = v;
    }
    if (i === -1) {
      ret[0] = v;
    }
    return ret;
  }
  for (i = n - 1; i >= 0; i--) {
    ret[i] = numeric.rep(s, v, k + 1);
  }
  return ret;
};
numeric.identity = function (n) {
  return numeric.diag(numeric.rep([n], 1));
};
numeric.inv = function inv(a) {
  var s = numeric.dim(a),
    abs = Math.abs,
    m = s[0],
    n = s[1];
  var A = numeric.clone(a),
    Ai,
    Aj;
  var I = numeric.identity(m),
    Ii,
    Ij;
  var i, j, k, x;
  for (j = 0; j < n; ++j) {
    var i0 = -1;
    var v0 = -1;
    for (i = j; i !== m; ++i) {
      k = abs(A[i][j]);
      if (k > v0) {
        i0 = i;
        v0 = k;
      }
    }
    Aj = A[i0];
    A[i0] = A[j];
    A[j] = Aj;
    Ij = I[i0];
    I[i0] = I[j];
    I[j] = Ij;
    x = Aj[j];
    for (k = j; k !== n; ++k) Aj[k] /= x;
    for (k = n - 1; k !== -1; --k) Ij[k] /= x;
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i];
        Ii = I[i];
        x = Ai[j];
        for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x;
        for (k = n - 1; k > 0; --k) {
          Ii[k] -= Ij[k] * x;
          --k;
          Ii[k] -= Ij[k] * x;
        }
        if (k === 0) Ii[0] -= Ij[0] * x;
      }
    }
  }
  return I;
};
numeric.dotMMsmall = function dotMMsmall(x, y) {
  var i, j, k, p, q, r, ret, foo, bar, woo, i0;
  p = x.length;
  q = y.length;
  r = y[0].length;
  ret = Array(p);
  for (i = p - 1; i >= 0; i--) {
    foo = Array(r);
    bar = x[i];
    for (k = r - 1; k >= 0; k--) {
      woo = bar[q - 1] * y[q - 1][k];
      for (j = q - 2; j >= 1; j -= 2) {
        i0 = j - 1;
        woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
      }
      if (j === 0) {
        woo += bar[0] * y[0][k];
      }
      foo[k] = woo;
    }
    ret[i] = foo;
  }
  return ret;
};
numeric.dotMV = function dotMV(x, y) {
  var p = x.length,
    i;
  var ret = Array(p),
    dotVV = numeric.dotVV;
  for (i = p - 1; i >= 0; i--) {
    ret[i] = dotVV(x[i], y);
  }
  return ret;
};
numeric.dotVV = function dotVV(x, y) {
  var i,
    n = x.length,
    i1,
    ret = x[n - 1] * y[n - 1];
  for (i = n - 2; i >= 1; i -= 2) {
    i1 = i - 1;
    ret += x[i] * y[i] + x[i1] * y[i1];
  }
  if (i === 0) {
    ret += x[0] * y[0];
  }
  return ret;
};
numeric.transpose = function transpose(x) {
  var i,
    j,
    m = x.length,
    n = x[0].length,
    ret = Array(n),
    A0,
    A1,
    Bj;
  for (j = 0; j < n; j++) ret[j] = Array(m);
  for (i = m - 1; i >= 1; i -= 2) {
    A1 = x[i];
    A0 = x[i - 1];
    for (j = n - 1; j >= 1; --j) {
      Bj = ret[j];
      Bj[i] = A1[j];
      Bj[i - 1] = A0[j];
      --j;
      Bj = ret[j];
      Bj[i] = A1[j];
      Bj[i - 1] = A0[j];
    }
    if (j === 0) {
      Bj = ret[0];
      Bj[i] = A1[0];
      Bj[i - 1] = A0[0];
    }
  }
  if (i === 0) {
    A0 = x[0];
    for (j = n - 1; j >= 1; --j) {
      ret[j][0] = A0[j];
      --j;
      ret[j][0] = A0[j];
    }
    if (j === 0) {
      ret[0][0] = A0[0];
    }
  }
  return ret;
};
/* harmony default export */ const perspective_numeric = (numeric);
;// ./src/perspective/PerspT.js

function round(num) {
  return Math.round(num * 10000000000) / 10000000000;
}
function getNormalizationCoefficients(srcPts, dstPts, isInverse) {
  if (isInverse) {
    var tmp = dstPts;
    dstPts = srcPts;
    srcPts = tmp;
  }
  var r1 = [srcPts[0], srcPts[1], 1, 0, 0, 0, -1 * dstPts[0] * srcPts[0], -1 * dstPts[0] * srcPts[1]];
  var r2 = [0, 0, 0, srcPts[0], srcPts[1], 1, -1 * dstPts[1] * srcPts[0], -1 * dstPts[1] * srcPts[1]];
  var r3 = [srcPts[2], srcPts[3], 1, 0, 0, 0, -1 * dstPts[2] * srcPts[2], -1 * dstPts[2] * srcPts[3]];
  var r4 = [0, 0, 0, srcPts[2], srcPts[3], 1, -1 * dstPts[3] * srcPts[2], -1 * dstPts[3] * srcPts[3]];
  var r5 = [srcPts[4], srcPts[5], 1, 0, 0, 0, -1 * dstPts[4] * srcPts[4], -1 * dstPts[4] * srcPts[5]];
  var r6 = [0, 0, 0, srcPts[4], srcPts[5], 1, -1 * dstPts[5] * srcPts[4], -1 * dstPts[5] * srcPts[5]];
  var r7 = [srcPts[6], srcPts[7], 1, 0, 0, 0, -1 * dstPts[6] * srcPts[6], -1 * dstPts[6] * srcPts[7]];
  var r8 = [0, 0, 0, srcPts[6], srcPts[7], 1, -1 * dstPts[7] * srcPts[6], -1 * dstPts[7] * srcPts[7]];
  var matA = [r1, r2, r3, r4, r5, r6, r7, r8];
  var matB = dstPts;
  var matC;
  try {
    matC = perspective_numeric.inv(perspective_numeric.dotMMsmall(perspective_numeric.transpose(matA), matA));
  } catch (e) {
    console.log(e);
    return [1, 0, 0, 0, 1, 0, 0, 0];
  }
  var matD = perspective_numeric.dotMMsmall(matC, perspective_numeric.transpose(matA));
  var matX = perspective_numeric.dotMV(matD, matB);
  for (var i = 0; i < matX.length; i++) {
    matX[i] = round(matX[i]);
  }
  matX[8] = 1;
  return matX;
}
function PerspT(srcPts, dstPts) {
  if (typeof window !== "undefined" && window === this || this === undefined) {
    return new PerspT(srcPts, dstPts);
  }
  this.srcPts = srcPts;
  this.dstPts = dstPts;
  this.coeffs = getNormalizationCoefficients(this.srcPts, this.dstPts, false);
  this.coeffsInv = getNormalizationCoefficients(this.srcPts, this.dstPts, true);
  return this;
}
PerspT.prototype = {
  transform: function transform(x, y) {
    var coordinates = [];
    coordinates[0] = (this.coeffs[0] * x + this.coeffs[1] * y + this.coeffs[2]) / (this.coeffs[6] * x + this.coeffs[7] * y + 1);
    coordinates[1] = (this.coeffs[3] * x + this.coeffs[4] * y + this.coeffs[5]) / (this.coeffs[6] * x + this.coeffs[7] * y + 1);
    return coordinates;
  },
  transformInverse: function transformInverse(x, y) {
    var coordinates = [];
    coordinates[0] = (this.coeffsInv[0] * x + this.coeffsInv[1] * y + this.coeffsInv[2]) / (this.coeffsInv[6] * x + this.coeffsInv[7] * y + 1);
    coordinates[1] = (this.coeffsInv[3] * x + this.coeffsInv[4] * y + this.coeffsInv[5]) / (this.coeffsInv[6] * x + this.coeffsInv[7] * y + 1);
    return coordinates;
  }
};
/* harmony default export */ const perspective_PerspT = (PerspT);
;// ./src/surfaces/Draggable.ts
function Draggable_typeof(o) { "@babel/helpers - typeof"; return Draggable_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Draggable_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == Draggable_typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != Draggable_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Draggable_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Draggable.ts
var Draggable = /*#__PURE__*/function () {
  // lock movement to an axis

  // Optional hooks

  function Draggable(pInst) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    _classCallCheck(this, Draggable);
    _defineProperty(this, "x", 0);
    _defineProperty(this, "y", 0);
    _defineProperty(this, "clickX", 0);
    _defineProperty(this, "clickY", 0);
    _defineProperty(this, "xStartDrag", 0);
    _defineProperty(this, "yStartDrag", 0);
    _defineProperty(this, "_dragging", false);
    _defineProperty(this, "_enabled", true);
    _defineProperty(this, "_bounds", null);
    // constrain position if set
    _defineProperty(this, "_grid", null);
    // snap step [gx, gy]
    _defineProperty(this, "_axis", "none");
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.xStartDrag = x;
    this.yStartDrag = y;
  }

  /** Enable/disable dragging */
  return _createClass(Draggable, [{
    key: "setEnabled",
    value: function setEnabled(enabled) {
      this._enabled = !!enabled;
      if (!this._enabled && this._dragging) this.endDrag();
      return this;
    }
  }, {
    key: "enabled",
    get: function get() {
      return this._enabled;
    }

    /** Optional axis lock */
  }, {
    key: "setLockAxis",
    value: function setLockAxis(axis) {
      this._axis = axis;
      return this;
    }

    /** Constrain moves to a rectangle */
  }, {
    key: "setBounds",
    value: function setBounds(bounds) {
      this._bounds = bounds;
      // Clamp immediately if we already sit outside
      this.applyBounds();
      return this;
    }

    /** Snap moves to a grid step, e.g., [10,10]; set null to disable */
  }, {
    key: "setGrid",
    value: function setGrid(step) {
      if (step == null) this._grid = null;else this._grid = Array.isArray(step) ? [Math.max(1, step[0]), Math.max(1, step[1])] : [Math.max(1, step), Math.max(1, step)];
      return this;
    }

    /** Begin dragging from the given pointer (defaults to p5 mouse) */
  }, {
    key: "startDrag",
    value: function startDrag() {
      var _this$onDragStart;
      var mx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pInst.mouseX;
      var my = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.pInst.mouseY;
      if (!this._enabled) return;
      this._dragging = true;
      this.xStartDrag = this.x;
      this.yStartDrag = this.y;
      this.clickX = mx;
      this.clickY = my;
      (_this$onDragStart = this.onDragStart) === null || _this$onDragStart === void 0 || _this$onDragStart.call(this, {
        x: this.x,
        y: this.y
      });
    }

    /**
     * Legacy behavior: if called with no args, follow current mouse delta.
     * Modern behavior: if x,y provided, move absolutely to (x,y).
     */
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      var _this$onDragMove2;
      if (typeof x === "number" && typeof y === "number") {
        var _this$onDragMove;
        // absolute move
        var _pos = this.applyConstraints(x, y);
        this.x = _pos.x;
        this.y = _pos.y;
        if (this._dragging) (_this$onDragMove = this.onDragMove) === null || _this$onDragMove === void 0 || _this$onDragMove.call(this, {
          x: this.x,
          y: this.y
        });
        return;
      }

      // legacy: follow pointer delta since startDrag
      var mx = this.pInst.mouseX;
      var my = this.pInst.mouseY;
      var nx = this.xStartDrag + (mx - this.clickX);
      var ny = this.yStartDrag + (my - this.clickY);
      var pos = this.applyConstraints(nx, ny);
      this.x = pos.x;
      this.y = pos.y;
      if (this._dragging) (_this$onDragMove2 = this.onDragMove) === null || _this$onDragMove2 === void 0 || _this$onDragMove2.call(this, {
        x: this.x,
        y: this.y
      });
    }

    /** Relative move */
  }, {
    key: "translate",
    value: function translate(dx, dy) {
      this.moveTo(this.x + dx, this.y + dy);
    }
  }, {
    key: "getIsDragging",
    value: function getIsDragging() {
      return this._dragging;
    }
  }, {
    key: "getIsEnabled",
    value: function getIsEnabled() {
      return this._enabled;
    }

    /** Update dragging with current pointer */
  }, {
    key: "updateDrag",
    value: function updateDrag(mx, my) {
      var _this$onDragMove3;
      if (!this._dragging) return;
      var nx = this.xStartDrag + (mx - this.clickX);
      var ny = this.yStartDrag + (my - this.clickY);
      var pos = this.applyConstraints(nx, ny);
      this.x = pos.x;
      this.y = pos.y;
      (_this$onDragMove3 = this.onDragMove) === null || _this$onDragMove3 === void 0 || _this$onDragMove3.call(this, {
        x: this.x,
        y: this.y
      });
    }

    /** Finish dragging */
  }, {
    key: "endDrag",
    value: function endDrag() {
      var _this$onDragEnd;
      if (!this._dragging) return;
      this._dragging = false;
      (_this$onDragEnd = this.onDragEnd) === null || _this$onDragEnd === void 0 || _this$onDragEnd.call(this, {
        x: this.x,
        y: this.y
      });
    }
  }, {
    key: "selectDraggable",
    value: function selectDraggable() {
      // if the surface itself is selected
      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }
      return null;
    }

    //   /** Override in subclasses to provide selection */
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      throw new Error("selectPoints() must be implemented by subclass");
    }
  }, {
    key: "isDragging",
    get: function get() {
      return this._dragging;
    }

    /** Directly set position without dragging lifecycle */
  }, {
    key: "set",
    value: function set(pos) {
      var nx = typeof pos.x === "number" ? pos.x : this.x;
      var ny = typeof pos.y === "number" ? pos.y : this.y;
      var p = this.applyConstraints(nx, ny);
      this.x = p.x;
      this.y = p.y;
      return this;
    }
  }, {
    key: "getMouseCoords",
    value: function getMouseCoords() {
      var mx = this.pInst.mouseX - this.pInst.width / 2;
      var my = this.pInst.mouseY - this.pInst.height / 2;
      return {
        x: mx,
        y: my
      };
    }

    /** Override in subclasses to provide hit testing for selection */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      // Base has no shape; subclasses (e.g., handle, rectangle) should override.
      console.error("isMouseOver() must be implemented by subclass");
      return false;
    }

    /** Apply axis lock, bounds, and grid snapping */
  }, {
    key: "applyConstraints",
    value: function applyConstraints(nx, ny) {
      // axis lock
      if (this._axis === "x") ny = this.y;else if (this._axis === "y") nx = this.x;

      // bounds
      if (this._bounds) {
        var _this$_bounds = this._bounds,
          x = _this$_bounds.x,
          y = _this$_bounds.y,
          w = _this$_bounds.w,
          h = _this$_bounds.h;
        nx = clamp(nx, x, x + w);
        ny = clamp(ny, y, y + h);
      }

      // grid
      if (this._grid) {
        var _this$_grid = _slicedToArray(this._grid, 2),
          gx = _this$_grid[0],
          gy = _this$_grid[1];
        nx = Math.round(nx / gx) * gx;
        ny = Math.round(ny / gy) * gy;
      }
      return {
        x: nx,
        y: ny
      };
    }

    /** Clamp current x/y to bounds (if any) */
  }, {
    key: "applyBounds",
    value: function applyBounds() {
      if (!this._bounds) return;
      var p = this.applyConstraints(this.x, this.y);
      this.x = p.x;
      this.y = p.y;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        dragging: this.getIsDragging(),
        enabled: this.getIsEnabled()
      };
    }

    //   override load
  }, {
    key: "load",
    value: function load(data) {
      throw new Error("load() must be implemented by subclass");
    }

    //   override isEqual
  }, {
    key: "isEqual",
    value: function isEqual(json) {
      throw new Error("isEqual() must be implemented by subclass");
      // removed by dead control flow

    }
  }]);
}();

function clamp(n, a, b) {
  return n < a ? a : n > b ? b : n;
}
;// ./src/surfaces/MovePoint.ts
function MovePoint_typeof(o) { "@babel/helpers - typeof"; return MovePoint_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, MovePoint_typeof(o); }
function MovePoint_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function MovePoint_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, MovePoint_toPropertyKey(o.key), o); } }
function MovePoint_createClass(e, r, t) { return r && MovePoint_defineProperties(e.prototype, r), t && MovePoint_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == MovePoint_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function MovePoint_defineProperty(e, r, t) { return (r = MovePoint_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function MovePoint_toPropertyKey(t) { var i = MovePoint_toPrimitive(t, "string"); return "symbol" == MovePoint_typeof(i) ? i : i + ""; }
function MovePoint_toPrimitive(t, r) { if ("object" != MovePoint_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != MovePoint_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// MovePoint.ts

var MovePoint = /*#__PURE__*/function (_Draggable) {
  function MovePoint(parent, x, y, pInst) {
    var _opts$radius, _opts$hitScale, _opts$color;
    var _this;
    var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    MovePoint_classCallCheck(this, MovePoint);
    _this = _callSuper(this, MovePoint, [pInst, x, y]);
    MovePoint_defineProperty(_this, "type", "CPOINT");
    MovePoint_defineProperty(_this, "isControlPoint", false);
    _this.parent = parent;
    _this.r = (_opts$radius = opts.radius) !== null && _opts$radius !== void 0 ? _opts$radius : 8;
    _this.hitScale = Math.max(1, (_opts$hitScale = opts.hitScale) !== null && _opts$hitScale !== void 0 ? _opts$hitScale : 1);
    _this.col = (_opts$color = opts.color) !== null && _opts$color !== void 0 ? _opts$color : pInst.color(0, 255, 255);
    return _this;
  }

  /** Set x/y from another point-like object */
  _inherits(MovePoint, _Draggable);
  return MovePoint_createClass(MovePoint, [{
    key: "set",
    value: function set(point) {
      if (typeof point.x === "number") this.x = point.x;
      if (typeof point.y === "number") this.y = point.y;
      return this;
    }

    /** Back-compat: move this point to current mouse (in parent's local space) */
  }, {
    key: "moveToMouse",
    value: function moveToMouse() {
      var _this$getLocalMouse = this.getLocalMouse(),
        mxLocal = _this$getLocalMouse.mxLocal,
        myLocal = _this$getLocalMouse.myLocal;
      this.moveTo(mxLocal, myLocal);
      return this;
    }

    /** Mark/unmark as a control point */
  }, {
    key: "setControlPoint",
    value: function setControlPoint(cp) {
      this.isControlPoint = !!cp;
      return this;
    }
  }, {
    key: "setRadius",
    value: function setRadius(r) {
      this.r = Math.max(1, r);
      return this;
    }
  }, {
    key: "setColor",
    value: function setColor(c) {
      this.col = c;
      return this;
    }
  }, {
    key: "setHitScale",
    value: function setHitScale(scale) {
      this.hitScale = Math.max(1, scale);
      return this;
    }

    /** Fast hit test in parent's local coordinates */
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var mx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pInst.mouseX;
      var my = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.pInst.mouseY;
      var _this$toLocal = this.toLocal(mx, my),
        mxLocal = _this$toLocal.mxLocal,
        myLocal = _this$toLocal.myLocal;
      var dx = mxLocal - this.x;
      var dy = myLocal - this.y;
      var rr = Math.pow(this.r * this.hitScale, 2);
      return dx * dx + dy * dy <= rr;
    }

    /** Interpolate (in-place) between two points by factor f in [0,1] */
  }, {
    key: "interpolateBetween",
    value: function interpolateBetween(start, end, f) {
      this.x = start.x + (end.x - start.x) * f;
      this.y = start.y + (end.y - start.y) * f;
      return this;
    }

    /** Draw the handle; assume caller already translated by parent.x/parent.y */
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.col;
      var p = this.pInst;
      if (typeof p.isMovingPoints === "function" && !p.isMovingPoints()) return;
      var c = col;
      if (this.isMouseOver()) c = p.color(255);
      p.push();
      // Slight z offset helps in WEBGL to avoid z-fighting if you need it:
      // p.translate(0, 0, 5);
      p.stroke(c);
      p.strokeWeight(2);
      p.noFill();
      p.ellipse(this.x, this.y, this.r * 2);
      p.fill(c);
      p.noStroke();
      p.ellipse(this.x, this.y, this.r);
      p.pop();
    }

    /** JSON snapshot */
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        dragging: this.getIsDragging(),
        enabled: this.getIsEnabled(),
        isControlPoint: this.isControlPoint,
        r: this.r
      };
    }

    // --- helpers -------------------------------------------------------------

    /** Convert a canvas-space point to this point's parent-local space */
  }, {
    key: "toLocal",
    value: function toLocal(mx, my) {
      var _renderer, _this$parent$x, _this$parent, _this$parent$y, _this$parent2;
      var p = this.pInst;
      var isWEBGL = !!(p !== null && p !== void 0 && (_renderer = p._renderer) !== null && _renderer !== void 0 && _renderer.isP3D); // p5 WEBGL flag
      var px = (_this$parent$x = (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.x) !== null && _this$parent$x !== void 0 ? _this$parent$x : 0;
      var py = (_this$parent$y = (_this$parent2 = this.parent) === null || _this$parent2 === void 0 ? void 0 : _this$parent2.y) !== null && _this$parent$y !== void 0 ? _this$parent$y : 0;

      // For WEBGL renderer p5 positions mouse in canvas coords with origin top-left,
      // but your scene coordinates are typically centered; when drawing handles you
      // usually translate(parent.x, parent.y). To test hits in local space, offset by parent:
      var mxLocal = (isWEBGL ? mx - p.width / 2 : mx) - px;
      var myLocal = (isWEBGL ? my - p.height / 2 : my) - py;
      return {
        mxLocal: mxLocal,
        myLocal: myLocal
      };
    }
  }, {
    key: "getLocalMouse",
    value: function getLocalMouse() {
      return this.toLocal(this.pInst.mouseX, this.pInst.mouseY);
    }
  }]);
}(Draggable);

;// ./src/surfaces/MeshPoint.ts
function MeshPoint_typeof(o) { "@babel/helpers - typeof"; return MeshPoint_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, MeshPoint_typeof(o); }
function MeshPoint_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function MeshPoint_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, MeshPoint_toPropertyKey(o.key), o); } }
function MeshPoint_createClass(e, r, t) { return r && MeshPoint_defineProperties(e.prototype, r), t && MeshPoint_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function MeshPoint_toPropertyKey(t) { var i = MeshPoint_toPrimitive(t, "string"); return "symbol" == MeshPoint_typeof(i) ? i : i + ""; }
function MeshPoint_toPrimitive(t, r) { if ("object" != MeshPoint_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != MeshPoint_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function MeshPoint_callSuper(t, o, e) { return o = MeshPoint_getPrototypeOf(o), MeshPoint_possibleConstructorReturn(t, MeshPoint_isNativeReflectConstruct() ? Reflect.construct(o, e || [], MeshPoint_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function MeshPoint_possibleConstructorReturn(t, e) { if (e && ("object" == MeshPoint_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return MeshPoint_assertThisInitialized(t); }
function MeshPoint_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function MeshPoint_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (MeshPoint_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(MeshPoint_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = MeshPoint_getPrototypeOf(t));); return t; }
function MeshPoint_getPrototypeOf(t) { return MeshPoint_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, MeshPoint_getPrototypeOf(t); }
function MeshPoint_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && MeshPoint_setPrototypeOf(t, e); }
function MeshPoint_setPrototypeOf(t, e) { return MeshPoint_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, MeshPoint_setPrototypeOf(t, e); }
// MeshPoint.ts


function clamp01(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
var MeshPoint = /*#__PURE__*/function (_MovePoint) {
  function MeshPoint(parent, x, y, u, v, pInst) {
    var _this;
    MeshPoint_classCallCheck(this, MeshPoint);
    _this = MeshPoint_callSuper(this, MeshPoint, [parent, x, y, pInst]);
    _this.u = u;
    _this.v = v;
    return _this;
  }
  MeshPoint_inherits(MeshPoint, _MovePoint);
  return MeshPoint_createClass(MeshPoint, [{
    key: "set",
    value: function set(point) {
      _superPropGet(MeshPoint, "set", this, 3)([point]);
      this.u = point.u || 0;
      this.v = point.v || 0;
      return this;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      _superPropGet(MeshPoint, "moveTo", this, 3)([]);
      this.parent.calculateMesh();
    }

    /**
     * This creates a new MeshPoint with (u,v) = (0,0) and does
     * not modify the current MeshPoint. Its used to generate
     * temporary points for the interpolation.
     */
  }, {
    key: "interpolateTo",
    value: function interpolateTo(p, f) {
      var nX = this.x + (p.x - this.x) * f;
      var nY = this.y + (p.y - this.y) * f;
      return new MeshPoint(this.parent, nX, nY, 0, 0, this.pInst);
    }

    //   /** Copy x,y (+u,v if present) from another point-like object. */
    //   set(point: PointLike): this {
    //     super.set(point);
    //     if (typeof point.u === "number") this.u = point.u;
    //     if (typeof point.v === "number") this.v = point.v;
    //     return this;
    //   }

    //   moveTo(): void {
    //     super.moveTo();
    //     // if (notifyParent) this.#notifyParent();
    //     this.parent.calculateMesh();
    //   }

    //   translate(dx: number, dy: number, notifyParent = true): this {
    //     super.moveTo(this.x + dx, this.y + dy);
    //     // if (notifyParent) this.#notifyParent();
    //     this.parent.calculateMesh();
    //     return this;
    //   }

    //   /** Set UV; optionally clamp to [0,1]. */
    //   setUV(u: number, v: number, clamp = true): this {
    //     this.u = clamp ? clamp01(u) : u;
    //     this.v = clamp ? clamp01(v) : v;
    //     return this;
    //   }

    //   /**
    //    * Interpolate towards another point.
    //    * @param p target point (x,y used; u,v optional)
    //    * @param t mix factor in [0,1]
    //    * @param carryUV if true, also interpolates UVs when available
    //    */
    //   interpolateTo(p: PointLike, t: number, carryUV = false): MeshPoint {
    //     const nx = this.x + (p.x - this.x) * t;
    //     const ny = this.y + (p.y - this.y) * t;

    //     const hasUV = typeof p.u === "number" && typeof p.v === "number";
    //     const nu =
    //       carryUV && hasUV
    //         ? (this.u as number) + ((p.u as number) - (this.u as number)) * t
    //         : 0;
    //     const nv =
    //       carryUV && hasUV
    //         ? (this.v as number) + ((p.v as number) - (this.v as number)) * t
    //         : 0;

    //     return new MeshPoint(this.parent, nx, ny, nu, nv, this.pInst);
    //   }

    //   /** A few handy utilities */
    //   clone(): MeshPoint {
    //     return new MeshPoint(
    //       this.parent,
    //       this.x,
    //       this.y,
    //       this.u,
    //       this.v,
    //       this.pInst
    //     );
    //   }

    //   equals(p: PointLike, eps = 1e-6): boolean {
    //     return (
    //       Math.abs(this.x - p.x) <= eps &&
    //       Math.abs(this.y - p.y) <= eps &&
    //       (typeof p.u !== "number" || Math.abs(this.u - p.u) <= eps) &&
    //       (typeof p.v !== "number" || Math.abs(this.v - p.v) <= eps)
    //     );
    //   }

    //   distanceTo(p: XYLike): number {
    //     const dx = this.x - p.x;
    //     const dy = this.y - p.y;
    //     return Math.hypot(dx, dy);
    //   }

    //   toJSON(): DraggableJSON & { isControlPoint: boolean; r: number } {
    //     return {
    //       x: this.x,
    //       y: this.y,
    //       dragging: this.getIsDragging(),
    //       enabled: this.getIsEnabled(),
    //       isControlPoint: this.isControlPoint,
    //       r: this.r,
    //     };
    //   }
  }]);
}(MovePoint);

;// ./src/helpers/helpers.ts
// helpers.ts

/** Basic 2D point */

/**
 * Ray-casting point-in-polygon test.
 * `offset` shifts the polygon (useful when polygon points are local to a parent).
 */
function inside(point, polygon) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    x: 0,
    y: 0
  };
  var x = point.x,
    y = point.y;
  var isInside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i].x + offset.x;
    var yi = polygon[i].y + offset.y;
    var xj = polygon[j].x + offset.x;
    var yj = polygon[j].y + offset.y;

    // edges that straddle the horizontal ray at y
    var straddles = yi > y !== yj > y;
    if (straddles) {
      // x coordinate where the edge crosses the ray
      var xCross = (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (x < xCross) isInside = !isInside;
    }
  }
  return isInside;
}

/**
 * Deterministic-ish color based on id/type.
 * Returns whatever your p5.color(...) returns (usually a p5.Color).
 */
function getRandomizedColor(id, type, p5) {
  var shapeOffset = type ? type.charCodeAt(0) : 2;
  var offset = (1 + id) * 88 + shapeOffset * 80;

  // flip to HSB, pick a hue, then restore RGB
  p5.colorMode(p5.HSB, 255);
  var col = p5.color(offset % 255, 255, 255);
  p5.colorMode(p5.RGB, 255);
  return col;
}

/** Linear 0..1 progress loop over `seconds` (clamped to 0.1..100). */
function getPercent(p5) {
  var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var s = p5.constrain(seconds, 0.1, 100);
  return p5.frameCount / (60 * s) % 1;
}

/** Sinusoidal 0..1 wave over `seconds`, with optional phase `offset` (radians). */
function getPercentWave(p5) {
  var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var s = p5.constrain(seconds, 0.01, 100);
  return 0.5 + 0.5 * p5.sin(p5.frameCount / (60 * s) * 2 * p5.PI + offset);
}
;// ./src/surfaces/Surface.ts
function Surface_typeof(o) { "@babel/helpers - typeof"; return Surface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Surface_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = Surface_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function Surface_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return Surface_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Surface_arrayLikeToArray(r, a) : void 0; } }
function Surface_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function Surface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Surface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Surface_toPropertyKey(o.key), o); } }
function Surface_createClass(e, r, t) { return r && Surface_defineProperties(e.prototype, r), t && Surface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Surface_callSuper(t, o, e) { return o = Surface_getPrototypeOf(o), Surface_possibleConstructorReturn(t, Surface_isNativeReflectConstruct() ? Reflect.construct(o, e || [], Surface_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function Surface_possibleConstructorReturn(t, e) { if (e && ("object" == Surface_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return Surface_assertThisInitialized(t); }
function Surface_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function Surface_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Surface_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function Surface_getPrototypeOf(t) { return Surface_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, Surface_getPrototypeOf(t); }
function Surface_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && Surface_setPrototypeOf(t, e); }
function Surface_setPrototypeOf(t, e) { return Surface_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, Surface_setPrototypeOf(t, e); }
function Surface_defineProperty(e, r, t) { return (r = Surface_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Surface_toPropertyKey(t) { var i = Surface_toPrimitive(t, "string"); return "symbol" == Surface_typeof(i) ? i : i + ""; }
function Surface_toPrimitive(t, r) { if ("object" != Surface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Surface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Surface.ts


/**
 * Base surface: owns dimensions, a p5 buffer, and rendering hooks.
 * Subclasses should override `displaySurface`.
 */
var Surface = /*#__PURE__*/function (_Draggable) {
  /**
   * @param id        Identifier for the surface
   * @param w         width in px
   * @param h         height in px
   * @param res       grid resolution per axis (>= 2)
   * @param type      e.g. "QUAD" | "TRI"
   * @param buffer    optional p5.Graphics to draw into
   * @param pInst     p5 instance
   */
  function Surface(id, w, h, res, type, buffer, pInst) {
    var _this;
    Surface_classCallCheck(this, Surface);
    _this = Surface_callSuper(this, Surface, [pInst, 0, 0]);
    // usually p5.Color
    // p5.Graphics
    Surface_defineProperty(_this, "rafHandle", null);
    _this.pInst = pInst;
    if (!Number.isInteger(res) || res < 2) {
      throw new Error("Surface: res must be an integer >= 2 (got ".concat(res, ")"));
    }
    _this.id = id;
    _this.type = type;
    _this.res = res;

    // constrain to canvas, but allow 0 (if canvas not sized yet)
    _this.width = _this.pInst.constrain(w, 0, Math.max(0, _this.pInst.width));
    _this.height = _this.pInst.constrain(h, 0, Math.max(0, _this.pInst.height));

    // randomized per id/type so all control points match
    _this.controlPointColor = getRandomizedColor(_this.id, _this.type, _this.pInst);

    // Offscreen buffer (2D). Create lazily if not provided.
    _this.buffer = buffer !== null && buffer !== void 0 ? buffer : _this.createBuffer(_this.width, _this.height);
    return _this;
  }

  /** internal: create a 2D buffer and clear it */
  Surface_inherits(Surface, _Draggable);
  return Surface_createClass(Surface, [{
    key: "createBuffer",
    value: function createBuffer(w, h) {
      var g = this.pInst.createGraphics(Math.max(1, Math.floor(w)), Math.max(1, Math.floor(h)));
      g.clear();
      return g;
    }

    /** Muted version of a p5 color (alpha default 50) */
  }, {
    key: "getMutedControlColor",
    value: function getMutedControlColor() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var p = this.pInst;
      return p.color(p.red(col), p.green(col), p.blue(col), alpha);
    }

    /** Clear buffer to a color and then draw the textured surface using that buffer */
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pInst.color("black");
      if (!this.buffer || this.buffer.width <= 0 || this.buffer.height <= 0) return;
      this.buffer.push();
      this.buffer.clear();
      this.buffer.background(col);
      this.buffer.pop();
      this.displayTexture(this.buffer);
    }

    /**
     * Override in subclasses to issue the actual geometry draw calls, e.g.:
     * - with texture:    isUV=true, arguments are [u0, v0, u1, v1]
     * - without texture: isUV=false, arguments are ignored
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var u0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var v0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var u1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var v1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      // Subclasses must implement drawing (triangles/quads) using current transform + UVs
      // Example: draw a textured quad with these UVs.
      // Left as a warning to catch accidental use without overriding.
      // (Use console.warn sparingly in prod.)
      console.warn("Surface.displaySurface() should be overridden by subclass.");
    }

    /**
     * Draw a sketch into this.surface's buffer, then render that buffer as texture.
     * @param sketch draws into provided p5.Graphics
     * @param tX     source crop x (pixels) OR u0 if texW <= 0
     * @param tY     source crop y (pixels) OR v0 if texH <= 0
     * @param texW   source crop width (pixels). If <=0, treat tX,tY as u0,v0.
     * @param texH   source crop height (pixels). If <=0, treat as full [u1,v1]=[1,1].
     */
  }, {
    key: "displaySketch",
    value: function displaySketch(sketch) {
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var texW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var texH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      if (!this.buffer) this.buffer = this.createBuffer(this.width, this.height);
      var g = this.buffer;
      g.push();
      g.clear();
      sketch(g);
      g.pop();
      this.displayTexture(g, tX, tY, texW, texH);
    }

    /**
     * Render a texture onto the surface.
     * Two modes:
     *  1) Crop mode (texW>0 && texH>0): (tX,tY,texW,texH) in source pixels → mapped to UV [u0,v0,u1,v1]
     *  2) UV mode   (texW<=0 || texH<=0): (tX,tY) are u0,v0; u1=v1=1 by default
     */
    // Surface.ts
  }, {
    key: "displayTexture",
    value: function displayTexture(tex) {
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var texW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var texH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      if (!tex || tex.width <= 0 || tex.height <= 0) return;
      if (texW <= 0) texW = tex.width;
      if (texH <= 0) texH = tex.height;

      // convert pixel rect → normalized rect
      var u0 = tX / tex.width;
      var v0 = tY / tex.height;
      var u1 = (tX + texW) / tex.width;
      var v1 = (tY + texH) / tex.height;
      var p = this.pInst;
      p.push();
      p.noStroke();
      p.translate(this.x, this.y);

      // IMPORTANT: normalized UVs
      p.textureMode(p.NORMAL);
      p.texture(tex);

      // displaySurface expects (isUV, u0, v0, u1, v1)
      this.displaySurface(true, u0, v0, u1, v1);
      if (p.isCalibratingMapper()) this.displayCalibration();
      p.pop();
    }

    /** Outline + fill overlay used in calibration mode */
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      var p = this.pInst;
      p.push();
      this.displayOutline();
      p.pop();
    }

    /** Draws the outline (no texture). Subclass displaySurface(false) should render the shape edges. */
  }, {
    key: "displayOutline",
    value: function displayOutline() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      var p = this.pInst;
      p.push();
      p.strokeWeight(3);
      p.stroke(col);
      p.fill(this.getMutedControlColor());
      p.translate(this.x, this.y);
      this.displaySurface(false);
      p.pop();
    }

    /** Compare lightweight identity (id+type) */
  }, {
    key: "isEqual",
    value: function isEqual(json) {
      return json && json.id.toString() === this.id.toString() && json.type === this.type;
    }

    /** Compute tight bounds of an array of {x,y} points */
  }, {
    key: "getBounds",
    value: function getBounds(points) {
      if (!points || points.length === 0) return {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };
      var minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      var _iterator = _createForOfIteratorHelper(points),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pt = _step.value;
          if (pt.x < minX) minX = pt.x;
          if (pt.y < minY) minY = pt.y;
          if (pt.x > maxX) maxX = pt.x;
          if (pt.y > maxY) maxY = pt.y;
        }

        // floor mins; ceil maxs to ensure coverage
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      minX = Math.floor(minX);
      minY = Math.floor(minY);
      maxX = Math.ceil(maxX);
      maxY = Math.ceil(maxY);
      return {
        x: minX,
        y: minY,
        w: Math.max(0, maxX - minX),
        h: Math.max(0, maxY - minY)
      };
    }

    /**
     * Set width/height from points’ bounds (does not move the surface position).
     * If buffer size changes, we recreate it.
     */
  }, {
    key: "setDimensions",
    value: function setDimensions(points) {
      var _this$getBounds = this.getBounds(points),
        w = _this$getBounds.w,
        h = _this$getBounds.h;
      this.setSize(w, h);
    }

    /** Explicitly resize surface; recreates buffer if dimensions changed. */
  }, {
    key: "setSize",
    value: function setSize(w, h) {
      var newW = Math.max(0, Math.floor(w));
      var newH = Math.max(0, Math.floor(h));
      if (newW === this.width && newH === this.height) return;
      this.width = newW;
      this.height = newH;

      // Recreate buffer to match new size (2D)
      this.buffer = this.createBuffer(this.width, this.height);
      this.scheduleCalculateMesh();
    }

    /** rAF-based debounce for heavy recomputes in subclasses */
  }, {
    key: "scheduleCalculateMesh",
    value: function scheduleCalculateMesh() {
      var _this2 = this;
      if (this.rafHandle != null) return;

      // Prefer browser rAF if present
      var raf = typeof window !== "undefined" && window.requestAnimationFrame;
      if (raf) {
        this.rafHandle = raf(function () {
          _this2.rafHandle = null;
          if (typeof _this2.calculateMesh === "function") {
            _this2.calculateMesh();
          }
        });
      } else {
        // Fallback (tests / non-DOM)
        this.rafHandle = setTimeout(function () {
          _this2.rafHandle = null;
          if (typeof _this2.calculateMesh === "function") {
            _this2.calculateMesh();
          }
        }, 0);
      }
    }

    //   override if it needs this
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {}

    /** Basic JSON snapshot (dimensions + identity) */
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        id: this.id,
        type: this.type,
        res: this.res,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }]);
}(Draggable);

;// ./src/surfaces/CornerPinSurface.ts
function CornerPinSurface_typeof(o) { "@babel/helpers - typeof"; return CornerPinSurface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CornerPinSurface_typeof(o); }
function CornerPinSurface_slicedToArray(r, e) { return CornerPinSurface_arrayWithHoles(r) || CornerPinSurface_iterableToArrayLimit(r, e) || CornerPinSurface_unsupportedIterableToArray(r, e) || CornerPinSurface_nonIterableRest(); }
function CornerPinSurface_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function CornerPinSurface_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function CornerPinSurface_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function CornerPinSurface_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = CornerPinSurface_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function CornerPinSurface_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return CornerPinSurface_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? CornerPinSurface_arrayLikeToArray(r, a) : void 0; } }
function CornerPinSurface_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function CornerPinSurface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CornerPinSurface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CornerPinSurface_toPropertyKey(o.key), o); } }
function CornerPinSurface_createClass(e, r, t) { return r && CornerPinSurface_defineProperties(e.prototype, r), t && CornerPinSurface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CornerPinSurface_callSuper(t, o, e) { return o = CornerPinSurface_getPrototypeOf(o), CornerPinSurface_possibleConstructorReturn(t, CornerPinSurface_isNativeReflectConstruct() ? Reflect.construct(o, e || [], CornerPinSurface_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function CornerPinSurface_possibleConstructorReturn(t, e) { if (e && ("object" == CornerPinSurface_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return CornerPinSurface_assertThisInitialized(t); }
function CornerPinSurface_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function CornerPinSurface_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (CornerPinSurface_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function CornerPinSurface_getPrototypeOf(t) { return CornerPinSurface_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, CornerPinSurface_getPrototypeOf(t); }
function CornerPinSurface_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && CornerPinSurface_setPrototypeOf(t, e); }
function CornerPinSurface_setPrototypeOf(t, e) { return CornerPinSurface_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, CornerPinSurface_setPrototypeOf(t, e); }
function CornerPinSurface_defineProperty(e, r, t) { return (r = CornerPinSurface_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function CornerPinSurface_toPropertyKey(t) { var i = CornerPinSurface_toPrimitive(t, "string"); return "symbol" == CornerPinSurface_typeof(i) ? i : i + ""; }
function CornerPinSurface_toPrimitive(t, r) { if ("object" != CornerPinSurface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CornerPinSurface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// CornerPinSurface.ts




/**
 * Small interface so any perspective impl just needs a `transform([x,y])`.
 * E.g., wrap your PerspT or homography util here.
 */
var CornerPinSurface = /*#__PURE__*/function (_Surface) {
  function CornerPinSurface(id, width, height, res, type, buffer, pInst) {
    var _this;
    CornerPinSurface_classCallCheck(this, CornerPinSurface);
    _this = CornerPinSurface_callSuper(this, CornerPinSurface, [id, width, height, res, type, buffer, pInst]);
    /** grid resolution per axis (res x res points) */
    /** flattened grid of MeshPoints, row-major (y * res + x) */
    CornerPinSurface_defineProperty(_this, "mesh", []);
    /** top-left, top-right, bottom-right, bottom-left indices into mesh */
    CornerPinSurface_defineProperty(_this, "TL", 0);
    CornerPinSurface_defineProperty(_this, "TR", 0);
    CornerPinSurface_defineProperty(_this, "BR", 0);
    CornerPinSurface_defineProperty(_this, "BL", 0);
    /** control points are exactly the four corners */
    CornerPinSurface_defineProperty(_this, "controlPoints", []);
    /** perspective transform used for inverse cursor mapping */
    CornerPinSurface_defineProperty(_this, "perspectiveTransform", null);
    if (!Number.isInteger(res) || res < 2) {
      throw new Error("CornerPinSurface: res must be an integer >= 2, got ".concat(res));
    }
    _this.res = res;
    _this.initMesh();
    _this.calculateMesh(); // abstract in base class, but we call to set initial transform if you compute it there
    return _this;
  }

  /** index helper (row-major) */
  CornerPinSurface_inherits(CornerPinSurface, _Surface);
  return CornerPinSurface_createClass(CornerPinSurface, [{
    key: "idx",
    value: function idx(x, y) {
      return y * this.res + x;
    }

    /** iterate all mesh points */
  }, {
    key: "forEachPoint",
    value: function forEachPoint(fn) {
      var i = 0;
      for (var y = 0; y < this.res; y++) {
        for (var x = 0; x < this.res; x++, i++) {
          fn(this.mesh[i], x, y, i);
        }
      }
    }

    /** build a regular grid + mark corners as control points */
  }, {
    key: "initMesh",
    value: function initMesh() {
      var _this2 = this;
      this.mesh = new Array(this.res * this.res);

      // map 0..res-1 → 0..width/height so corners land exactly on edges
      var mapX = function mapX(gx) {
        return gx / (_this2.res - 1) * _this2.width;
      };
      var mapY = function mapY(gy) {
        return gy / (_this2.res - 1) * _this2.height;
      };
      var mapU = function mapU(gx) {
        return gx / (_this2.res - 1);
      };
      var mapV = function mapV(gy) {
        return gy / (_this2.res - 1);
      };
      for (var y = 0; y < this.res; y++) {
        for (var x = 0; x < this.res; x++) {
          var mx = Math.round(mapX(x));
          var my = Math.round(mapY(y));
          var u = mapU(x);
          var v = mapV(y);
          this.mesh[this.idx(x, y)] = new MeshPoint(this, mx, my, u, v, this.pInst);
        }
      }
      this.TL = this.idx(0, 0);
      this.TR = this.idx(this.res - 1, 0);
      this.BL = this.idx(0, this.res - 1);
      this.BR = this.idx(this.res - 1, this.res - 1);

      // corners are control points
      [this.TL, this.TR, this.BR, this.BL].forEach(function (i) {
        _this2.mesh[i].setControlPoint(true);
      });
      this.controlPoints = [this.mesh[this.TL], this.mesh[this.TR], this.mesh[this.BR], this.mesh[this.BL]];
    }

    /**
     * Override in subclasses. Compute any per-frame mesh adjustments and
     * (recommended) update `this.perspectiveTransform` so cursor mapping works.
     * Example (pseudo):
     *   const src = [0,0, width,0, width,height, 0,height];
     *   const dst = [TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y];
     *   const persp = PerspT(src, dst); // whatever you use
     *   this.setPerspectiveTransform({ transform: ([x,y]) => persp.transform(x,y) });
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }, {
    key: "calculateMesh",
    value: function calculateMesh() {}

    /** supply a perspective transform impl (set from calculateMesh) */
  }, {
    key: "setPerspectiveTransform",
    value: function setPerspectiveTransform(pt) {
      this.perspectiveTransform = pt;
    }

    /** JSON → state (applies only stored control points, keeps others) */
  }, {
    key: "load",
    value: function load(json) {
      var x = json.x,
        y = json.y,
        points = json.points;
      this.x = x;
      this.y = y;
      var _iterator = CornerPinSurface_createForOfIteratorHelper(points || []),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          var mp = this.mesh[p.i];
          if (!mp) continue;
          mp.x = p.x;
          mp.y = p.y;
          mp.u = p.u || 0;
          mp.v = p.v || 0;
          mp.setControlPoint(true);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.calculateMesh();
    }

    /** state → JSON (only control points are persisted) */
  }, {
    key: "toJSON",
    value: function toJSON() {
      var data = {
        id: String(this.id),
        res: this.res,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        type: this.type,
        points: []
      };
      this.forEachPoint(function (mp, _x, _y, i) {
        if (mp.isControlPoint) {
          var _data$points;
          (_data$points = data.points) === null || _data$points === void 0 || _data$points.push({
            i: i,
            x: mp.x,
            y: mp.y,
            u: mp.u,
            v: mp.v
          });
        }
      });
      return data;
    }
  }, {
    key: "getControlPoints",
    value: function getControlPoints() {
      return this.controlPoints;
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      var cp = this.isMouseOverControlPoints();
      if (cp) {
        cp.startDrag();
        return cp;
      }
      return null;
    }
  }, {
    key: "isMouseOverControlPoints",
    value: function isMouseOverControlPoints() {
      var _iterator2 = CornerPinSurface_createForOfIteratorHelper(this.controlPoints),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var cp = _step2.value;
          if (cp.isMouseOver()) return cp;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return false;
    }

    /**
     * Barycentric point-in-triangle test.
     * Kept as a utility in case you want click-to-select by face.
     */
  }, {
    key: "isPointInTriangle",
    value: function isPointInTriangle(x, y, a, b, c) {
      var v0x = c.x - a.x,
        v0y = c.y - a.y;
      var v1x = b.x - a.x,
        v1y = b.y - a.y;
      var v2x = x - a.x,
        v2y = y - a.y;
      var dot00 = v0x * v0x + v0y * v0y;
      var dot01 = v1x * v0x + v1y * v0y;
      var dot02 = v2x * v0x + v2y * v0y;
      var dot11 = v1x * v1x + v1y * v1y;
      var dot12 = v2x * v1x + v2y * v1y;
      var invDen = 1 / (dot00 * dot11 - dot01 * dot01);
      var u = (dot11 * dot02 - dot01 * dot12) * invDen;
      var v = (dot00 * dot12 - dot01 * dot02) * invDen;
      return u > 0 && v > 0 && u + v < 1;
    }

    /** draws corner handles */
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      var p = this.pInst;
      p.push();
      p.translate(this.x, this.y);
      var _iterator3 = CornerPinSurface_createForOfIteratorHelper(this.controlPoints),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var cp = _step3.value;
          cp.display(this.controlPointColor);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      p.pop();
    }

    /**
     * Map a canvas-space point into the surface’s local (pre-warp) space.
     * Requires `this.perspectiveTransform` to be set (e.g., in `calculateMesh`).
     */
  }, {
    key: "getTransformedCursor",
    value: function getTransformedCursor(cx, cy) {
      if (!this.perspectiveTransform) return this.pInst.createVector(cx - this.x, cy - this.y);
      var _this$perspectiveTran = this.perspectiveTransform.transform([cx - this.x, cy - this.y]),
        _this$perspectiveTran2 = CornerPinSurface_slicedToArray(_this$perspectiveTran, 2),
        tx = _this$perspectiveTran2[0],
        ty = _this$perspectiveTran2[1];
      return this.pInst.createVector(tx, ty);
    }
  }, {
    key: "getTransformedMouse",
    value: function getTransformedMouse() {
      var _this$getMouseCoords = this.getMouseCoords(),
        x = _this$getMouseCoords.x,
        y = _this$getMouseCoords.y;
      return this.getTransformedCursor(x, y);
    }

    /** 2D cross product helper (kept for completeness) */
  }, {
    key: "cross2",
    value: function cross2(x0, y0, x1, y1) {
      return x0 * y1 - y0 * x1;
    }
  }]);
}(Surface);

;// ./src/surfaces/QuadMap.ts
function QuadMap_typeof(o) { "@babel/helpers - typeof"; return QuadMap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, QuadMap_typeof(o); }
function QuadMap_slicedToArray(r, e) { return QuadMap_arrayWithHoles(r) || QuadMap_iterableToArrayLimit(r, e) || QuadMap_unsupportedIterableToArray(r, e) || QuadMap_nonIterableRest(); }
function QuadMap_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function QuadMap_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return QuadMap_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? QuadMap_arrayLikeToArray(r, a) : void 0; } }
function QuadMap_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function QuadMap_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function QuadMap_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function QuadMap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function QuadMap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, QuadMap_toPropertyKey(o.key), o); } }
function QuadMap_createClass(e, r, t) { return r && QuadMap_defineProperties(e.prototype, r), t && QuadMap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function QuadMap_toPropertyKey(t) { var i = QuadMap_toPrimitive(t, "string"); return "symbol" == QuadMap_typeof(i) ? i : i + ""; }
function QuadMap_toPrimitive(t, r) { if ("object" != QuadMap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != QuadMap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function QuadMap_callSuper(t, o, e) { return o = QuadMap_getPrototypeOf(o), QuadMap_possibleConstructorReturn(t, QuadMap_isNativeReflectConstruct() ? Reflect.construct(o, e || [], QuadMap_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function QuadMap_possibleConstructorReturn(t, e) { if (e && ("object" == QuadMap_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return QuadMap_assertThisInitialized(t); }
function QuadMap_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function QuadMap_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (QuadMap_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function QuadMap_getPrototypeOf(t) { return QuadMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, QuadMap_getPrototypeOf(t); }
function QuadMap_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && QuadMap_setPrototypeOf(t, e); }
function QuadMap_setPrototypeOf(t, e) { return QuadMap_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, QuadMap_setPrototypeOf(t, e); }



// type PerspectiveFn = (x: number, y: number) => [number, number];
var QuadMap = /*#__PURE__*/function (_CornerPinSurface) {
  /** We keep resX/resY mirrored to base `res` so the mesh stays consistent. */

  /** Homography mapping src → dst (x,y) */

  function QuadMap(id, w, h, res, buffer, pInst) {
    var _this;
    QuadMap_classCallCheck(this, QuadMap);
    _this = QuadMap_callSuper(this, QuadMap, [id, w, h, res, "QUAD", buffer, pInst]);

    // Keep internal axes in sync with base resolution
    _this.resX = _this.res;
    _this.resY = _this.res;
    return _this;
  }

  /**
   * Returns true if the mouse is over this surface.
   * We test in *local* space (mouse - surface origin) against the two triangles.
   */
  QuadMap_inherits(QuadMap, _CornerPinSurface);
  return QuadMap_createClass(QuadMap, [{
    key: "isMouseOver",
    value: function isMouseOver() {
      var _this$getMouseCoords = this.getMouseCoords(),
        x = _this$getMouseCoords.x,
        y = _this$getMouseCoords.y;
      var mx = x - this.x;
      var my = y - this.y;

      // Two-triangle quad: TL-TR-BL and BL-TR-BR
      return this.isPointInTriangle(mx, my, this.mesh[this.TL], this.mesh[this.TR], this.mesh[this.BL]) || this.isPointInTriangle(mx, my, this.mesh[this.BL], this.mesh[this.TR], this.mesh[this.BR]);
    }

    /**
     * Computes the homography from the source rect → current corner pins,
     * then maps every interior grid point.
     */
  }, {
    key: "calculateMesh",
    value: function calculateMesh() {
      var srcCorners = [0, 0, this.width, 0, this.width, this.height, 0, this.height];
      var dstCorners = [this.mesh[this.TL].x, this.mesh[this.TL].y, this.mesh[this.TR].x, this.mesh[this.TR].y, this.mesh[this.BR].x, this.mesh[this.BR].y, this.mesh[this.BL].x, this.mesh[this.BL].y];

      // PerspT is expected to return an object with transform(x,y) → [x', y']
      var persp = perspective_PerspT(srcCorners, dstCorners);
      var stepX = this.width / (this.resX - 1);
      var stepY = this.height / (this.resY - 1);

      // Map all grid points except the four pinned corners
      for (var y = 0; y < this.resY; y++) {
        for (var x = 0; x < this.resX; x++) {
          var i = y * this.res + x; // base mesh is res x res
          if (i === this.TL || i === this.TR || i === this.BR || i === this.BL) continue;
          var sx = x * stepX;
          var sy = y * stepY;
          var _persp$transform = persp.transform(sx, sy),
            _persp$transform2 = QuadMap_slicedToArray(_persp$transform, 2),
            dx = _persp$transform2[0],
            dy = _persp$transform2[1];
          this.mesh[i].x = dx;
          this.mesh[i].y = dy;
        }
      }
    }

    /**
     * Draw the tessellated quad as two triangles per cell.
     * When `isUV` is true we pass normalized UVs in [0,1] (Surface sets `textureMode(NORMAL)`).
     * The four extra params are interpreted as [u0, v0, u1, v1].
     */
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var u0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var v0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var u1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var v1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var p = this.pInst;
      p.beginShape(p.TRIANGLES);
      for (var x = 0; x < this.resX - 1; x++) {
        for (var y = 0; y < this.resY - 1; y++) {
          if (isUV) {
            this.emitQuadAsTrianglesUV(x, y, u0, v0, u1, v1);
          } else {
            this.emitQuadAsTrianglesOutline(x, y);
          }
        }
      }
      p.endShape();
    }

    /** Calibration draw (grid without texture) */
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      this.displayGrid();
    }
  }, {
    key: "displayGrid",
    value: function displayGrid() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      var p = this.pInst;
      p.strokeWeight(2);
      p.stroke(col);
      p.fill(this.getMutedControlColor(col));
      p.beginShape(p.TRIANGLES);
      for (var x = 0; x < this.resX - 1; x++) {
        for (var y = 0; y < this.resY - 1; y++) {
          this.emitQuadAsTrianglesOutline(x, y);
        }
      }
      p.endShape();
    }

    /** Emit two triangles for a cell with proper UVs (normalized 0..1). */
  }, {
    key: "emitQuadAsTrianglesUV",
    value: function emitQuadAsTrianglesUV(x, y, u0, v0, u1, v1) {
      var _this2 = this;
      var i00 = y * this.res + x; // (x,   y)
      var i10 = y * this.res + (x + 1); // (x+1, y)
      var i11 = (y + 1) * this.res + (x + 1); // (x+1, y+1)
      var i01 = (y + 1) * this.res + x; // (x,   y+1)

      // Interpolate UV per-vertex from the quad UV rect
      // mp.u/mp.v are 0..1 over the original rect; re-map into [u0..u1]/[v0..v1]
      var put = function put(i) {
        var mp = _this2.mesh[i];
        var uu = u0 + mp.u * (u1 - u0);
        var vv = v0 + mp.v * (v1 - v0);
        _this2.pInst.vertex(mp.x, mp.y, uu, vv);
      };

      // Triangle 1: (x,y) → (x+1,y) → (x+1,y+1)
      put(i00);
      put(i10);
      put(i11);

      // Triangle 2: (x,y) → (x+1,y+1) → (x,y+1)
      put(i00);
      put(i11);
      put(i01);
    }

    /** Emit two triangles for outline/fill only (no UVs). */
  }, {
    key: "emitQuadAsTrianglesOutline",
    value: function emitQuadAsTrianglesOutline(x, y) {
      var _this3 = this;
      var i00 = y * this.res + x;
      var i10 = y * this.res + (x + 1);
      var i11 = (y + 1) * this.res + (x + 1);
      var i01 = (y + 1) * this.res + x;
      var v = function v(i) {
        var mp = _this3.mesh[i];
        _this3.pInst.vertex(mp.x, mp.y);
      };

      // Triangle 1
      v(i00);
      v(i10);
      v(i11);

      // Triangle 2
      v(i00);
      v(i11);
      v(i01);
    }

    // --- Optional: if you ever want to change tessellation dynamically ----

    /** Set a new (square) resolution and rebuild the base mesh accordingly. */
  }, {
    key: "setResolution",
    value: function setResolution(res) {
      var _initMesh, _ref;
      var r = Math.max(2, Math.floor(res));
      if (r === this.res) return;
      this.res = r;
      this.resX = r;
      this.resY = r;

      // Rebuild the base mesh & control points from CornerPinSurface
      (_initMesh = (_ref = this).initMesh) === null || _initMesh === void 0 || _initMesh.call(_ref);
      this.calculateMesh();
    }
  }]);
}(CornerPinSurface);

;// ./src/surfaces/TriMap.ts
function TriMap_typeof(o) { "@babel/helpers - typeof"; return TriMap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, TriMap_typeof(o); }
function TriMap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function TriMap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, TriMap_toPropertyKey(o.key), o); } }
function TriMap_createClass(e, r, t) { return r && TriMap_defineProperties(e.prototype, r), t && TriMap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function TriMap_toPropertyKey(t) { var i = TriMap_toPrimitive(t, "string"); return "symbol" == TriMap_typeof(i) ? i : i + ""; }
function TriMap_toPrimitive(t, r) { if ("object" != TriMap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != TriMap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function TriMap_callSuper(t, o, e) { return o = TriMap_getPrototypeOf(o), TriMap_possibleConstructorReturn(t, TriMap_isNativeReflectConstruct() ? Reflect.construct(o, e || [], TriMap_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function TriMap_possibleConstructorReturn(t, e) { if (e && ("object" == TriMap_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return TriMap_assertThisInitialized(t); }
function TriMap_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function TriMap_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (TriMap_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function TriMap_getPrototypeOf(t) { return TriMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, TriMap_getPrototypeOf(t); }
function TriMap_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && TriMap_setPrototypeOf(t, e); }
function TriMap_setPrototypeOf(t, e) { return TriMap_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, TriMap_setPrototypeOf(t, e); }
// TriMap.ts

var TriMap = /*#__PURE__*/function (_CornerPinSurface) {
  /** Index of the top apex point in the base mesh */

  function TriMap(id, w, h, res, buffer, pInst) {
    var _this;
    TriMap_classCallCheck(this, TriMap);
    _this = TriMap_callSuper(this, TriMap, [id, w, h, res, "TRI", buffer, pInst]);
    _this.setTriMesh();
    return _this;
  }

  /**
   * Returns true if the mouse is over this triangular surface.
   * We evaluate in *local* coordinates (mouse - surface origin).
   */
  TriMap_inherits(TriMap, _CornerPinSurface);
  return TriMap_createClass(TriMap, [{
    key: "isMouseOver",
    value: function isMouseOver() {
      var _this$getMouseCoords = this.getMouseCoords(),
        x = _this$getMouseCoords.x,
        y = _this$getMouseCoords.y;
      var mx = x - this.x;
      var my = y - this.y;
      return this.isPointInTriangle(mx, my, this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]);
    }

    /**
     * Configure the triangle’s control points:
     * - Apex (TP) at the middle of the top row
     * - Bottom corners are BL and BR (inherited)
     * TL/TR are disabled for this triangle surface
     */
  }, {
    key: "setTriMesh",
    value: function setTriMesh() {
      // Middle of the top row: x = floor((res-1)/2), y = 0
      var xTop = Math.floor((this.res - 1) / 2);
      this.TP = 0 * this.res + xTop;

      // Make only TP, BL, BR the control points
      this.mesh[this.TP].setControlPoint(true);
      this.mesh[this.TL].setControlPoint(false);
      this.mesh[this.TR].setControlPoint(false);
      this.mesh[this.BL].setControlPoint(true);
      this.mesh[this.BR].setControlPoint(true);
      this.controlPoints = [this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]];
    }

    /**
     * Draw the triangle.
     * When `isUV` is true, Surface has already set `textureMode(NORMAL)`,
     * and we pass UVs in [0,1] using the supplied rect (u0,v0,u1,v1).
     */
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var u0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var v0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var u1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var v1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var p = this.pInst;
      var apex = this.mesh[this.TP];
      var bl = this.mesh[this.BL];
      var br = this.mesh[this.BR];

      // Choose UVs: BL → (u0,v1), TP → mid-top ((u0+u1)/2, v0), BR → (u1,v1)
      var uv = {
        u0: u0,
        v0: v0,
        u1: u1,
        v1: v1
      };
      var uMid = (uv.u0 + uv.u1) * 0.5;
      p.beginShape(p.TRIANGLES);
      if (isUV) p.vertex(bl.x, bl.y, uv.u0, uv.v1);else p.vertex(bl.x, bl.y);
      if (isUV) p.vertex(apex.x, apex.y, uMid, uv.v0);else p.vertex(apex.x, apex.y);
      if (isUV) p.vertex(br.x, br.y, uv.u1, uv.v1);else p.vertex(br.x, br.y);
      p.endShape(p.CLOSE);
    }

    /** Optional: show an outline/fill in calibration mode */
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      var p = this.pInst;
      var apex = this.mesh[this.TP];
      var bl = this.mesh[this.BL];
      var br = this.mesh[this.BR];
      p.push();
      p.strokeWeight(2);
      p.stroke(this.controlPointColor);
      p.fill(this.getMutedControlColor());
      p.beginShape();
      p.vertex(bl.x, bl.y);
      p.vertex(apex.x, apex.y);
      p.vertex(br.x, br.y);
      p.endShape(p.CLOSE);
      p.pop();
    }
  }]);
}(CornerPinSurface);

;// ./src/surfaces/PolyMap.ts
function PolyMap_typeof(o) { "@babel/helpers - typeof"; return PolyMap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PolyMap_typeof(o); }
function PolyMap_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = PolyMap_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function PolyMap_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return PolyMap_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? PolyMap_arrayLikeToArray(r, a) : void 0; } }
function PolyMap_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function PolyMap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PolyMap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PolyMap_toPropertyKey(o.key), o); } }
function PolyMap_createClass(e, r, t) { return r && PolyMap_defineProperties(e.prototype, r), t && PolyMap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PolyMap_callSuper(t, o, e) { return o = PolyMap_getPrototypeOf(o), PolyMap_possibleConstructorReturn(t, PolyMap_isNativeReflectConstruct() ? Reflect.construct(o, e || [], PolyMap_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function PolyMap_possibleConstructorReturn(t, e) { if (e && ("object" == PolyMap_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return PolyMap_assertThisInitialized(t); }
function PolyMap_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function PolyMap_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (PolyMap_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function PolyMap_getPrototypeOf(t) { return PolyMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, PolyMap_getPrototypeOf(t); }
function PolyMap_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && PolyMap_setPrototypeOf(t, e); }
function PolyMap_setPrototypeOf(t, e) { return PolyMap_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, PolyMap_setPrototypeOf(t, e); }
function PolyMap_defineProperty(e, r, t) { return (r = PolyMap_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function PolyMap_toPropertyKey(t) { var i = PolyMap_toPrimitive(t, "string"); return "symbol" == PolyMap_typeof(i) ? i : i + ""; }
function PolyMap_toPrimitive(t, r) { if ("object" != PolyMap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PolyMap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


 // typed earlier as (point, polygon, offset) => boolean
var PolyMap = /*#__PURE__*/function (_Surface) {
  function PolyMap(id, numPoints, buffer, pInst) {
    var _this;
    PolyMap_classCallCheck(this, PolyMap);
    // width/height/res are derived from points later; pass 0s for now
    _this = PolyMap_callSuper(this, PolyMap, [id, 0, 0, 2, "POLY", buffer, pInst]);

    // seed a regular n-gon
    PolyMap_defineProperty(_this, "points", []);
    for (var i = 0; i < numPoints; i++) {
      var r = 200;
      var theta = i / numPoints * 2 * _this.pInst.PI;
      var x = r + r * Math.cos(theta);
      var y = r + r * Math.sin(theta);
      var cp = new MovePoint(_this, x, y, _this.pInst).setControlPoint(true);
      _this.points.push(cp);
    }
    _this.setDimensions(_this.points);
    return _this;
  }

  /** Replace all control points from raw coordinates. */
  PolyMap_inherits(PolyMap, _Surface);
  return PolyMap_createClass(PolyMap, [{
    key: "setPoints",
    value: function setPoints(pts) {
      this.points = [];
      var _iterator = PolyMap_createForOfIteratorHelper(pts),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          var cp = new MovePoint(this, p.x, p.y, this.pInst).setControlPoint(true);
          this.points.push(cp);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.setDimensions(this.points);
    }

    /**
     * Draw the polygon.
     * When `isUV` is true, Surface has set `textureMode(NORMAL)`,
     * and we pass normalized UVs in [0,1] based on the polygon’s bounds,
     * remapped into the provided rect (u0=v0=0, u1=v1=1 by default).
     */
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var u0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var v0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var u1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var v1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      if (this.points.length === 0) return;
      var _this$getBounds = this.getBounds(this.points),
        minX = _this$getBounds.x,
        minY = _this$getBounds.y,
        w = _this$getBounds.w,
        h = _this$getBounds.h;
      var rw = w > 0 ? w : 1;
      var rh = h > 0 ? h : 1;
      var mapU = function mapU(px) {
        return u0 + (px - minX) / rw * (u1 - u0);
      };
      var mapV = function mapV(py) {
        return v0 + (py - minY) / rh * (v1 - v0);
      };
      var p = this.pInst;
      p.beginShape();
      var _iterator2 = PolyMap_createForOfIteratorHelper(this.points),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var pt = _step2.value;
          if (isUV) {
            p.vertex(pt.x, pt.y, mapU(pt.x), mapV(pt.y));
          } else {
            p.vertex(pt.x, pt.y);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      p.endShape(p.CLOSE);
    }
  }, {
    key: "displayOutline",
    value: function displayOutline() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      var p = this.pInst;
      p.push();
      p.strokeWeight(3);
      p.stroke(col);
      p.fill(this.getMutedControlColor());
      // p.translate(this.x, this.y);
      this.displaySurface(false);
      p.pop();
    }

    /** Draw large handles while calibrating (reuses MovePoint.display). */
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      var p = this.pInst;
      p.push();
      p.translate(this.x, this.y, 2);
      var _iterator3 = PolyMap_createForOfIteratorHelper(this.points),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var cp = _step3.value;
          cp.display(this.controlPointColor);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      p.pop();
    }

    /**
     * Hit test: check if mouse (in canvas coords) is inside the polygon
     * after offsetting polygon by the surface’s position.
     */
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      return inside(this.getMouseCoords(), this.points, {
        x: this.x,
        y: this.y
      });
    }

    /** Load persisted state (positions only). */
  }, {
    key: "load",
    value: function load(json) {
      var x = json.x,
        y = json.y,
        points = json.points;
      this.x = x;
      this.y = y;
      var _iterator4 = PolyMap_createForOfIteratorHelper(points || []),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var point = _step4.value;
          var mp = this.points[point.i];
          if (!mp) continue;
          mp.x = point.x;
          mp.y = point.y;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      this.setDimensions(this.points);
    }

    /** Persist id/pos/type + point positions. */
  }, {
    key: "toJSON",
    value: function toJSON() {
      var out = {
        id: this.id,
        x: this.x,
        y: this.y,
        type: "POLY",
        points: []
      };
      for (var i = 0; i < this.points.length; i++) {
        var _out$points;
        (_out$points = out.points) === null || _out$points === void 0 || _out$points.push({
          i: i,
          x: this.points[i].x,
          y: this.points[i].y
        });
      }
      return out;
    }

    /** Select a control point for dragging. */
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      var _iterator5 = PolyMap_createForOfIteratorHelper(this.points),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var cp = _step5.value;
          if (cp.isMouseOver()) {
            cp.startDrag();
            return cp;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      return null;
    }
  }]);
}(Surface);

;// ./src/surfaces/Bezier/BezierPoint.ts
function BezierPoint_typeof(o) { "@babel/helpers - typeof"; return BezierPoint_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, BezierPoint_typeof(o); }
function BezierPoint_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function BezierPoint_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, BezierPoint_toPropertyKey(o.key), o); } }
function BezierPoint_createClass(e, r, t) { return r && BezierPoint_defineProperties(e.prototype, r), t && BezierPoint_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function BezierPoint_callSuper(t, o, e) { return o = BezierPoint_getPrototypeOf(o), BezierPoint_possibleConstructorReturn(t, BezierPoint_isNativeReflectConstruct() ? Reflect.construct(o, e || [], BezierPoint_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function BezierPoint_possibleConstructorReturn(t, e) { if (e && ("object" == BezierPoint_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return BezierPoint_assertThisInitialized(t); }
function BezierPoint_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function BezierPoint_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (BezierPoint_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function BezierPoint_getPrototypeOf(t) { return BezierPoint_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, BezierPoint_getPrototypeOf(t); }
function BezierPoint_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && BezierPoint_setPrototypeOf(t, e); }
function BezierPoint_setPrototypeOf(t, e) { return BezierPoint_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, BezierPoint_setPrototypeOf(t, e); }
function BezierPoint_defineProperty(e, r, t) { return (r = BezierPoint_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function BezierPoint_toPropertyKey(t) { var i = BezierPoint_toPrimitive(t, "string"); return "symbol" == BezierPoint_typeof(i) ? i : i + ""; }
function BezierPoint_toPrimitive(t, r) { if ("object" != BezierPoint_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != BezierPoint_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

// ControlPoint.ts

function dist(ax, ay, bx, by) {
  var dx = ax - bx,
    dy = ay - by;
  return Math.hypot(dx, dy);
}
function setFromAnchorAlong(out, ax, ay, px, py, length) {
  // dir = anchor - point (keeps handles collinear)
  var dx = ax - px,
    dy = ay - py;
  var mag = Math.hypot(dx, dy) || 1;
  dx = dx / mag * length;
  dy = dy / mag * length;
  out.set(ax + dx, ay + dy);
}
function mirrorAcrossAnchor(out, ax, ay, px, py) {
  // out = anchor + (anchor - point)
  out.set(2 * ax - px, 2 * ay - py);
}
var BezierPoint = /*#__PURE__*/function (_Draggable) {
  /** Local position (mirrors Draggable.x/y) */

  function BezierPoint(x, y, parentPath, pInst) {
    var _this;
    BezierPoint_classCallCheck(this, BezierPoint);
    _this = BezierPoint_callSuper(this, BezierPoint, [pInst, x, y]);
    // this.id = parentPath.points.length;
    // super(pInst, x, y);
    BezierPoint_defineProperty(_this, "type", "CPOINT");
    BezierPoint_defineProperty(_this, "r", 8);
    _this.pInst = pInst;
    _this.pos = pInst.createVector(x, y);
    _this.parentPath = parentPath;
    _this.type = "CPOINT";
    _this.r = 8;
    return _this;
  }
  BezierPoint_inherits(BezierPoint, _Draggable);
  return BezierPoint_createClass(BezierPoint, [{
    key: "add",
    value: function add(x, y) {
      this.pos.add(x, y);
    }
  }, {
    key: "set",
    value: function set(pos) {
      var x = pos.x,
        y = pos.y;
      this.pos.set(x || 0, y || 0);
      return this;
    }
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var px = this.pos.x + this.parentPath.x;
      var py = this.pos.y + this.parentPath.y;
      var mx = this.pInst.mouseX - this.pInst.width / 2;
      var my = this.pInst.mouseY - this.pInst.height / 2;
      if (this.pInst.dist(px, py, mx, my) < 5) {
        return true;
      }
      return false;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      var x = this.pInst.mouseX - this.pInst.width / 2 - this.parentPath.x;
      var y = this.pInst.mouseY - this.pInst.height / 2 - this.parentPath.y;
      var closed = true;
      var path = this.parentPath;
      var i = path.points.indexOf(this);
      if (i % 3 == 0) {
        // anchor (red) points
        var dx = x - this.pos.x;
        var dy = y - this.pos.y;
        this.pos.set(x, y);
        if (i - 1 >= 0 || closed) {
          path.points[path.loopIndex(i - 1)].add(dx, dy);
        }
        if (i + 1 < path.points.length || closed) {
          path.points[path.loopIndex(i + 1)].add(dx, dy);
        }
        if (path.mode == "AUTOMATIC") path.autoSetAllControlPoints();
      } else if (path.mode != "AUTOMATIC") {
        // control (white) points
        this.pos.set(x, y);
        var anchorI = i % 3 == 1 ? i - 1 : i + 1;
        var otherI = i % 3 == 1 ? i - 2 : i + 2;
        if (otherI >= 0 && otherI < path.points.length || closed) {
          var anchor = path.points[path.loopIndex(anchorI)].pos;
          var other = path.points[path.loopIndex(otherI)].pos;
          if (path.mode == "ALIGNED") {
            var d = dist(anchor.x, anchor.y, other.x, other.y);
            setFromAnchorAlong(other, anchor.x, anchor.y, this.pos.x, this.pos.y, d);
          } else if (path.mode == "MIRRORED") {
            mirrorAcrossAnchor(other, anchor.x, anchor.y, this.pos.x, this.pos.y);
          }
        }
      }
      path.setDimensions();
    }
  }, {
    key: "isAnchor",
    value: function isAnchor() {
      var i = this.parentPath.points.indexOf(this);
      return i % 3 == 0;
    }
  }, {
    key: "displayControlCircle",
    value: function displayControlCircle(anchorCol, lighterCol) {
      var i = this.parentPath.points.indexOf(this);
      var colAnchor = anchorCol;
      var colSelect = lighterCol;
      if (this.isMouseOver()) {
        colAnchor = this.pInst.color(255);
        colSelect = this.pInst.color(200);
      }
      this.pInst.stroke(colAnchor);
      this.pInst.strokeWeight(2);
      if (i % 3 == 0) {
        // anchor
        this.displayCircle(colAnchor, this.r);
      } else if (!this.parentPath.auto) {
        //   let col = this.parentPath.controlPointColor;
        this.displayCircle(colSelect, this.r - 2);
      }
    }
  }, {
    key: "displayCircle",
    value: function displayCircle(col, r) {
      this.pInst.noFill();
      this.pInst.stroke(col);
      this.pInst.ellipse(this.pos.x, this.pos.y, r * 2);
      this.pInst.noStroke();
      this.pInst.fill(col);
      this.pInst.ellipse(this.pos.x, this.pos.y, r);

      // const i = this.parentPath.points.indexOf(this);
      // text(i, this.pos.x, this.pos.y+20);
    }
  }]);
}(Draggable);

;// ./src/surfaces/Bezier/BezierMap.ts
function BezierMap_typeof(o) { "@babel/helpers - typeof"; return BezierMap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, BezierMap_typeof(o); }
function BezierMap_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = BezierMap_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function BezierMap_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return BezierMap_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? BezierMap_arrayLikeToArray(r, a) : void 0; } }
function BezierMap_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function BezierMap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function BezierMap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, BezierMap_toPropertyKey(o.key), o); } }
function BezierMap_createClass(e, r, t) { return r && BezierMap_defineProperties(e.prototype, r), t && BezierMap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function BezierMap_callSuper(t, o, e) { return o = BezierMap_getPrototypeOf(o), BezierMap_possibleConstructorReturn(t, BezierMap_isNativeReflectConstruct() ? Reflect.construct(o, e || [], BezierMap_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function BezierMap_possibleConstructorReturn(t, e) { if (e && ("object" == BezierMap_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return BezierMap_assertThisInitialized(t); }
function BezierMap_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function BezierMap_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (BezierMap_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function BezierMap_superPropGet(t, o, e, r) { var p = BezierMap_get(BezierMap_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function BezierMap_get() { return BezierMap_get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = BezierMap_superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, BezierMap_get.apply(null, arguments); }
function BezierMap_superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = BezierMap_getPrototypeOf(t));); return t; }
function BezierMap_getPrototypeOf(t) { return BezierMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, BezierMap_getPrototypeOf(t); }
function BezierMap_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && BezierMap_setPrototypeOf(t, e); }
function BezierMap_setPrototypeOf(t, e) { return BezierMap_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, BezierMap_setPrototypeOf(t, e); }
function BezierMap_defineProperty(e, r, t) { return (r = BezierMap_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function BezierMap_toPropertyKey(t) { var i = BezierMap_toPrimitive(t, "string"); return "symbol" == BezierMap_typeof(i) ? i : i + ""; }
function BezierMap_toPrimitive(t, r) { if ("object" != BezierMap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != BezierMap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// BezierMap.ts
// Credit: https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/



 // assumes your typed helper
var BezierMap = /*#__PURE__*/function (_Surface) {
  function BezierMap(id, numAnchors, pMapper, pInst) {
    var _this;
    BezierMap_classCallCheck(this, BezierMap);
    _this = BezierMap_callSuper(this, BezierMap, [id, /*w*/0, /*h*/0, /*res*/2, "BEZ", pMapper.buffer, pInst]);
    BezierMap_defineProperty(_this, "mode", "FREE");
    BezierMap_defineProperty(_this, "r", 8);
    /** Points laid out as [anchor, ctrl, ctrl, anchor, ctrl, ctrl, ...] */
    BezierMap_defineProperty(_this, "points", []);
    /** Whether first and last anchors connect and have control handles */
    BezierMap_defineProperty(_this, "closed", true);
    /** Whether control points auto-update (AUTOMATIC mode helper) */
    BezierMap_defineProperty(_this, "auto", false);
    /** Extra padding around the polygon bounds to avoid clipping the mask */
    BezierMap_defineProperty(_this, "bufferSpace", 10);
    /** Cached shader (mask + image compose) */
    BezierMap_defineProperty(_this, "shaderProg", null);
    _this.pMapper = pMapper;

    // give a nominal size; setDimensions() will update from bounds
    _this.width = 100;
    _this.height = 100;
    _this.initEmpty(numAnchors);
    return _this;
  }

  // --- Initialization ----------------------------------------------------

  /** Create a closed ring of anchors/controls */
  BezierMap_inherits(BezierMap, _Surface);
  return BezierMap_createClass(BezierMap, [{
    key: "initEmpty",
    value: function initEmpty() {
      var numAnchors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
      this.points = [];
      this.x = 0;
      this.y = 0;
      var r = 100; // ring radius
      var lineW = 50; // initial handle distance

      // first anchor (angle = 0) and its trailing control
      {
        var x = r * Math.cos(0);
        var y = r * Math.sin(0);
        var x0 = lineW * Math.cos(Math.PI / 2);
        var y0 = -lineW * Math.sin(Math.PI / 2);
        var x1 = -x0;
        var y1 = -y0;

        // anchor at (x,y), trailing control at (x+x1, y+y1)
        this.points.push(new BezierPoint(x, y, this, this.pInst));
        this.points.push(new BezierPoint(x + x1, y + y1, this, this.pInst));
      }

      // intermediate anchors + entering/leaving controls
      for (var i = 1; i < numAnchors; i++) {
        var ang = i * 2 * Math.PI / numAnchors;
        var _x = r * Math.cos(ang);
        var _y = r * Math.sin(ang);
        var _x2 = -lineW * Math.cos(Math.PI / 2 - ang);
        var _y2 = lineW * Math.sin(Math.PI / 2 - ang);
        var _x3 = -_x2;
        var _y3 = -_y2;

        // enter control, anchor, exit control
        this.points.push(new BezierPoint(_x + _x3, _y + _y3, this, this.pInst));
        this.points.push(new BezierPoint(_x, _y, this, this.pInst));
        this.points.push(new BezierPoint(_x + _x2, _y + _y2, this, this.pInst));
      }

      // close the ring with the last control
      {
        var last = this.points[this.points.length - 1].pos;
        this.points.push(new BezierPoint(last.x, last.y, this, this.pInst));
      }
      this.closed = true;
      this.auto = false;
      this.setDimensions();
    }

    // --- Modes -------------------------------------------------------------
  }, {
    key: "setAlignedMode",
    value: function setAlignedMode() {
      this.mode = "ALIGNED";
    }
  }, {
    key: "setMirroredMode",
    value: function setMirroredMode() {
      this.mode = "MIRRORED";
    }
  }, {
    key: "setFreeMode",
    value: function setFreeMode() {
      this.mode = "FREE";
    }
  }, {
    key: "setAutomaticMode",
    value: function setAutomaticMode() {
      this.mode = "AUTOMATIC";
    }

    /** p5 setting passthrough for curve quality */
  }, {
    key: "setBezierDetail",
    value: function setBezierDetail() {
      var _this$pMapper$bezBuff, _this$pMapper$bezBuff2, _this$pMapper$buffer, _this$pMapper$buffer$;
      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
      (_this$pMapper$bezBuff = this.pMapper.bezBuffer) === null || _this$pMapper$bezBuff === void 0 || (_this$pMapper$bezBuff2 = _this$pMapper$bezBuff.bezierDetail) === null || _this$pMapper$bezBuff2 === void 0 || _this$pMapper$bezBuff2.call(_this$pMapper$bezBuff, num);
      (_this$pMapper$buffer = this.pMapper.buffer) === null || _this$pMapper$buffer === void 0 || (_this$pMapper$buffer$ = _this$pMapper$buffer.bezierDetail) === null || _this$pMapper$buffer$ === void 0 || _this$pMapper$buffer$.call(_this$pMapper$buffer, num);
    }
  }, {
    key: "isReady",
    value: function isReady() {
      return Boolean(this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded);
    }

    // --- Persistence -------------------------------------------------------
  }, {
    key: "load",
    value: function load(json) {
      this.points = [];
      this.x = json.x;
      this.y = json.y;
      this.closed = json.closed || false;
      this.auto = json.auto || false;
      var _iterator = BezierMap_createForOfIteratorHelper(json.points || []),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          this.points.push(new BezierPoint(p.x, p.y, this, this.pInst));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.setDimensions();
    }
  }, {
    key: "getJson",
    value: function getJson() {
      return {
        id: this.id,
        type: "BEZ",
        x: this.x,
        y: this.y,
        points: this.points.map(function (p) {
          return {
            x: p.pos.x,
            y: p.pos.y
          };
        }),
        closed: this.closed,
        auto: this.auto
      };
    }
  }, {
    key: "serialize",
    value: function serialize() {
      return JSON.stringify(this.getJson());
    }

    // --- Selection / Interaction ------------------------------------------

    //   public selectSurface(): this | null {
    //     if (this.isMouseOver()) {
    //       this.startDrag();
    //       return this;
    //     }
    //     return null;
    //   }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      var c = this.selectControls();
      if (c) return c;
      return this.selectAnchors();
    }
  }, {
    key: "selectAnchors",
    value: function selectAnchors() {
      for (var i = 0; i < this.points.length; i += 3) {
        var p = this.points[i];
        if (p.isMouseOver()) return p;
      }
      return null;
    }
  }, {
    key: "selectControls",
    value: function selectControls() {
      var _iterator2 = BezierMap_createForOfIteratorHelper(this.points),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var p = _step2.value;
          if (p.isAnchor()) continue;
          if (p.isMouseOver()) return p;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return null;
    }

    // --- Geometry helpers --------------------------------------------------

    /** Axis-aligned bounds of the *polyline* approximation (in local coords) */
  }, {
    key: "getBounds",
    value: function getBounds() {
      var polyline = this.getPolyline();
      return BezierMap_superPropGet(BezierMap, "getBounds", this, 3)([polyline]);
    }
  }, {
    key: "loopIndex",
    value: function loopIndex(i) {
      return (i + this.points.length) % this.points.length;
    }
  }, {
    key: "toggleClosed",
    value: function toggleClosed() {
      if (this.closed) {
        this.closed = false;
        // remove last two control points used to close the loop
        this.points.pop();
        this.points.pop();
      } else {
        this.closed = true;
        var anchor1 = this.points[this.points.length - 1].pos;
        var control1 = this.points[this.points.length - 2].pos;
        var anchor2 = this.points[0].pos;
        var control2 = this.points[1].pos;
        var newControl1 = this.pInst.constructor.Vector.lerp(anchor1, control1, -1);
        var cp1 = new BezierPoint(newControl1.x, newControl1.y, this, this.pInst);
        var newControl2 = this.pInst.constructor.Vector.lerp(anchor2, control2, -1);
        var cp2 = new BezierPoint(newControl2.x, newControl2.y, this, this.pInst);
        this.points.push(cp1, cp2);
      }
      this.setDimensions();
    }
  }, {
    key: "setDimensions",
    value: function setDimensions() {
      var _this$getBounds = this.getBounds(),
        w = _this$getBounds.w,
        h = _this$getBounds.h;
      this.width = w + this.bufferSpace * 2;
      this.height = h + this.bufferSpace * 2;

      // update the white mask into bezBuffer when shape changes
      var bezBuffer = this.pMapper.bezBuffer;
      this.displayBezierPG(bezBuffer);
    }
  }, {
    key: "numSegments",
    value: function numSegments() {
      return Math.floor(this.points.length / 3);
    }
  }, {
    key: "getSegment",
    value: function getSegment(i) {
      return [this.points[this.loopIndex(i * 3 + 0)], this.points[this.loopIndex(i * 3 + 1)], this.points[this.loopIndex(i * 3 + 2)], this.points[this.loopIndex(i * 3 + 3)]];
    }
  }, {
    key: "addSegment",
    value: function addSegment(x, y) {
      // default to mouse in local space
      var _this$getMouseCoords = this.getMouseCoords(),
        mx = _this$getMouseCoords.x,
        my = _this$getMouseCoords.y;
      if (typeof x !== "number") x = mx - this.x;
      if (typeof y !== "number") y = my - this.y;
      var closestAnchorId = this.getClosestAnchor();
      var nextClosestAnchorId = this.getNextClosestAnchor();
      var prevControl = this.points[closestAnchorId + 1].pos;
      var nextControlID = nextClosestAnchorId - 1;
      if (nextControlID === -1) nextControlID = this.points.length - 1;
      var nextControl = this.points[nextControlID].pos;
      var anchor = this.pInst.createVector(x, y);
      var aP = new BezierPoint(anchor.x, anchor.y, this, this.pInst);
      var control1 = this.pInst.constructor.Vector.lerp(prevControl, anchor, 1 - 0.3);
      var control2 = this.pInst.constructor.Vector.lerp(anchor, nextControl, 0.3);
      var cp1 = new BezierPoint(control1.x, control1.y, this, this.pInst);
      var cp2 = new BezierPoint(control2.x, control2.y, this, this.pInst);
      this.points.splice(closestAnchorId + 2, 0, cp1, aP, cp2);
      this.setDimensions();
    }
  }, {
    key: "removeSegment",
    value: function removeSegment() {
      if (this.points.length <= 3) {
        console.warn("cannot have a bezier with less than one anchor");
        return;
      }
      for (var i = 0; i < this.points.length; i += 3) {
        if (this.points[i].isMouseOver()) {
          this.points.splice(i, 3);
          this.setDimensions();
          return;
        }
      }
    }
  }, {
    key: "getClosestAnchor",
    value: function getClosestAnchor() {
      var _this$getMouseCoords2 = this.getMouseCoords(),
        x = _this$getMouseCoords2.x,
        y = _this$getMouseCoords2.y;
      var mx = x - this.x;
      var my = y - this.y;
      var minDis = Infinity;
      var index = 0;
      for (var i = 0; i < this.points.length; i += 3) {
        var p0 = this.points[i];
        var p1 = i >= this.points.length - 3 ? this.points[0] : this.points[i + 3];
        var d0 = this.pInst.dist(p0.pos.x, p0.pos.y, mx, my);
        var d1 = this.pInst.dist(p1.pos.x, p1.pos.y, mx, my);
        var cost = d0 + d1;
        if (cost < minDis) {
          minDis = cost;
          index = i;
        }
      }
      return index;
    }
  }, {
    key: "getNextClosestAnchor",
    value: function getNextClosestAnchor() {
      var anchor = this.getClosestAnchor();
      var next = anchor + 3;
      if (next > this.points.length - 3) next = 0;
      return next;
    }
  }, {
    key: "autoSetControlPoint",
    value: function autoSetControlPoint(anchorI, controlSpacing) {
      if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed) return;
      var anchorLeftI = this.loopIndex(anchorI - 3);
      var anchorRightI = this.loopIndex(anchorI + 3);
      var anchor = this.points[anchorI].pos;
      var anchorLeft = this.points[anchorLeftI].pos;
      var anchorRight = this.points[anchorRightI].pos;
      var V = this.pInst.constructor.Vector;
      var dispLeft = V.sub(V.copy(anchorLeft), anchor);
      var dispRight = V.sub(V.copy(anchorRight), anchor);
      var magLeft = dispLeft.mag();
      var magRight = dispRight.mag();
      dispLeft.normalize();
      dispRight.normalize();
      var dirLeft = V.sub(dispLeft, dispRight);
      var dirRight = V.sub(dispRight, dispLeft);
      dirLeft.setMag(magLeft * controlSpacing);
      dirRight.setMag(magRight * controlSpacing);
      this.points[this.loopIndex(anchorI - 1)].set(V.add(V.copy(anchor), dirLeft));
      this.points[this.loopIndex(anchorI + 1)].set(V.add(V.copy(anchor), dirRight));
    }
  }, {
    key: "autoSetEdgePoints",
    value: function autoSetEdgePoints(controlSpacing) {
      if (this.closed) return;
      var V = this.pInst.constructor.Vector;
      this.points[1].set(V.lerp(this.points[0].pos, this.points[2].pos, controlSpacing));
      this.points[this.points.length - 2].set(V.lerp(this.points[this.points.length - 1].pos, this.points[this.points.length - 3].pos, controlSpacing));
    }
  }, {
    key: "autoSetAllControlPoints",
    value: function autoSetAllControlPoints() {
      var controlSpacing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;
      for (var i = 0; i < this.points.length; i += 3) {
        this.autoSetControlPoint(i, controlSpacing);
      }
      this.autoSetEdgePoints(controlSpacing);
      this.setDimensions();
    }

    // --- Display -----------------------------------------------------------
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pInst.color("black");
      this.pInst.noStroke();
      this.pInst.fill(col);
      this.displayBezier();
      this.displayCalib();
    }
  }, {
    key: "displayCalib",
    value: function displayCalib() {
      if (this.pInst.isCalibratingMapper()) {
        this.pInst.strokeWeight(3);
        this.pInst.stroke(this.controlPointColor);
        this.pInst.fill(this.getMutedControlColor());
        this.displayBezier();
      }
    }

    /** Composite an *image* through the Bezier mask using the shader */
  }, {
    key: "displayTexture",
    value: function displayTexture(img) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var texW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var texH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      if (!this.isReady()) return;
      var buffer = this.pMapper.buffer;
      this.drawImage(img, buffer, x, y, texW, texH);
      this.displayGraphicsTexture(buffer);
      this.displayCalib();
    }

    /** Draw a *sketch* into the buffer and then composite it through the mask */
  }, {
    key: "displaySketch",
    value: function displaySketch(sketch) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var buffer = this.pMapper.buffer;
      buffer.push();
      buffer.translate(x, y);
      sketch(buffer);
      buffer.pop();
      this.displayGraphicsTexture(buffer);
    }

    /** Apply mask (bezBuffer) to pBuffer via shader, draw to screen */
  }, {
    key: "displayGraphicsTexture",
    value: function displayGraphicsTexture(pBuffer) {
      if (!this.isReady()) return;

      // update mask for current shape
      this.setDimensions();
      var pMask = this.pMapper.bezBuffer;
      var pOutput = this.pMapper.bufferWEBGL;

      // Lazily create and cache the shader
      if (!this.shaderProg) {
        var frag = "#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 vTexCoord;\nuniform sampler2D texMask;\nuniform sampler2D texImg;\n\nvoid main() {\n  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y); // flip Y\n  vec4 maskT = texture2D(texMask, uv);\n  vec4 imgT  = texture2D(texImg,  uv);\n\n  float gray = (maskT.r + maskT.g + maskT.b) / 3.0;\n  vec3 outRGB = imgT.rgb * gray;\n\n  gl_FragColor = vec4(outRGB, gray);\n}";
        var vert = "#ifdef GL_ES\nprecision mediump float;\n#endif\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vTexCoord = aTexCoord;\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // NDC\n  gl_Position = positionVec4;\n}";
        this.shaderProg = pOutput.createShader(vert, frag);
      }
      pOutput.clear();
      pOutput.setAttributes("alpha", true);
      pOutput.shader(this.shaderProg);
      this.shaderProg.setUniform("texMask", pMask);
      this.shaderProg.setUniform("texImg", pBuffer);
      pOutput.rect(0, 0, this.pInst.width, this.pInst.height);
      var _this$getBounds2 = this.getBounds(),
        x = _this$getBounds2.x,
        y = _this$getBounds2.y;
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.translate(x - this.bufferSpace, y - this.bufferSpace);
      this.pInst.image(pOutput, 0, 0);
      this.pInst.pop();
      this.displayCalib();
    }

    /** Draw img into pg; default size to intrinsic if not provided */
  }, {
    key: "drawImage",
    value: function drawImage(img, pg) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var texW = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var texH = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      if (!img || !pg) return;
      if (texW <= 0) texW = img.width;
      if (texH <= 0) texH = img.height;
      pg.push();
      pg.clear();
      pg.translate(x, y);
      pg.image(img, 0, 0, texW, texH);
      pg.pop();
    }

    /** Rasterize the white Bezier mask into the mask buffer */
  }, {
    key: "displayBezierPG",
    value: function displayBezierPG(pg) {
      var _this$getBounds3 = this.getBounds(),
        x = _this$getBounds3.x,
        y = _this$getBounds3.y;
      pg.push();
      pg.clear();
      pg.fill("white");
      pg.translate(-x, -y);
      pg.translate(this.bufferSpace, this.bufferSpace);
      pg.beginShape();
      pg.vertex(this.points[0].pos.x, this.points[0].pos.y);
      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        pg.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }
      pg.endShape();
      pg.pop();
    }

    /** Draw the path (no texture) in screen space for previews/calibration */
  }, {
    key: "displayBezier",
    value: function displayBezier() {
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.beginShape();
      this.pInst.vertex(this.points[0].pos.x, this.points[0].pos.y);
      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        this.pInst.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }
      this.pInst.endShape();
      this.pInst.pop();
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      var _this$pInst$isMovingP, _this$pInst;
      if (!((_this$pInst$isMovingP = (_this$pInst = this.pInst).isMovingPoints) !== null && _this$pInst$isMovingP !== void 0 && _this$pInst$isMovingP.call(_this$pInst))) return;
      var lineC = this.controlPointColor;
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      // if (!this.auto)
      var lighterLineC = this.pInst.lerpColor(lineC, this.pInst.color(255, 255, 255), 0.5);
      this.displayControlLines(lighterLineC);
      this.displayControlCircles(lineC, lighterLineC);
      this.pInst.pop();
    }
  }, {
    key: "displayControlLines",
    value: function displayControlLines(strokeC) {
      this.pInst.strokeWeight(2);
      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        this.pInst.stroke(strokeC);
        this.pInst.line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
        this.pInst.line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }
    }
  }, {
    key: "displayControlCircles",
    value: function displayControlCircles(anchorCol, lighterCol) {
      var i = 0;
      var index = this.getClosestAnchor();
      var nextIndex = this.getNextClosestAnchor();
      var _iterator3 = BezierMap_createForOfIteratorHelper(this.points),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;
          //   let col = anchorCol;
          //   if (i === index || i === nextIndex) col = this.pInst.color(255, 200, 200);
          p.displayControlCircle(anchorCol, lighterCol);
          i++;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    /** Polyline approximation of the curve, in local coords */
  }, {
    key: "getPolyline",
    value: function getPolyline() {
      var polyline = [];
      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        var steps = 4; // sampling density per segment
        for (var s = 0; s <= steps; s++) {
          var t = s / steps;
          var x = this.pInst.bezierPoint(seg[0].pos.x, seg[1].pos.x, seg[2].pos.x, seg[3].pos.x, t);
          var y = this.pInst.bezierPoint(seg[0].pos.y, seg[1].pos.y, seg[2].pos.y, seg[3].pos.y, t);
          polyline.push({
            x: x,
            y: y
          });
        }
      }
      return polyline;
    }

    /** Hit-test using the polyline and a ray cast in local space */
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var polyline = this.getPolyline();
      var mouse = this.getMouseCoords();
      return inside(mouse, polyline, {
        x: this.x,
        y: this.y
      });
    }
  }]);
}(Surface);

;// ./src/surfaces/LineMap.ts
function LineMap_typeof(o) { "@babel/helpers - typeof"; return LineMap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, LineMap_typeof(o); }
function LineMap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function LineMap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, LineMap_toPropertyKey(o.key), o); } }
function LineMap_createClass(e, r, t) { return r && LineMap_defineProperties(e.prototype, r), t && LineMap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function LineMap_callSuper(t, o, e) { return o = LineMap_getPrototypeOf(o), LineMap_possibleConstructorReturn(t, LineMap_isNativeReflectConstruct() ? Reflect.construct(o, e || [], LineMap_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function LineMap_possibleConstructorReturn(t, e) { if (e && ("object" == LineMap_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return LineMap_assertThisInitialized(t); }
function LineMap_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function LineMap_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (LineMap_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function LineMap_getPrototypeOf(t) { return LineMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, LineMap_getPrototypeOf(t); }
function LineMap_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && LineMap_setPrototypeOf(t, e); }
function LineMap_setPrototypeOf(t, e) { return LineMap_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, LineMap_setPrototypeOf(t, e); }
function LineMap_defineProperty(e, r, t) { return (r = LineMap_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function LineMap_toPropertyKey(t) { var i = LineMap_toPrimitive(t, "string"); return "symbol" == LineMap_typeof(i) ? i : i + ""; }
function LineMap_toPrimitive(t, r) { if ("object" != LineMap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != LineMap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// LineMap.ts



var LineMap = /*#__PURE__*/function (_Draggable) {
  function LineMap(x0, y0, x1, y1, id, pInst) {
    var _this;
    LineMap_classCallCheck(this, LineMap);
    _this = LineMap_callSuper(this, LineMap, [pInst, 0, 0]);
    LineMap_defineProperty(_this, "type", "LINE");
    LineMap_defineProperty(_this, "lineW", 10);
    LineMap_defineProperty(_this, "endCapsOn", true);
    // p5.Color
    LineMap_defineProperty(_this, "lastChecked", 0);
    LineMap_defineProperty(_this, "ang", 0);
    _this.id = id;
    _this.lineC = _this.pInst.color(255);
    _this.highlightColor = _this.pInst.color(0, 255, 0);
    _this.controlPointColor = _this.getLinearIdColor(_this.id);
    _this.p0 = new MovePoint(_this, x0, y0, _this.pInst);
    _this.p1 = new MovePoint(_this, x1, y1, _this.pInst);
    _this.leftToRight();

    // angle (used if needed for orientation)
    _this.ang = _this.pInst.atan2(_this.p0.y - _this.p1.y, _this.p0.x - _this.p1.x);
    if (_this.ang > _this.pInst.PI / 2) _this.ang -= 2 * _this.pInst.PI;
    return _this;
  }

  // ------------------------- Loading / Saving ----------------------------
  LineMap_inherits(LineMap, _Draggable);
  return LineMap_createClass(LineMap, [{
    key: "load",
    value: function load(json) {
      this.x = json.x;
      this.y = json.y;
      this.p0.x = json.x0 || 0;
      this.p0.y = json.y0 || 0;
      this.p1.x = json.x1 || 0;
      this.p1.y = json.y1 || 0;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        id: this.id,
        x: this.x,
        y: this.y,
        x0: this.p0.x,
        y0: this.p0.y,
        x1: this.p1.x,
        y1: this.p1.y
      };
    }

    // ------------------------------ Display --------------------------------
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lineC;
      var sw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineW;
      this.pInst.strokeWeight(sw);
      this.pInst.stroke(col);
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
      this.drawEndCaps(this.p0, this.p1, col, col, sw);
      this.pInst.pop();
    }

    /** Pulses from the center toward endpoints */
  }, {
    key: "displayCenterPulse",
    value: function displayCenterPulse(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      var sw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineW;
      var midX = (this.p0.x + this.p1.x) / 2;
      var midY = (this.p0.y + this.p1.y) / 2;
      var x0 = this.pInst.lerp(midX, this.p0.x, per);
      var y0 = this.pInst.lerp(midY, this.p0.y, per);
      var x1 = this.pInst.lerp(midX, this.p1.x, per);
      var y1 = this.pInst.lerp(midY, this.p1.y, per);
      this.pInst.strokeWeight(sw);
      this.pInst.stroke(col);
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.line(x0, y0, x1, y1);
      this.drawEndCaps({
        x: x0,
        y: y0
      }, {
        x: x1,
        y: y1
      }, col, col, sw);
      this.pInst.pop();
    }

    /** Draws the line from p0 to a percent along toward p1 */
  }, {
    key: "displayPercent",
    value: function displayPercent(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      var sw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineW;
      var t = this.pInst.constrain(per, 0, 1);
      var x = this.pInst.lerp(this.p0.x, this.p1.x, t);
      var y = this.pInst.lerp(this.p0.y, this.p1.y, t);
      this.pInst.strokeWeight(sw);
      this.pInst.stroke(col);
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.line(this.p0.x, this.p0.y, x, y);
      this.drawEndCaps(this.p0, {
        x: x,
        y: y
      }, col, col, sw);
      this.pInst.pop();
    }

    /** Keeps the whole line but varies stroke width by percent */
  }, {
    key: "displayPercentWidth",
    value: function displayPercentWidth(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      var p = this.pInst.constrain(per, 0, 1);
      var sw = this.pInst.map(p, 0, 1, 0, 10);
      this.display(col, sw);
    }
  }, {
    key: "displayNone",
    value: function displayNone() {
      this.display(this.pInst.color(0));
    }

    /** HSB hue cycle */
  }, {
    key: "displayRainbowCycle",
    value: function displayRainbowCycle() {
      this.pInst.colorMode(this.pInst.HSB, 255);
      var col = this.pInst.color(this.pInst.frameCount % 255, 255, 255);
      this.display(col);
      this.pInst.colorMode(this.pInst.RGB, 255);
    }

    /** Swept gradient segments along the line */
  }, {
    key: "displayGradientLine",
    value: function displayGradientLine(c1, c2, per) {
      var phase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var flip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      // 'flip' kept for API compatibility (could invert gradient if desired)
      var t = (per + phase) % 1;
      var spacing = 1.0 / Math.max(1, this.pInst.height); // density guard

      for (var i = 0; i < 1.0; i += spacing) {
        var grad = (i / 2 + t) % 1;
        var col = this.get2CycleColor(c1, c2, flip ? 1 - grad : grad);
        this.displaySegment(i, spacing, col);
      }
    }
  }, {
    key: "getCalibrationColor",
    value: function getCalibrationColor() {
      this.pInst.colorMode(this.pInst.HSB, 255);
      var h = this.pInst.hue(this.controlPointColor);
      var col = this.pInst.color(h, 180, 255);
      this.pInst.colorMode(this.pInst.RGB);
      return col;
    }
  }, {
    key: "getLinearIdColor",
    value: function getLinearIdColor(id) {
      var n = typeof id === "number" ? id : this.hashString(id.toString());
      this.pInst.colorMode(this.pInst.HSB, 255);
      var h = n * 15 % 255;
      var col = this.pInst.color(h, 255, 255);
      this.pInst.colorMode(this.pInst.RGB);
      return col;
    }

    // --------------------------- Display helpers ---------------------------
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      if (this.isMouseOver()) this.display(this.pInst.color(255));else this.display(this.getCalibrationColor());
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.p0.display(this.controlPointColor);
      this.p1.display(this.controlPointColor);
      this.pInst.pop();
    }
  }, {
    key: "setEndCapsOn",
    value: function setEndCapsOn() {
      this.endCapsOn = true;
    }
  }, {
    key: "setEndCapsOff",
    value: function setEndCapsOff() {
      this.endCapsOn = false;
    }
  }, {
    key: "drawEndCaps",
    value: function drawEndCaps(p0, p1) {
      var col0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineC;
      var col1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.lineC;
      var sw = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.lineW;
      if (!this.endCapsOn) return;
      if (this.pInst.dist(p0.x, p0.y, p1.x, p1.y) <= 1) return;
      this.pInst.noStroke();
      this.pInst.fill(col0);
      this.pInst.ellipse(p0.x, p0.y, sw);
      this.pInst.fill(col1);
      this.pInst.ellipse(p1.x, p1.y, sw);
    }

    /** Draws a segment between t in [startPer, startPer+sizePer] */
  }, {
    key: "displaySegment",
    value: function displaySegment(startPer, sizePer) {
      var col = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineC;
      var sw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.lineW;
      var t0 = this.pInst.constrain(startPer, 0, 1);
      var t1 = this.pInst.constrain(startPer + sizePer, 0, 1);
      var x0 = this.pInst.lerp(this.p0.x, this.p1.x, t0);
      var y0 = this.pInst.lerp(this.p0.y, this.p1.y, t0);
      var x1 = this.pInst.lerp(this.p0.x, this.p1.x, t1);
      var y1 = this.pInst.lerp(this.p0.y, this.p1.y, t1);
      this.pInst.strokeWeight(sw);
      this.pInst.stroke(col);
      this.pInst.push();
      this.pInst.translate(this.x, this.y);
      this.pInst.line(x0, y0, x1, y1);
      this.drawEndCaps({
        x: x0,
        y: y0
      }, {
        x: x1,
        y: y1
      }, col, col, sw);
      this.pInst.pop();
    }

    // ------------------------------ Color utils ----------------------------
  }, {
    key: "get2CycleColor",
    value: function get2CycleColor(c1, c2, per) {
      var t = this.pInst.constrain(per, 0, 1) * 2;
      if (t < 1) return this.pInst.lerpColor(c1, c2, t);
      return this.pInst.lerpColor(c2, c1, this.pInst.map(t, 1, 2, 0, 1));
    }
  }, {
    key: "get3CycleColor",
    value: function get3CycleColor(c1, c2, per) {
      var t = this.pInst.constrain(per, 0, 1) * 3;
      if (t < 1) return this.pInst.lerpColor(c1, c2, t);
      if (t < 2) return this.pInst.lerpColor(c2, c1, this.pInst.map(t, 1, 2, 1, 0));
      return this.pInst.lerpColor(c1, c2, this.pInst.map(t, 2, 3, 1, 0));
    }
  }, {
    key: "getPointHighlight",
    value: function getPointHighlight(_p) {
      // You can enhance hover visuals here if desired.
      this.pInst.stroke(255, 0, 0);
    }

    // ---------------------------- Hit detection ----------------------------

    /** Local-space hit test against the line (distance-to-segment) */
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var _this$getMouseCoords = this.getMouseCoords(),
        mx = _this$getMouseCoords.x,
        my = _this$getMouseCoords.y;
      var px = mx - this.x;
      var py = my - this.y;
      var x1 = this.p0.x,
        y1 = this.p0.y;
      var x2 = this.p1.x,
        y2 = this.p1.y;
      var lineLen = this.pInst.dist(x1, y1, x2, y2);
      if (lineLen < 1e-6) return false;

      // project point onto segment and clamp
      var t = this.clamp(this.projectParam(px, py, x1, y1, x2, y2), 0, 1);
      var cx = this.pInst.lerp(x1, x2, t);
      var cy = this.pInst.lerp(y1, y2, t);

      // tolerance scales with lineW
      var tol = Math.max(2, this.lineW * 0.6);
      var distToLine = this.pInst.dist(px, py, cx, cy);
      var isOver = distToLine <= tol;
      return isOver;
    }
  }, {
    key: "isMouseOverCallback",
    value: function isMouseOverCallback(callback) {
      if (this.isMouseOver()) callback(this);
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      if (this.p0.isMouseOver()) {
        this.p0.startDrag();
        return this.p0;
      }
      if (this.p1.isMouseOver()) {
        this.p1.startDrag();
        return this.p1;
      }
      return null;
    }

    // ------------------------------ Utilities ------------------------------
  }, {
    key: "leftToRight",
    value: function leftToRight() {
      if (this.p0.x > this.p1.x) {
        var tmp = this.pInst.createVector(this.p0.x, this.p0.y);
        this.p0.set(this.p1);
        this.p1.set(tmp);
      }
    }
  }, {
    key: "rightToLeft",
    value: function rightToLeft() {
      if (this.p0.x < this.p1.x) {
        var tmp = this.pInst.createVector(this.p0.x, this.p0.y);
        this.p0.set(this.p1);
        this.p1.set(tmp);
      }
    }
  }, {
    key: "displayNumber",
    value: function displayNumber() {
      this.pInst.push();
      this.pInst.noStroke();
      this.pInst.fill(255);
      var mx = (this.p0.x + this.p1.x) / 2;
      var my = (this.p0.y + this.p1.y) / 2;
      this.pInst.text(this.id.toString(), this.x + mx + 10, this.y + my);
      this.pInst.pop();
    }

    // param of projection of P onto AB
  }, {
    key: "projectParam",
    value: function projectParam(px, py, ax, ay, bx, by) {
      var vx = bx - ax,
        vy = by - ay;
      var wx = px - ax,
        wy = py - ay;
      var vv = vx * vx + vy * vy;
      if (vv <= 1e-12) return 0;
      return (wx * vx + wy * vy) / vv;
    }
  }, {
    key: "clamp",
    value: function clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v));
    }
  }, {
    key: "hashString",
    value: function hashString(s) {
      // simple, stable string hash for color variation
      var h = 2166136261 >>> 0;
      for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    }
  }]);
}(Draggable);

;// ./src/ProjectionMapper.ts
function ProjectionMapper_typeof(o) { "@babel/helpers - typeof"; return ProjectionMapper_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ProjectionMapper_typeof(o); }
function ProjectionMapper_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = ProjectionMapper_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ProjectionMapper_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return ProjectionMapper_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? ProjectionMapper_arrayLikeToArray(r, a) : void 0; } }
function ProjectionMapper_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ProjectionMapper_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ProjectionMapper_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ProjectionMapper_toPropertyKey(o.key), o); } }
function ProjectionMapper_createClass(e, r, t) { return r && ProjectionMapper_defineProperties(e.prototype, r), t && ProjectionMapper_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ProjectionMapper_defineProperty(e, r, t) { return (r = ProjectionMapper_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function ProjectionMapper_toPropertyKey(t) { var i = ProjectionMapper_toPrimitive(t, "string"); return "symbol" == ProjectionMapper_typeof(i) ? i : i + ""; }
function ProjectionMapper_toPrimitive(t, r) { if ("object" != ProjectionMapper_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ProjectionMapper_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ProjectionMapper.ts








// ---- Minimal p5 typings (relaxed) ----

// ---- Surface/Shape interfaces used here ----
var ProjectionMapper = /*#__PURE__*/function () {
  function ProjectionMapper() {
    ProjectionMapper_classCallCheck(this, ProjectionMapper);
    // drawing buffers
    // 2D for composing textures
    // WEBGL output for shader comp
    // mask for Bezier
    // shapes
    ProjectionMapper_defineProperty(this, "surfaces", []);
    ProjectionMapper_defineProperty(this, "lines", []);
    // interaction
    ProjectionMapper_defineProperty(this, "dragged", null);
    ProjectionMapper_defineProperty(this, "selected", null);
    ProjectionMapper_defineProperty(this, "pMousePressed", false);
    ProjectionMapper_defineProperty(this, "moveMode", "ALL");
    // state & env
    ProjectionMapper_defineProperty(this, "calibrate", false);
    ProjectionMapper_defineProperty(this, "pInst", null);
    // shaders
    ProjectionMapper_defineProperty(this, "bezShader", null);
    ProjectionMapper_defineProperty(this, "bezierShaderLoaded", false);
  }

  // --------------------------- Lifecycle ---------------------------
  return ProjectionMapper_createClass(ProjectionMapper, [{
    key: "preload",
    value: function preload(shader) {
      this.bezShader = shader;
      this.bezierShaderLoaded = true;
    }
  }, {
    key: "init",
    value: function init(w, h) {
      if (!this.pInst) throw new Error("ProjectionMapper.init: pInst not set");
      if (this.buffer && this.bezBuffer && this.bufferWEBGL) return; // idempotent

      this.bufferWEBGL = this.pInst.createGraphics(w, h, this.pInst.WEBGL);
      this.buffer = this.pInst.createGraphics(w, h);
      this.bezBuffer = this.pInst.createGraphics(w, h);

      // if no external shader was preloaded, make one locally
      if (!this.bezierShaderLoaded) this.initPMapperShaderStr();
    }

    // build shader from strings (fallback)
  }, {
    key: "initPMapperShaderStr",
    value: function initPMapperShaderStr() {
      var frag = "\n      #ifdef GL_ES\n      precision mediump float;\n      #endif\n      varying vec2 vTexCoord;\n      uniform sampler2D texMask;\n      uniform sampler2D texImg;\n      void main() {\n        vec2 uv = vTexCoord;\n        uv.y = 1.0 - uv.y;\n        vec4 maskT = texture2D(texMask, uv);\n        vec4 imgT = texture2D(texImg, uv);\n        float gray = (maskT.r + maskT.g + maskT.b) / 3.0;\n        vec3 thresh = imgT.rgb * gray;\n        gl_FragColor = vec4(thresh, gray);\n      }";
      var vert = "\n      #ifdef GL_ES\n      precision mediump float;\n      #endif\n      attribute vec3 aPosition;\n      attribute vec2 aTexCoord;\n      varying vec2 vTexCoord;\n      void main() {\n        vTexCoord = aTexCoord;\n        vec4 p = vec4(aPosition, 1.0);\n        p.xy = p.xy * 2.0 - 1.0;\n        gl_Position = p;\n      }";
      this.bezShader = this.bufferWEBGL.createShader(vert, frag);
      this.bezierShaderLoaded = true;
    }

    // --------------------------- Factories ---------------------------

    /** Creates and registers a new quad surface. */
  }, {
    key: "createQuadMap",
    value: function createQuadMap(w, h) {
      var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
      if (!this.pInst || !this.buffer) throw new Error("ProjectionMapper not initialized");
      var s = new QuadMap(this.surfaces.length, w, h, res, this.buffer, this.pInst);
      this.surfaces.push(s);
      return s;
    }

    /** Creates and registers a new triangle surface. */
  }, {
    key: "createTriMap",
    value: function createTriMap(w, h) {
      var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
      if (!this.pInst || !this.buffer) throw new Error("ProjectionMapper not initialized");
      var s = new TriMap(this.surfaces.length, w, h, res, this.buffer, this.pInst);
      this.surfaces.push(s);
      return s;
    }

    /** Creates and registers a new poly surface. */
  }, {
    key: "createPolyMap",
    value: function createPolyMap() {
      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
      if (!this.pInst || !this.buffer) throw new Error("ProjectionMapper not initialized");
      var n = Math.max(3, Math.floor(numPoints));
      var s = new PolyMap(this.surfaces.length, n, this.buffer, this.pInst);
      this.surfaces.push(s);
      return s;
    }

    /** Creates and registers a new Bezier surface. */
  }, {
    key: "createBezierMap",
    value: function createBezierMap() {
      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
      if (!this.pInst) throw new Error("ProjectionMapper not initialized");
      var bez = new BezierMap(this.surfaces.length, numPoints, this, this.pInst);
      this.surfaces.push(bez);
      return bez;
    }

    /** Creates and registers a new line. */
  }, {
    key: "createLineMap",
    value: function createLineMap() {
      var x0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var x1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      if (!this.pInst) throw new Error("ProjectionMapper not initialized");
      // default stagger
      if (x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
        x1 = 200;
        y0 = 30 * this.lines.length;
        y1 = 30 * this.lines.length;
      }
      var l = new LineMap(x0, y0, x1, y1, this.lines.length, this.pInst);
      this.lines.push(l);
      return l;
    }

    // --------------------------- Interaction ---------------------------
  }, {
    key: "onClick",
    value: function onClick() {
      if (!this.calibrate) return;
      if (this.moveMode === "SURFACES") {
        this.checkSurfacesClick();
      } else if (this.moveMode === "POINTS") {
        this.checkPointsClick();
      } else {
        if (!this.checkPointsClick()) this.checkSurfacesClick();
      }
    }
  }, {
    key: "moveSurfaces",
    value: function moveSurfaces() {
      this.moveMode = "SURFACES";
    }
  }, {
    key: "moveControlPoints",
    value: function moveControlPoints() {
      this.moveMode = "POINTS";
    }
  }, {
    key: "moveAll",
    value: function moveAll() {
      this.moveMode = "ALL";
    }
  }, {
    key: "isMovingPoints",
    value: function isMovingPoints() {
      return this.moveMode === "ALL" || this.moveMode === "POINTS";
    }
  }, {
    key: "checkSurfacesClick",
    value: function checkSurfacesClick() {
      // lines (topmost-first)
      for (var i = this.lines.length - 1; i >= 0; i--) {
        var s = this.lines[i];
        this.dragged = s.selectDraggable();
        if (this.dragged) return true;
      }
      // surfaces
      for (var _i = this.surfaces.length - 1; _i >= 0; _i--) {
        var _s = this.surfaces[_i];
        this.dragged = _s.selectDraggable();
        if (this.dragged) {
          this.selected = _s;
          return true;
        }
      }
      this.selected = null;
      return false;
    }
  }, {
    key: "checkPointsClick",
    value: function checkPointsClick() {
      // lines
      for (var i = this.lines.length - 1; i >= 0; i--) {
        var s = this.lines[i];
        this.dragged = s.selectPoints();
        if (this.dragged) return true;
      }
      // surfaces
      for (var _i2 = this.surfaces.length - 1; _i2 >= 0; _i2--) {
        var _s2 = this.surfaces[_i2];
        this.dragged = _s2.selectPoints();
        if (this.dragged) {
          this.selected = _s2;
          return true;
        }
      }
      this.selected = null;
      return false;
    }
  }, {
    key: "onDrag",
    value: function onDrag() {
      if (this.dragged && this.dragged.moveTo) this.dragged.moveTo();
    }
  }, {
    key: "onRelease",
    value: function onRelease() {
      this.dragged = null;
    }
  }, {
    key: "isDragging",
    value: function isDragging(surface) {
      return this.dragged === surface;
    }
  }, {
    key: "updateEvents",
    value: function updateEvents() {
      if (!this.pInst) return;
      if (this.pInst.mouseIsPressed) {
        if (!this.pMousePressed) this.onClick();else this.onDrag();
      } else {
        if (this.pMousePressed) this.onRelease();
      }
      this.pMousePressed = this.pInst.mouseIsPressed;
    }

    // --------------------------- Loading/Saving ---------------------------
  }, {
    key: "load",
    value: function load() {
      var _this = this;
      var filepath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "maps/map.json";
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      if (!this.pInst) throw new Error("ProjectionMapper not initialized");
      this.pInst.loadJSON(filepath, function (json) {
        _this.loadedJson(json);
        if (callback) callback();
      }, function (err) {
        return console.warn("error loading ".concat(filepath), err);
      });
    }
  }, {
    key: "loadedJson",
    value: function loadedJson(json) {
      if (json.surfaces) this.loadSurfaces(json.surfaces);
      if (json.lines) this.loadLines(json.lines);
    }
  }, {
    key: "loadSurfaces",
    value: function loadSurfaces(jSurfaces) {
      var _this2 = this;
      if (jSurfaces.length !== this.surfaces.length) {
        console.warn("json has ".concat(jSurfaces.length, " surfaces but memory has ").concat(this.surfaces.length, " surfaces"));
      }
      var filterBy = function filterBy(t) {
        return jSurfaces.filter(function (s) {
          return s.type === t;
        });
      };
      var mapBy = function mapBy(t) {
        return _this2.surfaces.filter(function (s) {
          return s.type === t;
        });
      };
      var loadTyped = function loadTyped(t) {
        var js = filterBy(t);
        var ms = mapBy(t);
        var i = 0;
        while (i < js.length && i < ms.length) {
          var _surface = ms[i];
          var j = js[i];
          if (_surface.isEqual({
            id: j.id,
            type: j.type
          })) {
            _surface.load(j);
          } else console.warn("mismatch between calibration surface types/ids");
          i++;
        }
      };
      loadTyped("TRI");
      loadTyped("QUAD");
      loadTyped("BEZ");
      loadTyped("POLY");
    }
  }, {
    key: "loadLines",
    value: function loadLines(jLines) {
      if (jLines.length !== this.lines.length) {
        console.warn("json has ".concat(jLines.length, " lines but memory has ").concat(this.lines.length, " lines"));
      }
      for (var i = 0; i < Math.min(jLines.length, this.lines.length); i++) {
        this.lines[i].load(jLines[i]);
      }
    }
  }, {
    key: "save",
    value: function save() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "map.json";
      if (!this.pInst) return;
      var json = {
        surfaces: this.surfaces.map(function (s) {
          return s.toJSON();
        }).filter(Boolean),
        lines: this.lines.map(function (l) {
          return l.toJSON();
        })
      };
      this.pInst.saveJSON(json, filename);
    }

    // --------------------------- Calibration ---------------------------
  }, {
    key: "startCalibration",
    value: function startCalibration() {
      this.calibrate = true;
    }
  }, {
    key: "stopCalibration",
    value: function stopCalibration() {
      this.calibrate = false;
    }
  }, {
    key: "toggleCalibration",
    value: function toggleCalibration() {
      this.calibrate = !this.calibrate;
    }

    // --------------------------- Rendering hooks ---------------------------
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      if (!this.calibrate) return;
      var _iterator = ProjectionMapper_createForOfIteratorHelper(this.surfaces),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var s = _step.value;
          if (s instanceof Surface) s.displayControlPoints();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = ProjectionMapper_createForOfIteratorHelper(this.lines),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var l = _step2.value;
          l.displayCalibration();
          l.displayControlPoints();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    // small util exposed
  }, {
    key: "getOscillator",
    value: function getOscillator(seconds) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (!this.pInst) return 0;
      return getPercentWave(this.pInst, seconds, offset);
    }

    // shader access for BezierMap
  }, {
    key: "getBezierShader",
    value: function getBezierShader() {
      return this.bezShader;
    }
  }]);
}();
var pMapper = new ProjectionMapper();

// --------------------------- p5 Integration ---------------------------

p5.prototype.createProjectionMapper = function (pInst, w, h) {
  var W = w !== null && w !== void 0 ? w : pInst.width;
  var H = h !== null && h !== void 0 ? h : pInst.height;
  pMapper.pInst = pInst;
  pMapper.init(W, H);
  return pMapper;
};
p5.prototype.isCalibratingMapper = function () {
  return pMapper.calibrate;
};
p5.prototype.isMovingPoints = function () {
  return pMapper.isMovingPoints();
};
p5.prototype.isDragging = function (surface) {
  return pMapper.isDragging(surface);
};
p5.prototype.initPMapperShader = function () {
  var filePath = "https://cdn.statically.io/gh/jdeboi/p5.mapper/main/src/surfaces/Bezier/shader";
  this.loadShader(filePath + ".vert", filePath + ".frag", function (bezShader) {
    return pMapper.preload(bezShader);
  });
};

// Use a single 'post' hook to avoid overriding each other
p5.prototype.registerMethod("post", function () {
  pMapper.displayControlPoints();
  pMapper.updateEvents();
});
/* harmony default export */ const src_ProjectionMapper = (pMapper);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=p5.mapper.js.map