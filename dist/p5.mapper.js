(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["p5.mapper"] = factory();
	else
		root["p5.mapper"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/perspective/numeric.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

    for (k = j; k !== n; ++k) {
      Aj[k] /= x;
    }

    for (k = n - 1; k !== -1; --k) {
      Ij[k] /= x;
    }

    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i];
        Ii = I[i];
        x = Ai[j];

        for (k = j + 1; k !== n; ++k) {
          Ai[k] -= Aj[k] * x;
        }

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

  for (j = 0; j < n; j++) {
    ret[j] = Array(m);
  }

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
;// CONCATENATED MODULE: ./src/perspective/PerspT.js


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
  if (typeof window !== 'undefined' && window === this || this === undefined) {
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
;// CONCATENATED MODULE: ./src/helpers/helpers.js
function inside(point, polyon, offset) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  var x = point.x,
      y = point.y;
  var inside = false;

  for (var i = 0, j = polyon.length - 1; i < polyon.length; j = i++) {
    var xi = polyon[i].x + offset.x,
        yi = polyon[i].y + offset.y;
    var xj = polyon[j].x + offset.x,
        yj = polyon[j].y + offset.y;
    var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
;
function getRandomizedColor(id, type) {
  var shapeOffset = type ? type[0].charCodeAt(0) : 2;
  var offset = (1 + id) * 88 + shapeOffset * 80; // a kind of wack hash function (?) for randomized color
  // based on parent (so all 4 control points are same color)

  colorMode(HSB, 255);
  var col = color(offset % 255, 255, 255);
  colorMode(RGB, 255);
  return col;
}
function getPercent() {
  var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  seconds = constrain(seconds, .1, 100); // 60 frames / second

  var per = frameCount / (60 * seconds) % 1; // console.log(frameCount / (60*seconds), per)

  return per;
}
function getPercentWave() {
  var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  seconds = constrain(seconds, .01, 100);
  var per = .5 + .5 * sin(frameCount / (60 * seconds) * 2 * PI + offset);
  return per;
}
function isWEBGL() {
  return drawingContext instanceof WebGLRenderingContext;
}
;// CONCATENATED MODULE: ./src/surfaces/MovePoint.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var MovePoint = /*#__PURE__*/function () {
  function MovePoint(parent, x, y) {
    _classCallCheck(this, MovePoint);

    this.x = x;
    this.type = "CPOINT";
    this.y = y;
    this.r = 8;
    this.isControlPoint = false;
    this.parent = parent;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.clickX = 0;
    this.clickY = 0;
    this.col = color(0, 255, 255);
  }

  _createClass(MovePoint, [{
    key: "isMouseOver",
    value: function isMouseOver() {
      var mx = mouseX;
      var my = mouseY;

      if (isWEBGL()) {
        mx -= width / 2;
        my -= height / 2;
      }

      var d = dist(mx, my, this.x + this.parent.x, this.y + this.parent.y);
      return d < this.r;
    }
  }, {
    key: "set",
    value: function set(point) {
      this.x = point.x;
      this.y = point.y;
    }
  }, {
    key: "startDrag",
    value: function startDrag() {
      this.xStartDrag = this.x;
      this.yStartDrag = this.y;
      this.clickX = mouseX;
      this.clickY = mouseY;
    }
  }, {
    key: "moveToMouse",
    value: function moveToMouse() {
      this.x = mouseX - width / 2;
      this.y = mouseY - height / 2;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      this.x = this.xStartDrag + mouseX - this.clickX;
      this.y = this.yStartDrag + mouseY - this.clickY;
    }
  }, {
    key: "setControlPoint",
    value: function setControlPoint(cp) {
      this.isControlPoint = cp;
    }
  }, {
    key: "interpolateBetween",
    value: function interpolateBetween(start, end, f) {
      this.x = start.x + (end.x - start.x) * f;
      this.y = start.y + (end.y - start.y) * f;
    }
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.col;

      if (isMovingPoints()) {
        var c = col;

        if (this.isMouseOver()) {
          c = color(255);
        } // c = color(255);


        push();
        translate(0, 0, 5);
        stroke(c);
        strokeWeight(2);
        noFill();
        ellipse(this.x, this.y, this.r * 2);
        fill(c);
        ellipse(this.x, this.y, this.r);
        pop();
      }
    }
  }]);

  return MovePoint;
}();

/* harmony default export */ const surfaces_MovePoint = (MovePoint);
;// CONCATENATED MODULE: ./src/surfaces/MeshPoint.js
function MeshPoint_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MeshPoint_typeof = function _typeof(obj) { return typeof obj; }; } else { MeshPoint_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MeshPoint_typeof(obj); }

function MeshPoint_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MeshPoint_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MeshPoint_createClass(Constructor, protoProps, staticProps) { if (protoProps) MeshPoint_defineProperties(Constructor.prototype, protoProps); if (staticProps) MeshPoint_defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (MeshPoint_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var MeshPoint = /*#__PURE__*/function (_MovePoint) {
  _inherits(MeshPoint, _MovePoint);

  var _super = _createSuper(MeshPoint);

  function MeshPoint(parent, x, y, u, v) {
    var _this;

    MeshPoint_classCallCheck(this, MeshPoint);

    _this = _super.call(this, parent, x, y);
    _this.u = u;
    _this.v = v;
    return _this;
  }

  MeshPoint_createClass(MeshPoint, [{
    key: "set",
    value: function set(point) {
      _get(_getPrototypeOf(MeshPoint.prototype), "set", this).call(this, point);

      this.u = point.u;
      this.v = point.v;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      _get(_getPrototypeOf(MeshPoint.prototype), "moveTo", this).call(this);

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
      return new MeshPoint(this.parent, nX, nY, 0, 0);
    }
  }]);

  return MeshPoint;
}(surfaces_MovePoint);

/* harmony default export */ const surfaces_MeshPoint = (MeshPoint);
;// CONCATENATED MODULE: ./src/surfaces/Draggable.js
function Draggable_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Draggable_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Draggable_createClass(Constructor, protoProps, staticProps) { if (protoProps) Draggable_defineProperties(Constructor.prototype, protoProps); if (staticProps) Draggable_defineProperties(Constructor, staticProps); return Constructor; }

var Draggable = /*#__PURE__*/function () {
  function Draggable() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    Draggable_classCallCheck(this, Draggable);

    this.x = x;
    this.y = y;
    this.clickX = 0;
    this.clickY = 0;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
  }

  Draggable_createClass(Draggable, [{
    key: "startDrag",
    value: function startDrag() {
      this.xStartDrag = this.x;
      this.yStartDrag = this.y;
      this.clickX = mouseX;
      this.clickY = mouseY;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      this.x = this.xStartDrag + mouseX - this.clickX;
      this.y = this.yStartDrag + mouseY - this.clickY;
    }
  }]);

  return Draggable;
}();

/* harmony default export */ const surfaces_Draggable = (Draggable);
;// CONCATENATED MODULE: ./src/surfaces/Surface.js


function Surface_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Surface_typeof = function _typeof(obj) { return typeof obj; }; } else { Surface_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Surface_typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Surface_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Surface_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Surface_createClass(Constructor, protoProps, staticProps) { if (protoProps) Surface_defineProperties(Constructor.prototype, protoProps); if (staticProps) Surface_defineProperties(Constructor, staticProps); return Constructor; }

function Surface_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) Surface_setPrototypeOf(subClass, superClass); }

function Surface_setPrototypeOf(o, p) { Surface_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return Surface_setPrototypeOf(o, p); }

function Surface_createSuper(Derived) { var hasNativeReflectConstruct = Surface_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Surface_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Surface_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Surface_possibleConstructorReturn(this, result); }; }

function Surface_possibleConstructorReturn(self, call) { if (call && (Surface_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return Surface_assertThisInitialized(self); }

function Surface_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function Surface_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function Surface_getPrototypeOf(o) { Surface_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return Surface_getPrototypeOf(o); }




var Surface = /*#__PURE__*/function (_Draggable) {
  Surface_inherits(Surface, _Draggable);

  var _super = Surface_createSuper(Surface);

  // since there's a limit on WEBGL context
  function Surface(id, w, h, res, type, buffer) {
    var _this;

    Surface_classCallCheck(this, Surface);

    _this = _super.call(this, 0, 0); // https://github.com/processing/p5.js/issues/3736
    // let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
    // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);
    // TODO - think about size of surface...

    _this.width = constrain(w, 0, width);
    _this.height = constrain(h, 0, height);
    _this.id = id;
    _this.res = Math.floor(res);
    _this.type = type;
    _this.controlPointColor = getRandomizedColor(_this.id, _this.type);
    _this.buffer = buffer;
    return _this;
  }

  Surface_createClass(Surface, [{
    key: "getMutedControlColor",
    value: function getMutedControlColor() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      return color(red(col), green(col), blue(col), 50);
    }
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : color('black');
      this.buffer.background(col);
      this.displayTexture(this.buffer);
    } // override with geometry specifics

  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;
      console.warn("should be overriding with specific geometry...");
    }
  }, {
    key: "displaySketch",
    value: function displaySketch(sketch) {
      this.buffer.clear();
      this.buffer.push(); // draw all textures from top left of surface

      sketch(this.buffer);
      this.buffer.pop();
      this.displayTexture(this.buffer);
    }
  }, {
    key: "displayTexture",
    value: function displayTexture(tex) {
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;
      push();
      translate(this.x, this.y);
      texture(tex);
      textureMode(IMAGE);
      this.displaySurface(true, tX, tY, tW, tH);

      if (isCalibratingMapper()) {
        this.displayCalibration();
      }

      pop();
    }
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      push(); // TODO -
      // why translate??
      // to do with the way lines overlap in z dimension?
      // translate(0, 0, 3); 

      this.displayOutline();
      pop();
    }
  }, {
    key: "displayOutline",
    value: function displayOutline() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      strokeWeight(3);
      stroke(col);
      fill(this.getMutedControlColor());
      this.displaySurface(false);
    }
  }, {
    key: "isEqual",
    value: function isEqual(json) {
      return json.id === this.id && json.type === this.type;
    }
  }, {
    key: "getBounds",
    value: function getBounds(points) {
      var minX = Math.floor(Math.min.apply(Math, _toConsumableArray(points.map(function (pt) {
        return pt.x;
      }))));
      var minY = Math.floor(Math.min.apply(Math, _toConsumableArray(points.map(function (pt) {
        return pt.y;
      }))));
      var maxX = Math.floor(Math.max.apply(Math, _toConsumableArray(points.map(function (pt) {
        return pt.x;
      }))));
      var maxY = Math.floor(Math.max.apply(Math, _toConsumableArray(points.map(function (pt) {
        return pt.y;
      }))));
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY
      };
    }
  }, {
    key: "setDimensions",
    value: function setDimensions(points) {
      var _this$getBounds = this.getBounds(points),
          w = _this$getBounds.w,
          h = _this$getBounds.h;

      this.width = w;
      this.height = h;
    }
  }]);

  return Surface;
}(surfaces_Draggable); // TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);


/* harmony default export */ const surfaces_Surface = (Surface);
;// CONCATENATED MODULE: ./src/surfaces/CornerPinSurface.js
function CornerPinSurface_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { CornerPinSurface_typeof = function _typeof(obj) { return typeof obj; }; } else { CornerPinSurface_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return CornerPinSurface_typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = CornerPinSurface_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function CornerPinSurface_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CornerPinSurface_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CornerPinSurface_arrayLikeToArray(o, minLen); }

function CornerPinSurface_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CornerPinSurface_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function CornerPinSurface_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function CornerPinSurface_createClass(Constructor, protoProps, staticProps) { if (protoProps) CornerPinSurface_defineProperties(Constructor.prototype, protoProps); if (staticProps) CornerPinSurface_defineProperties(Constructor, staticProps); return Constructor; }

function CornerPinSurface_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) CornerPinSurface_setPrototypeOf(subClass, superClass); }

function CornerPinSurface_setPrototypeOf(o, p) { CornerPinSurface_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return CornerPinSurface_setPrototypeOf(o, p); }

function CornerPinSurface_createSuper(Derived) { var hasNativeReflectConstruct = CornerPinSurface_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = CornerPinSurface_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = CornerPinSurface_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return CornerPinSurface_possibleConstructorReturn(this, result); }; }

function CornerPinSurface_possibleConstructorReturn(self, call) { if (call && (CornerPinSurface_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return CornerPinSurface_assertThisInitialized(self); }

function CornerPinSurface_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function CornerPinSurface_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function CornerPinSurface_getPrototypeOf(o) { CornerPinSurface_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return CornerPinSurface_getPrototypeOf(o); }




var CornerPinSurface = /*#__PURE__*/function (_Surface) {
  CornerPinSurface_inherits(CornerPinSurface, _Surface);

  var _super = CornerPinSurface_createSuper(CornerPinSurface);

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
  function CornerPinSurface(id, w, h, res, type, buffer) {
    var _this;

    CornerPinSurface_classCallCheck(this, CornerPinSurface);

    _this = _super.call(this, id, w, h, res, type, buffer);
    _this.perspT = null;

    _this.initMesh();

    _this.calculateMesh();

    return _this;
  }

  CornerPinSurface_createClass(CornerPinSurface, [{
    key: "initMesh",
    value: function initMesh() {
      this.mesh = [];

      for (var y = 0; y < this.res; y++) {
        for (var x = 0; x < this.res; x++) {
          var mx = Math.floor(map(x, 0, this.res, 0, this.width));
          var my = Math.floor(map(y, 0, this.res, 0, this.height));
          var u = map(x, 0, this.res, 0, 1);
          var v = map(y, 0, this.res, 0, 1);
          this.mesh[y * this.res + x] = new surfaces_MeshPoint(this, mx, my, u, v);
        }
      }

      this.TL = 0 + 0; // x + y

      this.TR = this.res - 1 + 0;
      this.BL = 0 + (this.res - 1) * this.res;
      this.BR = this.res - 1 + (this.res - 1) * this.res; // make the corners control points

      this.mesh[this.TL].setControlPoint(true);
      this.mesh[this.TR].setControlPoint(true);
      this.mesh[this.BR].setControlPoint(true);
      this.mesh[this.BL].setControlPoint(true);
      this.controlPoints = [];
      this.controlPoints.push(this.mesh[this.TL]);
      this.controlPoints.push(this.mesh[this.TR]);
      this.controlPoints.push(this.mesh[this.BR]);
      this.controlPoints.push(this.mesh[this.BL]);
    } // abstract

  }, {
    key: "calculateMesh",
    value: function calculateMesh() {}
  }, {
    key: "load",
    value: function load(json) {
      var x = json.x,
          y = json.y,
          points = json.points;
      this.x = x;
      this.y = y; // this.setMeshPoints(points);

      var _iterator = _createForOfIteratorHelper(points),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var point = _step.value;
          var mp = this.mesh[point.i];
          mp.x = point.x;
          mp.y = point.y;
          mp.u = point.u;
          mp.v = point.v; // I think the control point is already set... ?
          // mp.setControlPoint(true);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.calculateMesh();
    }
  }, {
    key: "getJson",
    value: function getJson() {
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
      } // saveJSON(sJson, `${this.type}_${this.id}.json`)


      return sJson;
    }
  }, {
    key: "getControlPoints",
    value: function getControlPoints() {
      return this.controlPoints;
    }
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
    //     let mapped = createVector(point[0], point[1]);
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

  }, {
    key: "selectSurface",
    value: function selectSurface() {
      // if the surface itself is selected
      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      // check if control points are selected
      var cp = this.isMouseOverControlPoints();

      if (cp) {
        cp.startDrag();
        return cp;
      }
    }
  }, {
    key: "isMouseOverControlPoints",
    value: function isMouseOverControlPoints() {
      var _iterator2 = _createForOfIteratorHelper(this.controlPoints),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var cp = _step2.value;

          if (cp.isMouseOver()) {
            return cp;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return false;
    }
    /**
     * Used for mouse selection of surfaces
     * http://www.blackpawn.com/texts/pointinpoly/default.html
     */

  }, {
    key: "isPointInTriangle",
    value: function isPointInTriangle(x, y, a, b, c) {
      var v0 = createVector(c.x - a.x, c.y - a.y);
      var v1 = createVector(b.x - a.x, b.y - a.y);
      var v2 = createVector(x - a.x, y - a.y);
      var dot00 = v0.dot(v0);
      var dot01 = v1.dot(v0);
      var dot02 = v2.dot(v0);
      var dot11 = v1.dot(v1);
      var dot12 = v2.dot(v1); // Compute barycentric coordinates

      var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
      var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      var v = (dot00 * dot12 - dot01 * dot02) * invDenom; // Check if point is in triangle

      return u > 0 && v > 0 && u + v < 1;
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      push();
      translate(this.x, this.y);

      var _iterator3 = _createForOfIteratorHelper(this.controlPoints),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;
          p.display(this.controlPointColor);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      pop();
    }
    /**
        * This function will give you the position of the mouse in the surface's
        * coordinate system.
        * 
        * @return The transformed mouse position
        */

  }, {
    key: "getTransformedCursor",
    value: function getTransformedCursor(cx, cy) {
      var point = this.perspT(cx - this.x, cy - this.y);
      return createVector(point[0], point[1]);
    }
  }, {
    key: "getTransformedMouse",
    value: function getTransformedMouse() {
      return getTransformedCursor(mouseX, mouseY);
    } // 2d cross product

  }, {
    key: "cross2",
    value: function cross2(x0, y0, x1, y1) {
      return x0 * y1 - y0 * x1;
    }
  }]);

  return CornerPinSurface;
}(surfaces_Surface);

/* harmony default export */ const surfaces_CornerPinSurface = (CornerPinSurface);
;// CONCATENATED MODULE: ./src/surfaces/QuadMap.js
function QuadMap_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { QuadMap_typeof = function _typeof(obj) { return typeof obj; }; } else { QuadMap_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return QuadMap_typeof(obj); }

function QuadMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function QuadMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function QuadMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) QuadMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) QuadMap_defineProperties(Constructor, staticProps); return Constructor; }

function QuadMap_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) QuadMap_setPrototypeOf(subClass, superClass); }

function QuadMap_setPrototypeOf(o, p) { QuadMap_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return QuadMap_setPrototypeOf(o, p); }

function QuadMap_createSuper(Derived) { var hasNativeReflectConstruct = QuadMap_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = QuadMap_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = QuadMap_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return QuadMap_possibleConstructorReturn(this, result); }; }

function QuadMap_possibleConstructorReturn(self, call) { if (call && (QuadMap_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return QuadMap_assertThisInitialized(self); }

function QuadMap_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function QuadMap_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function QuadMap_getPrototypeOf(o) { QuadMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return QuadMap_getPrototypeOf(o); }




var QuadMap = /*#__PURE__*/function (_CornerPinSurface) {
  QuadMap_inherits(QuadMap, _CornerPinSurface);

  var _super = QuadMap_createSuper(QuadMap);

  function QuadMap(id, w, h, res, buffer) {
    QuadMap_classCallCheck(this, QuadMap);

    return _super.call(this, id, w, h, res, "QUAD", buffer);
  }
  /**
   * Returns true if the mouse is over this surface, false otherwise.
   */


  QuadMap_createClass(QuadMap, [{
    key: "isMouseOver",
    value: function isMouseOver() {
      var x = mouseX - width / 2;
      var y = mouseY - height / 2;
      if (this.isPointInTriangle(x - this.x, y - this.y, this.mesh[this.TL], this.mesh[this.TR], this.mesh[this.BL]) || this.isPointInTriangle(x - this.x, y - this.y, this.mesh[this.BL], this.mesh[this.TR], this.mesh[this.BR])) return true;
      return false;
    }
  }, {
    key: "calculateMesh",
    value: function calculateMesh() {
      // The float constructor is deprecated, so casting everything to double
      var srcCorners = [0, 0, this.width, 0, this.width, this.height, 0, this.height];
      var dstCorners = [this.mesh[this.TL].x, this.mesh[this.TL].y, this.mesh[this.TR].x, this.mesh[this.TR].y, this.mesh[this.BR].x, this.mesh[this.BR].y, this.mesh[this.BL].x, this.mesh[this.BL].y];
      this.perspT = perspective_PerspT(srcCorners, dstCorners); // this.warpPerspective = new WarpPerspective(transform);

      var xStep = this.width / (this.res - 1);
      var yStep = this.height / (this.res - 1);

      for (var i = 0; i < this.mesh.length; i++) {
        if (this.TL == i || this.BR == i || this.TR == i || this.BL == i) continue;
        var x = i % this.res;
        var y = Math.floor(i / this.res);
        x *= xStep;
        y *= yStep; // let point = this.warpPerspective.mapDestPoint(new Point((x, y));
        // this.mesh[i].x = point.getX();
        // this.mesh[i].y = point.getY();

        var dest = this.perspT.transform(x, y);
        this.mesh[i].x = dest[0];
        this.mesh[i].y = dest[1];
      }
    }
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;
      beginShape(TRIANGLES);

      for (var x = 0; x < this.res - 1; x++) {
        for (var y = 0; y < this.res - 1; y++) {
          if (isUV) this.getQuadTriangles(x, y, tX, tY, tW, tH);else this.getQuadTrianglesOutline(x, y);
        }
      }

      endShape(CLOSE);
    }
  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      this.displayGrid();
    }
  }, {
    key: "displayGrid",
    value: function displayGrid() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.controlPointColor;
      strokeWeight(2);
      stroke(col);
      fill(this.getMutedControlColor(col));
      beginShape(TRIANGLES);

      for (var x = 0; x < this.res - 1; x++) {
        for (var y = 0; y < this.res - 1; y++) {
          this.getQuadTrianglesOutline(x, y);
        }
      }

      endShape(CLOSE);
    }
  }, {
    key: "getQuadTriangles",
    value: function getQuadTriangles(x, y, tX, tY, tW, tH) {
      ////////////////////////////////
      var mp = this.mesh[x + y * this.res];
      this.getVertexUV(mp, tX, tY, tW, tH);
      mp = this.mesh[x + 1 + y * this.res];
      this.getVertexUV(mp, tX, tY, tW, tH); // vertex(1, -1, 0, u, 0);

      mp = this.mesh[x + 1 + (y + 1) * this.res];
      this.getVertexUV(mp, tX, tY, tW, tH); // vertex(1, 1, 0, u, v);

      this.getVertexUV(mp, tX, tY, tW, tH); // vertex(1, 1, 0, u, v);

      mp = this.mesh[x + (y + 1) * this.res];
      this.getVertexUV(mp, tX, tY, tW, tH); // vertex(-1, 1, 0, 0, v);

      mp = this.mesh[x + y * this.res];
      this.getVertexUV(mp, tX, tY, tW, tH); // vertex(-1, -1, 0, 0, 0);
    }
  }, {
    key: "getQuadTrianglesOutline",
    value: function getQuadTrianglesOutline(x, y) {
      var mp = this.mesh[x + y * this.res];
      vertex(mp.x, mp.y);
      mp = this.mesh[x + 1 + y * this.res];
      vertex(mp.x, mp.y);
      mp = this.mesh[x + 1 + (y + 1) * this.res];
      vertex(mp.x, mp.y);
      vertex(mp.x, mp.y);
      mp = this.mesh[x + (y + 1) * this.res];
      vertex(mp.x, mp.y);
      mp = this.mesh[x + y * this.res];
      vertex(mp.x, mp.y);
    }
  }, {
    key: "getVertexUV",
    value: function getVertexUV(mp, tX, tY, tW, tH) {
      var u = map(mp.u, 0, 1, tX, tX + tW);
      var v = map(mp.v, 0, 1, tY, tY + tH); // let u = map(mp.u, 0, this.width, tX, tX + tW);
      // let v = map(mp.v, 0, this.height, tY, tY + tH);

      vertex(mp.x, mp.y, u, v);
    }
  }]);

  return QuadMap;
}(surfaces_CornerPinSurface);

/* harmony default export */ const surfaces_QuadMap = (QuadMap);
;// CONCATENATED MODULE: ./src/surfaces/TriMap.js
function TriMap_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { TriMap_typeof = function _typeof(obj) { return typeof obj; }; } else { TriMap_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return TriMap_typeof(obj); }

function TriMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function TriMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TriMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) TriMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) TriMap_defineProperties(Constructor, staticProps); return Constructor; }

function TriMap_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) TriMap_setPrototypeOf(subClass, superClass); }

function TriMap_setPrototypeOf(o, p) { TriMap_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return TriMap_setPrototypeOf(o, p); }

function TriMap_createSuper(Derived) { var hasNativeReflectConstruct = TriMap_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = TriMap_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = TriMap_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return TriMap_possibleConstructorReturn(this, result); }; }

function TriMap_possibleConstructorReturn(self, call) { if (call && (TriMap_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return TriMap_assertThisInitialized(self); }

function TriMap_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function TriMap_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function TriMap_getPrototypeOf(o) { TriMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return TriMap_getPrototypeOf(o); }



var TriMap = /*#__PURE__*/function (_CornerPinSurface) {
  TriMap_inherits(TriMap, _CornerPinSurface);

  var _super = TriMap_createSuper(TriMap);

  function TriMap(id, w, h, res, buffer) {
    var _this;

    TriMap_classCallCheck(this, TriMap);

    _this = _super.call(this, id, w, h, res, "TRI", buffer);

    _this.setTriMesh();

    return _this;
  }
  /**
   * Returns true if the mouse is over this surface, false otherwise.
   */


  TriMap_createClass(TriMap, [{
    key: "isMouseOver",
    value: function isMouseOver() {
      var mx = mouseX - width / 2;
      var my = mouseY - height / 2;
      if (this.isPointInTriangle(mx - this.x, my - this.y, this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR])) return true;
      return false;
    } // Compute barycentric coordinates (u, v, w) for
    // point p with respect to triangle (a, b, c)

  }, {
    key: "Barycentric",
    value: function Barycentric(p, a, b, c, u, v, w) {
      var v0 = b.sub(a),
          v1 = c.sub(a),
          v2 = p.sub(a);
      var d00 = v0.dot(v0);
      var d01 = v0.dot(v1);
      var d11 = v1.dot(v1);
      var d20 = v2.dot(v0);
      var d21 = v2.dot(v1);
      var denom = d00 * d11 - d01 * d01;
      v = (d11 * d20 - d01 * d21) / denom;
      w = (d00 * d21 - d01 * d20) / denom;
      u = 1.0 - v - w;
    }
  }, {
    key: "setTriMesh",
    value: function setTriMesh() {
      this.TP = Math.floor(this.res / 2) - 1;
      this.mesh[this.TP].setControlPoint(true);
      this.mesh[this.TL].setControlPoint(false);
      this.mesh[this.TR].setControlPoint(false);
      this.controlPoints = [];
      this.controlPoints.push(this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]);
    }
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;
      beginShape();
      var u = 0;
      var v = this.height;
      if (isUV) vertex(this.mesh[this.BL].x, this.mesh[this.BL].y, u, v);else vertex(this.mesh[this.BL].x, this.mesh[this.BL].y);
      u = this.width / 2;
      v = 0;
      if (isUV) vertex(this.mesh[this.TP].x, this.mesh[this.TP].y, u, v);else vertex(this.mesh[this.TP].x, this.mesh[this.TP].y);
      u = this.width;
      v = this.height;
      if (isUV) vertex(this.mesh[this.BR].x, this.mesh[this.BR].y, u, v);else vertex(this.mesh[this.BR].x, this.mesh[this.BR].y);
      endShape(CLOSE);
    } // display

  }]);

  return TriMap;
}(surfaces_CornerPinSurface);

/* harmony default export */ const surfaces_TriMap = (TriMap);
;// CONCATENATED MODULE: ./src/surfaces/PolyMap.js
function PolyMap_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { PolyMap_typeof = function _typeof(obj) { return typeof obj; }; } else { PolyMap_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return PolyMap_typeof(obj); }

function PolyMap_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = PolyMap_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function PolyMap_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return PolyMap_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return PolyMap_arrayLikeToArray(o, minLen); }

function PolyMap_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function PolyMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PolyMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PolyMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) PolyMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) PolyMap_defineProperties(Constructor, staticProps); return Constructor; }

function PolyMap_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) PolyMap_setPrototypeOf(subClass, superClass); }

function PolyMap_setPrototypeOf(o, p) { PolyMap_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PolyMap_setPrototypeOf(o, p); }

function PolyMap_createSuper(Derived) { var hasNativeReflectConstruct = PolyMap_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PolyMap_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PolyMap_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PolyMap_possibleConstructorReturn(this, result); }; }

function PolyMap_possibleConstructorReturn(self, call) { if (call && (PolyMap_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PolyMap_assertThisInitialized(self); }

function PolyMap_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function PolyMap_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function PolyMap_getPrototypeOf(o) { PolyMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PolyMap_getPrototypeOf(o); }


 // TODO 
// inside method could be reused in bezier



var PolyMap = /*#__PURE__*/function (_Surface) {
  PolyMap_inherits(PolyMap, _Surface);

  var _super = PolyMap_createSuper(PolyMap);

  function PolyMap(id, numPoints, buffer) {
    var _this;

    PolyMap_classCallCheck(this, PolyMap);

    _this = _super.call(this, id, 0, 0, 0, "POLY", buffer);
    _this.points = [];

    for (var i = 0; i < numPoints; i++) {
      var r = 200;
      var x = r + r * cos(i / numPoints * 2 * PI);
      var y = r + r * sin(i / numPoints * 2 * PI); // if (!isWEBGL()) {
      //     x += width / 2;
      //     y += height / 2;
      // }

      var cp = new surfaces_MovePoint(PolyMap_assertThisInitialized(_this), x, y);
      cp.isControlPoint = true;

      _this.points.push(cp);
    }

    _this.setDimensions(_this.points);

    return _this;
  }

  PolyMap_createClass(PolyMap, [{
    key: "setPoints",
    value: function setPoints(pts) {
      this.points = [];

      var _iterator = PolyMap_createForOfIteratorHelper(pts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          var cp = new surfaces_MovePoint(this, p.x, p.y);
          cp.isControlPoint = true;
          this.points.push(cp);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "displaySurface",
    value: function displaySurface() {
      var isUV = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var tX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var tW = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
      var tH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;

      var _this$getBounds = this.getBounds(this.points),
          x = _this$getBounds.x,
          y = _this$getBounds.y;

      beginShape();

      var _iterator2 = PolyMap_createForOfIteratorHelper(this.points),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var point = _step2.value;
          if (isUV) vertex(point.x, point.y, point.x - x, point.y - y);else vertex(point.x, point.y);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      endShape(CLOSE);
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      push();
      translate(this.x, this.y, 2);

      var _iterator3 = PolyMap_createForOfIteratorHelper(this.points),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;
          p.display(this.controlPointColor);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      pop();
    }
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var p = {
        x: mouseX,
        y: mouseY
      };

      if (isWEBGL()) {
        p.x -= width / 2;
        p.y -= height / 2;
      }

      ;
      var ins = inside(p, this.points, {
        x: this.x,
        y: this.y
      });
      return ins;
    }
  }, {
    key: "load",
    value: function load(json) {
      var x = json.x,
          y = json.y,
          points = json.points;
      this.x = x;
      this.y = y;

      var _iterator4 = PolyMap_createForOfIteratorHelper(points),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var point = _step4.value;
          var mp = this.points[point.i];
          mp.x = point.x;
          mp.y = point.y;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "getJson",
    value: function getJson() {
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
    }
  }, {
    key: "selectSurface",
    value: function selectSurface() {
      // then, see if the poly itself is selected
      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      // check control points
      var _iterator5 = PolyMap_createForOfIteratorHelper(this.points),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var p = _step5.value;

          if (p.isMouseOver()) {
            p.startDrag();
            return p;
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

  return PolyMap;
}(surfaces_Surface);

/* harmony default export */ const surfaces_PolyMap = (PolyMap);
;// CONCATENATED MODULE: ./src/surfaces/Bezier/BezierPoint.js
function BezierPoint_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BezierPoint_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BezierPoint_createClass(Constructor, protoProps, staticProps) { if (protoProps) BezierPoint_defineProperties(Constructor.prototype, protoProps); if (staticProps) BezierPoint_defineProperties(Constructor, staticProps); return Constructor; }

// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/
var ControlPoint = /*#__PURE__*/function () {
  function ControlPoint(x, y, parentPath) {
    BezierPoint_classCallCheck(this, ControlPoint);

    // this.id = parentPath.points.length;
    this.pos = createVector(x, y);
    this.parentPath = parentPath;
    this.type = "CPOINT";
    this.r = 8;
  }

  BezierPoint_createClass(ControlPoint, [{
    key: "add",
    value: function add(x, y) {
      this.pos.add(x, y);
    }
  }, {
    key: "set",
    value: function set(x, y) {
      this.pos.set(x, y);
    }
  }, {
    key: "select",
    value: function select() {
      var px = this.pos.x + this.parentPath.x;
      var py = this.pos.y + this.parentPath.y;
      var mx = mouseX - width / 2;
      var my = mouseY - height / 2;

      if (dist(px, py, mx, my) < 5) {
        return true;
      }

      return false;
    }
  }, {
    key: "moveTo",
    value: function moveTo() {
      var x = mouseX - width / 2 - this.parentPath.x;
      var y = mouseY - height / 2 - this.parentPath.y;
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
            var _dist = p5.Vector.dist(anchor, other);

            var disp = p5.Vector.sub(anchor, this.pos);
            disp.setMag(_dist);
            other.set(p5.Vector.add(anchor, disp));
          } else if (path.mode == "MIRRORED") {
            other.set(p5.Vector.lerp(anchor, this.pos, -1));
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
    value: function displayControlCircle(strokeC) {
      var i = this.parentPath.points.indexOf(this);
      stroke(strokeC);
      strokeWeight(2);

      if (i % 3 == 0) {
        // anchor
        this.displayCircle(color(255, 0, 0), this.r);
      } else if (!this.parentPath.auto) {
        var col = this.parentPath.controlPointColor;
        this.displayCircle(col, this.r - 2);
      }
    }
  }, {
    key: "displayCircle",
    value: function displayCircle(fillC, r) {
      noFill();
      stroke(fillC);
      ellipse(this.pos.x, this.pos.y, r * 2);
      noStroke();
      fill(fillC);
      ellipse(this.pos.x, this.pos.y, r);
    }
  }]);

  return ControlPoint;
}();

/* harmony default export */ const BezierPoint = (ControlPoint);
;// CONCATENATED MODULE: ./src/surfaces/Bezier/BezierMap.js
 // Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

function BezierMap_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { BezierMap_typeof = function _typeof(obj) { return typeof obj; }; } else { BezierMap_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return BezierMap_typeof(obj); }

function BezierMap_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = BezierMap_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function BezierMap_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return BezierMap_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return BezierMap_arrayLikeToArray(o, minLen); }

function BezierMap_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function BezierMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BezierMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BezierMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) BezierMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) BezierMap_defineProperties(Constructor, staticProps); return Constructor; }

function BezierMap_get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { BezierMap_get = Reflect.get; } else { BezierMap_get = function _get(target, property, receiver) { var base = BezierMap_superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return BezierMap_get(target, property, receiver || target); }

function BezierMap_superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = BezierMap_getPrototypeOf(object); if (object === null) break; } return object; }

function BezierMap_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) BezierMap_setPrototypeOf(subClass, superClass); }

function BezierMap_setPrototypeOf(o, p) { BezierMap_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return BezierMap_setPrototypeOf(o, p); }

function BezierMap_createSuper(Derived) { var hasNativeReflectConstruct = BezierMap_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = BezierMap_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = BezierMap_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return BezierMap_possibleConstructorReturn(this, result); }; }

function BezierMap_possibleConstructorReturn(self, call) { if (call && (BezierMap_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return BezierMap_assertThisInitialized(self); }

function BezierMap_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function BezierMap_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function BezierMap_getPrototypeOf(o) { BezierMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return BezierMap_getPrototypeOf(o); }




var BezierMap = /*#__PURE__*/function (_Surface) {
  BezierMap_inherits(BezierMap, _Surface);

  var _super = BezierMap_createSuper(BezierMap);

  function BezierMap(id, pInst, pMapper) {
    var _this;

    BezierMap_classCallCheck(this, BezierMap);

    _this = _super.call(this, id, 0, 0, 0, "BEZ", pInst.buffer);
    _this.pInst = pInst;
    _this.pMapper = pMapper;
    _this.bufferSpace = 10;
    _this.width = 100;
    _this.height = 100;
    _this.contentImg = createImage(_this.width, _this.height);
    _this.maskImg = createImage(_this.width, _this.height);
    _this.contentImg.drawingContext.willReadFrequently = true;
    _this.maskImg.drawingContext.willReadFrequently = true;

    _this.initEmpty();

    _this.mode = "FREE";
    _this.r = 8; // let filePath = "../../src/surfaces/Bezier/shader."
    // this.theShader = loadShader(filePath + "vert", filePath + "frag")

    return _this;
  }

  BezierMap_createClass(BezierMap, [{
    key: "initEmpty",
    value: function initEmpty() {
      this.points = [];
      this.x = 100;
      this.y = 100;
      this.points.push(new BezierPoint(0, 0, this));
      this.points.push(new BezierPoint(this.width, 0, this));
      this.points.push(new BezierPoint(this.width, this.height, this));
      this.points.push(new BezierPoint(0, this.height, this));
      this.closed = false;
      this.auto = false;
      this.toggleClosed();
    }
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
  }, {
    key: "setBezierDetail",
    value: function setBezierDetail() {
      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
      this.pMapper.bezBuffer.bezierDetail(num);
      this.pMapper.buffer.bezierDetail(num);
    }
  }, {
    key: "isReady",
    value: function isReady() {
      return this.pMapper.bezBuffer; // return this.pMapper.bezBuffer && this.pMapper.bezierShaderLoaded;
    }
  }, {
    key: "load",
    value: function load(json) {
      this.points = [];
      this.x = json.x;
      this.y = json.y;
      this.closed = json.closed;
      this.auto = json.auto;

      var _iterator = BezierMap_createForOfIteratorHelper(json.points),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          this.points.push(new BezierPoint(p.x, p.y, this));
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
        type: this.type,
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
  }, {
    key: "selectSurface",
    value: function selectSurface() {
      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      // check if control points are selected
      var controls = this.selectControls();
      if (controls) return controls;
      return this.selectAnchors();
    }
  }, {
    key: "selectAnchors",
    value: function selectAnchors() {
      // check if control points are selected
      for (var i = 0; i < this.points.length; i += 3) {
        var p = this.points[i];

        if (p.select()) {
          return p;
        }
      }

      return null;
    }
  }, {
    key: "selectControls",
    value: function selectControls() {
      // check if control points are selected
      var _iterator2 = BezierMap_createForOfIteratorHelper(this.points),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var p = _step2.value;

          if (p.isAnchor()) {
            continue;
          } else if (p.select()) return p;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }
  }, {
    key: "getBounds",
    value: function getBounds() {
      var polyline = this.getPolyline();
      return BezierMap_get(BezierMap_getPrototypeOf(BezierMap.prototype), "getBounds", this).call(this, polyline);
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
        this.points.pop();
        this.points.pop();
      } else {
        this.closed = true;
        var anchor1 = this.points[this.points.length - 1].pos;
        var control1 = this.points[this.points.length - 2].pos;
        var anchor2 = this.points[0].pos;
        var control2 = this.points[1].pos;
        var newControl1 = p5.Vector.lerp(anchor1, control1, -1);
        var cp1 = new BezierPoint(newControl1.x, newControl1.y, this);
        var newControl2 = p5.Vector.lerp(anchor2, control2, -1);
        var cp2 = new BezierPoint(newControl2.x, newControl2.y, this);
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
      this.contentImg.resize(this.width, this.height);
      this.maskImg.resize(this.width, this.height);
      var bezBuffer = this.pMapper.bezBuffer;
      this.displayBezierPG(bezBuffer);
    }
  }, {
    key: "numSegments",
    value: function numSegments() {
      return floor(this.points.length / 3);
    }
  }, {
    key: "getSegment",
    value: function getSegment(i) {
      return [this.points[this.loopIndex(i * 3 + 0)], this.points[this.loopIndex(i * 3 + 1)], this.points[this.loopIndex(i * 3 + 2)], this.points[this.loopIndex(i * 3 + 3)]];
    }
  }, {
    key: "addSegment",
    value: function addSegment(x, y) {
      if (!x) {
        x = mouseX - width / 2 - this.x;
      }

      if (!y) {
        y = mouseY - height / 2 - this.y;
      }

      this.toggleClosed();
      var prevAnchor = this.points[this.points.length - 2].pos;
      var prevControl = this.points[this.points.length - 1].pos;
      var anchor = createVector(x, y);
      var aP = new BezierPoint(anchor.x, anchor.y, this);
      var control1 = p5.Vector.lerp(prevControl, prevAnchor, -1);
      var cp1 = new BezierPoint(control1.x, control1.y, this);
      var control2 = p5.Vector.lerp(control1, anchor, 0.5);
      var cp2 = new BezierPoint(control2.x, control2.y, this);
      this.points.push(cp1, cp2, aP);
      this.toggleClosed();
    }
  }, {
    key: "autoSetControlPoint",
    value: function autoSetControlPoint(anchorI, controlSpacing) {
      if ((anchorI - 3 < 0 || anchorI + 3 >= this.points.length) && !this.closed) return;
      var anchorLeftI = this.loopIndex(anchorI - 3);
      var anchorRightI = this.loopIndex(anchorI + 3);
      var anchor = this.points[anchorI];
      var anchorLeft = this.points[anchorLeftI];
      var anchorRight = this.points[anchorRightI];
      var dispLeft = p5.Vector.sub(anchorLeft, anchor);
      var dispRight = p5.Vector.sub(anchorRight, anchor);
      var magLeft = dispLeft.mag();
      var magRight = dispRight.mag();
      dispLeft.normalize();
      dispRight.normalize();
      var dirLeft = p5.Vector.sub(dispLeft, dispRight);
      var dirRight = p5.Vector.sub(dispRight, dispLeft);
      dirLeft.setMag(magLeft * controlSpacing);
      dirRight.setMag(magRight * controlSpacing);
      this.points[this.loopIndex(anchorI - 1)].set(p5.Vector.add(anchor, dirLeft));
      this.points[this.loopIndex(anchorI + 1)].set(p5.Vector.add(anchor, dirRight));
    }
  }, {
    key: "autoSetEdgePoints",
    value: function autoSetEdgePoints(controlSpacing) {
      if (this.closed) return;
      this.points[1].set(p5.Vector.lerp(this.points[0].pos, this.points[2].pos, controlSpacing));
      this.points[this.points.length - 2].set(p5.Vector.lerp(this.points[this.points.length - 1].pos, this.points[this.points.length - 3].pos, controlSpacing));
    }
  }, {
    key: "autoSetAllControlPoints",
    value: function autoSetAllControlPoints(controlSpacing) {
      for (var i = 0; i < this.points.length; i += 3) {
        this.autoSetControlPoint(i, controlSpacing);
      }

      this.autoSetEdgePoints(controlSpacing);
    }
  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : color('black');

      if (isCalibratingMapper()) {
        strokeWeight(3);
        stroke(this.controlPointColor);
        fill(this.getMutedControlColor());
      } else {
        noStroke();
        fill(col);
      }

      this.displayBezier();
    }
  }, {
    key: "displayTexture",
    value: function displayTexture(img) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (!this.isReady()) {
        return;
      }

      var buffer = this.pMapper.buffer;
      this.drawImage(img, buffer, x, y);
      this.displayGraphicsTexture(buffer); // if (isCalibratingMapper()) {
      //     this.display();
      //     return;
      // }
    }
  }, {
    key: "displaySketch",
    value: function displaySketch(sketch) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var buffer = this.pMapper.buffer;
      buffer.push(); // TODO
      // WEBGL origin or 2D origin ...
      // Does this make sense? 
      // draw the sketch from top left corner
      // buffer.translate(-buffer.width / 2, -buffer.height / 2);
      // could also put graphics buffer 
      // at center of bezier
      // const {w, h} = this.getBounds();
      // buffer.translate(w/2, h/2);

      buffer.translate(x, y);
      sketch(buffer);
      buffer.pop();
      this.displayGraphicsTexture(buffer); // if (isCalibratingMapper()) {
      //     this.display();
      //     return;
      // }
    }
  }, {
    key: "displayGraphicsTexture",
    value: function displayGraphicsTexture(pg) {
      // white bezier mask should be recreated every time 
      // shape changes (this.setDimensions())
      var maskPG = this.pMapper.bezBuffer;
      this.pgMask(pg, maskPG); // TODO - issue with createImage() and createGraphics()
      // leading to memory leak

      var _this$getBounds2 = this.getBounds(),
          x = _this$getBounds2.x,
          y = _this$getBounds2.y;

      push();
      translate(this.x, this.y);
      translate(x - this.bufferSpace, y - this.bufferSpace);
      image(this.contentImg, 0, 0);
      pop();

      if (isCalibratingMapper()) {
        this.display();
        return;
      }
    } // In the future when we can apply texture UVs to bezier vertices:
    // https://github.com/processing/p5.js/issues/5699
    // setShader(shader) {
    //     this.theShader = shader;
    // }
    // displayTexture(tex) {
    //     if (!this.isReady()) {
    //         return;
    //     }
    //     let buffer = this.pMapper.buffer;
    //     let bezBuffer = this.pMapper.bezBuffer;
    //     let theShader = this.pMapper.bezShader;
    //     this.drawImage(tex, buffer);
    //     textureMode(NORMAL);
    //     bezBuffer.shader(theShader);
    //     theShader.setUniform('resolution', [buffer.width, buffer.height]);
    //     theShader.setUniform('tex', buffer);
    //     // rect gives us some geometry on the screen
    //     bezBuffer.rect(0, 0, bezBuffer.width, bezBuffer.height);
    //     texture(bezBuffer);
    //     this.displayBezier();
    // }

  }, {
    key: "drawImage",
    value: function drawImage(img, pg) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (img && pg) {
        pg.push();
        pg.clear(); // useful for WEBGL mode...
        // pg.translate(-pg.width / 2, -pg.height / 2);

        pg.translate(x, y);
        pg.image(img, 0, 0);
        pg.pop();
      }
    }
  }, {
    key: "displayBezierPG",
    value: function displayBezierPG(pg) {
      var _this$getBounds3 = this.getBounds(),
          x = _this$getBounds3.x,
          y = _this$getBounds3.y;

      pg.push();
      pg.clear();
      pg.fill('white');
      pg.translate(-x, -y);
      pg.translate(this.bufferSpace, this.bufferSpace);
      pg.beginShape();
      pg.vertex(this.points[0].pos.x, this.points[0].pos.y);

      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        pg.bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }

      pg.endShape();
      pg.pop(); // if (isCalibratingMapper()) {
      //     translate(0, 0, 3);
      //     this.displayControls();
      // }
    }
  }, {
    key: "displayBezier",
    value: function displayBezier() {
      push();
      translate(this.x, this.y);
      beginShape();
      vertex(this.points[0].pos.x, this.points[0].pos.y);

      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        bezierVertex(seg[1].pos.x, seg[1].pos.y, seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }

      endShape(); // if (isCalibratingMapper()) {
      //     translate(0, 0, 3);
      //     this.displayControls();
      // }

      pop();
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      if (isMovingPoints()) {
        var lineC = this.controlPointColor;
        push();
        translate(this.x, this.y);

        if (!this.auto) {
          this.displayControlLines(lineC);
        }

        this.displayControlCircles(lineC);
        pop();
      }
    }
  }, {
    key: "displayControlLines",
    value: function displayControlLines(strokeC) {
      strokeWeight(2);

      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        stroke(strokeC);
        line(seg[0].pos.x, seg[0].pos.y, seg[1].pos.x, seg[1].pos.y);
        line(seg[2].pos.x, seg[2].pos.y, seg[3].pos.x, seg[3].pos.y);
      }
    }
  }, {
    key: "displayControlCircles",
    value: function displayControlCircles(strokeC) {
      var _iterator3 = BezierMap_createForOfIteratorHelper(this.points),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;
          p.displayControlCircle(strokeC);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "getPolyline",
    value: function getPolyline() {
      var polyline = [];

      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        var steps = 4;

        for (var _i = 0; _i <= steps; _i++) {
          var t = _i / steps;
          var x = bezierPoint(seg[0].pos.x, seg[1].pos.x, seg[2].pos.x, seg[3].pos.x, t);
          var y = bezierPoint(seg[0].pos.y, seg[1].pos.y, seg[2].pos.y, seg[3].pos.y, t);
          polyline.push({
            x: x,
            y: y
          });
        }
      }

      return polyline;
    } //(x0,y0) is start point; (x1,y1),(x2,y2) is control points; (x3,y3) is end point.

  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var polyline = this.getPolyline();
      var mx = mouseX - width / 2 - this.x;
      var my = mouseY - height / 2 - this.y;
      return this.inside(mx, my, polyline);
    }
  }, {
    key: "inside",
    value: function inside(x, y, vs) {
      // ray-casting algorithm based on
      // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
      var inside = false;

      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x,
            yi = vs[i].y;
        var xj = vs[j].x,
            yj = vs[j].y;
        var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    }
  }, {
    key: "pgMask",
    value: // https://editor.p5js.org/mikima/sketches/SkEXyPvpf
    function pgMask(_content, _mask) {
      //Create the mask as image
      this.contentImg.copy(_content, 0, 0, this.contentImg.width, this.contentImg.height, 0, 0, this.contentImg.width, this.contentImg.height); // clear mask before copying

      this.maskImg.loadPixels();

      for (var i = 0; i < this.maskImg.pixels.length; i += 4) {
        this.maskImg.pixels[i] = 0;
        this.maskImg.pixels[i + 1] = 0;
        this.maskImg.pixels[i + 2] = 0;
        this.maskImg.pixels[i + 3] = 0;
      }

      this.maskImg.updatePixels();
      this.maskImg.copy(_mask, 0, 0, this.maskImg.width, this.maskImg.height, 0, 0, this.maskImg.width, this.maskImg.height);
      this.contentImg.mask(this.maskImg); // return the masked image
      // return contentImg;
    }
  }]);

  return BezierMap;
}(surfaces_Surface);

/* harmony default export */ const Bezier_BezierMap = (BezierMap);
;// CONCATENATED MODULE: ./src/lines/LineMap.js
function LineMap_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { LineMap_typeof = function _typeof(obj) { return typeof obj; }; } else { LineMap_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return LineMap_typeof(obj); }

function LineMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function LineMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LineMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) LineMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) LineMap_defineProperties(Constructor, staticProps); return Constructor; }

function LineMap_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) LineMap_setPrototypeOf(subClass, superClass); }

function LineMap_setPrototypeOf(o, p) { LineMap_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return LineMap_setPrototypeOf(o, p); }

function LineMap_createSuper(Derived) { var hasNativeReflectConstruct = LineMap_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = LineMap_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = LineMap_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return LineMap_possibleConstructorReturn(this, result); }; }

function LineMap_possibleConstructorReturn(self, call) { if (call && (LineMap_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return LineMap_assertThisInitialized(self); }

function LineMap_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function LineMap_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function LineMap_getPrototypeOf(o) { LineMap_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return LineMap_getPrototypeOf(o); }



 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var LineMap = /*#__PURE__*/function (_Draggable) {
  LineMap_inherits(LineMap, _Draggable);

  var _super = LineMap_createSuper(LineMap);

  function LineMap(x0, y0, x1, y1, id) {
    var _this;

    LineMap_classCallCheck(this, LineMap);

    _this = _super.call(this, 0, 0);
    _this.id = id;
    _this.type = "LINE";
    _this.lineW = 10;
    _this.endCapsOn = true;
    _this.lastChecked = 0;
    _this.lineC = color(255);
    _this.highlightColor = color(0, 255, 0);
    _this.controlPointColor = getRandomizedColor(_this.id, _this.type);
    _this.p0 = new surfaces_MovePoint(LineMap_assertThisInitialized(_this), x0, y0);
    _this.p1 = new surfaces_MovePoint(LineMap_assertThisInitialized(_this), x1, y1);
    _this.controlCol = getRandomizedColor();

    _this.leftToRight();

    _this.ang = atan2(_this.p0.y - _this.p1.y, _this.p0.x - _this.p1.x);
    if (_this.ang > PI / 2) _this.ang -= 2 * PI;
    return _this;
  } //////////////////////////////////////////////
  // LOADING / SAVING
  //////////////////////////////////////////////


  LineMap_createClass(LineMap, [{
    key: "load",
    value: function load(json) {
      this.x = json.x;
      this.y = json.y;
      this.p0.x = json.x0;
      this.p0.y = json.y0;
      this.p1.x = json.x1;
      this.p1.y = json.y1;
    }
  }, {
    key: "getJson",
    value: function getJson() {
      var json = {};
      json.id = this.id;
      json.x = this.x;
      json.y = this.y;
      json.x0 = this.p0.x;
      json.y0 = this.p0.y;
      json.x1 = this.p1.x;
      json.y1 = this.p1.y;
      return json;
    } //////////////////////////////////////////////
    // DISPLAY METHODS
    //////////////////////////////////////////////

  }, {
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lineC;
      strokeWeight(this.lineW);
      stroke(col);
      push();
      translate(this.x, this.y);
      line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
      this.drawEndCaps(this.p0, this.p1, col, col);
      pop();
    }
  }, {
    key: "displayCenterPulse",
    value: function displayCenterPulse(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      // per = constrain(per, 0, 1.0);
      // let per = this. getPercentWave(speed);
      var midX = (this.p0.x + this.p1.x) / 2;
      var midY = (this.p0.y + this.p1.y) / 2;
      var x0 = map(per, 0, 1.0, midX, this.p0.x);
      var x1 = map(per, 0, 1.0, midX, this.p1.x);
      var y0 = map(per, 0, 1.0, midY, this.p0.y);
      var y1 = map(per, 0, 1.0, midY, this.p1.y);
      strokeWeight(this.lineW);
      stroke(col);
      push();
      translate(this.x, this.y);
      line(x0, y0, x1, y1);
      this.drawEndCaps({
        x: x0,
        y: y0
      }, {
        x: x1,
        y: y1
      }, col, col);
      pop();
    }
  }, {
    key: "displayPercent",
    value: function displayPercent(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      var p = per;
      var p0 = createVector(this.p0.x, this.p0.y);
      var p1 = createVector(this.p1.x, this.p1.y);
      var pTemp = p5.Vector.lerp(p0, p1, p);
      strokeWeight(this.lineW);
      stroke(col);
      push();
      translate(this.x, this.y);
      line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
      this.drawEndCaps(p0, pTemp, col, col);
      pop();
    }
  }, {
    key: "displayPercentWidth",
    value: function displayPercentWidth(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      per = constrain(per, 0, 1.0);
      var sw = map(per, 0, 1.0, 0, 10);
      strokeWeight(sw);
      stroke(col);
      push();
      translate(this.x, this.y);
      line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
      this.drawEndCaps(this.p0, this.p1, col, col, sw);
      pop();
    }
  }, {
    key: "displayNone",
    value: function displayNone() {
      this.display(color(0));
    }
  }, {
    key: "displayRainbowCycle",
    value: function displayRainbowCycle() {
      // TODO - is this how we should handle color modes?
      // shouldn't we set to what it was before call? Can't presume RBG
      colorMode(HSB, 255);
      var col = color(frameCount % 255, 255, 255);
      this.display(col);
      colorMode(RGB, 255);
    } // TODO
    // way too expensive

  }, {
    key: "displayGradientLine",
    value: function displayGradientLine(c1, c2, per) {
      var phase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var flip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      per += phase;
      per %= 1;
      var spacing = 1.0 / height;

      for (var i = 0; i < 1.0; i += spacing) {
        var grad = (i / 2 + per) % 1;
        var col = this.get2CycleColor(c1, c2, grad);
        this.displaySegment(i, spacing, col);
      }
    } //////////////////////////////////////////////
    // DISPLAY HELPERS
    //////////////////////////////////////////////

  }, {
    key: "displayCalibration",
    value: function displayCalibration() {
      var col = color(0, 255, 0);
      this.display(col);
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      push();
      translate(this.x, this.y);
      this.p0.display(this.controlPointColor);
      this.p1.display(this.controlPointColor);
      pop();
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

      if (!this.endCapsOn) {
        return;
      }

      noStroke();

      if (dist(p0.x, p0.y, p1.x, p1.y) > 1) {
        fill(col0);
        ellipse(p0.x, p0.y, this.lineW);
        fill(col1);
        ellipse(p1.x, p1.y, this.lineW);
      }
    }
  }, {
    key: "displaySegment",
    value: function displaySegment(startPer, sizePer) {
      var col = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineC;
      strokeWeight(this.lineW);
      stroke(col);
      var p0 = createVector(this.p0.x, this.p0.y);
      var p1 = createVector(this.p1.x, this.p1.y);
      var pTemp = p5.Vector.lerp(p0, p1, startPer);
      push();
      translate(this.x, this.y);
      var pTempEnd = p5.Vector.lerp(pTemp, p1, startPer + sizePer);
      line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
      this.drawEndCaps(pTemp, pTempEnd, col, col);
      pop();
    } //////////////////////////////////////////////
    // COLOR HELPERS
    //////////////////////////////////////////////

  }, {
    key: "get2CycleColor",
    value: function get2CycleColor(c1, c2, per) {
      per = constrain(per, 0, 1);
      per *= 2;

      if (per < 1) {
        return lerpColor(c1, c2, per);
      } else {
        per = map(per, 1, 2, 0, 1);
        return lerpColor(c2, c1, per);
      }
    }
  }, {
    key: "get3CycleColor",
    value: function get3CycleColor(c1, c2, per) {
      per = constrain(per, 0, 1);
      per *= 3;

      if (per < 1) {
        return lerpColor(c1, c2, per);
      } else if (per < 2) {
        per = map(per, 1, 2, 1, 0);
        return lerpColor(c3, c2, per);
      } else {
        per = map(per, 2, 3, 1, 0);
        return lerpColor(c1, c3, per);
      }
    }
  }, {
    key: "getPointHighlight",
    value: function getPointHighlight(p) {
      colorMode(RGB, 255);
      if (this.isMouseOverPoint(p)) stroke(0, 255, 0);else stroke(255, 0, 0);
    } //////////////////////////////////////////////
    // CLICK DETECTION
    //////////////////////////////////////////////
    // isMouseOverPoint(p) {
    //     let d = dist(p.x, p.y, mouseX - width / 2, mouseY - height / 2);
    //     return d < p.r;
    // }
    // www.jeffreythompson.org/collision-detection/line-point.php

  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var x1 = this.p0.x;
      var y1 = this.p0.y;
      var x2 = this.p1.x;
      var y2 = this.p1.y;
      var px = mouseX - width / 2 - this.x;
      var py = mouseY - height / 2 - this.y;
      var d1 = dist(px, py, x1, y1);
      var d2 = dist(px, py, x2, y2);
      var lineLen = dist(x1, y1, x2, y2);
      var buffer = 0.2; // higher # = less accurate

      if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
        return true;
      }

      return false;
    }
  }, {
    key: "selectSurface",
    value: function selectSurface() {
      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
    }
  }, {
    key: "selectPoints",
    value: function selectPoints() {
      // check control points
      if (this.p0.isMouseOver()) {
        this.p0.startDrag();
        return this.p0;
      }

      if (this.p1.isMouseOver()) {
        this.p1.startDrag();
        return this.p1;
      }

      return null;
    } //////////////////////////////////////////////
    // OTHER HELPERS
    //////////////////////////////////////////////

  }, {
    key: "leftToRight",
    value: function leftToRight() {
      if (this.p0.x > this.p1.x) {
        var temp = createVector(this.p0.x, this.p0.y);
        this.p0.set(this.p1);
        this.p1.set(temp);
      }
    }
  }, {
    key: "rightToLeft",
    value: function rightToLeft() {
      if (this.p0.x < this.p1.x) {
        var temp = createVector(this.p0.x, this.p0.y);
        this.p0.set(this.p1);
        this.p1.set(temp);
      }
    }
  }]);

  return LineMap;
}(surfaces_Draggable);

/* harmony default export */ const lines_LineMap = (LineMap);
;// CONCATENATED MODULE: ./src/ProjectionMapper.js
function ProjectionMapper_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = ProjectionMapper_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ProjectionMapper_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProjectionMapper_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProjectionMapper_arrayLikeToArray(o, minLen); }

function ProjectionMapper_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ProjectionMapper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProjectionMapper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProjectionMapper_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProjectionMapper_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProjectionMapper_defineProperties(Constructor, staticProps); return Constructor; }








var ProjectionMapper = /*#__PURE__*/function () {
  function ProjectionMapper() {
    ProjectionMapper_classCallCheck(this, ProjectionMapper);

    this.buffer;
    this.surfaces = [];
    this.lines = [];
    this.dragged = null;
    this.selected = null;
    this.calibrate = false;
    this.pInst = null;
    this.pMousePressed = false;
    this.moveMode = "ALL";
    this.bezBuffer = null; // this.bezShader = null;
    // this.bezierShaderLoaded = false;
  }

  ProjectionMapper_createClass(ProjectionMapper, [{
    key: "init",
    value: function init(w, h) {
      if (this.bezBuffer == null) {
        // TODO
        // should these be WEBGL??
        // TODO
        // warning about reading frequently?? 
        // https://stackoverflow.com/questions/74020182/canvas2d-multiple-readback-operations-using-getimagedata-are-faster-with-the-wi
        this.buffer = this.pInst.createGraphics(w, h);
        this.bezBuffer = this.pInst.createGraphics(w, h); // TODO - when implementing shader
        // let filePath = "../../src/surfaces/Bezier/shader"
        // this.bezShader = this.pInst.loadShader(filePath + ".vert", filePath + ".frag", () => this.bezierShaderLoaded = true);
      }
    } ////////////////////////////////////////
    // SURFACES
    ////////////////////////////////////////

    /**
     * Creates and registers a new quad surface. 
     * 
     * @param w width
     * @param h height
     * @param res resolution (number of tiles per axis)
     * @return
     */

  }, {
    key: "createQuadMap",
    value: function createQuadMap(w, h) {
      var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
      var s = new surfaces_QuadMap(this.surfaces.length, w, h, res, this.buffer);
      this.surfaces.push(s);
      return s;
    }
    /**
     * Creates and registers a new triangle surface. 
     * 
     * @param w width
     * @param h height
     * @param res resolution (number of tiles per axis)
     * @return
     */

  }, {
    key: "createTriMap",
    value: function createTriMap(w, h) {
      var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
      var s = new surfaces_TriMap(this.surfaces.length, w, h, res, this.buffer);
      this.surfaces.push(s);
      return s;
    }
  }, {
    key: "createLineMap",
    value: function createLineMap() {
      var x0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var x1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (x0 == 0 && y0 == 0 && x1 == 0 && y1 == 0) {
        x1 = 200;
        y0 = 30 * this.lines.length;
        y1 = 30 * this.lines.length;
      }

      var l = new lines_LineMap(x0, y0, x1, y1, this.lines.length);
      this.lines.push(l);
      return l;
    }
  }, {
    key: "createPolyMap",
    value: function createPolyMap() {
      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
      if (numPoints < 3) numPoints = 3;
      var s = new surfaces_PolyMap(this.surfaces.length, numPoints, this.buffer);
      this.surfaces.push(s);
      return s;
    }
  }, {
    key: "createBezierMap",
    value: function createBezierMap() {
      var bez = new Bezier_BezierMap(this.surfaces.length, this.pInst, this);
      this.surfaces.push(bez);
      return bez;
    } ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////

  }, {
    key: "onClick",
    value: function onClick() {
      // ignore input events if the calibrate flag is not set
      if (!this.calibrate) return;

      if (this.moveMode == "SURFACES") {
        this.checkSurfacesClick();
      } else if (this.moveMode == "POINTS") {
        this.checkPointsClick();
      } else {
        if (!this.checkPointsClick()) {
          this.checkSurfacesClick();
        }
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
      return this.moveMode == "ALL" || this.moveMode == "POINTS";
    }
  }, {
    key: "checkSurfacesClick",
    value: function checkSurfacesClick() {
      // Check Lines
      // navigate the list backwards, as to select 
      for (var i = this.lines.length - 1; i >= 0; i--) {
        var s = this.lines[i];
        this.dragged = s.selectSurface();

        if (this.dragged != null) {
          return true;
        }
      } // check mapping surfaces


      for (var _i = this.surfaces.length - 1; _i >= 0; _i--) {
        var _s = this.surfaces[_i];
        this.dragged = _s.selectSurface();

        if (this.dragged != null) {
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
      // Check Lines
      // navigate the list backwards, as to select 
      for (var i = this.lines.length - 1; i >= 0; i--) {
        var s = this.lines[i];
        this.dragged = s.selectPoints();

        if (this.dragged != null) {
          return true;
        }
      } // TODO - check bez control points before anchors
      // check mapping surfaces


      for (var _i2 = this.surfaces.length - 1; _i2 >= 0; _i2--) {
        var _s2 = this.surfaces[_i2];
        this.dragged = _s2.selectPoints();

        if (this.dragged != null) {
          this.selected = _s2;
          return true;
        }
      }

      this.selected = null;
      return false;
    }
  }, {
    key: "checkSelectedClick",
    value: function checkSelectedClick() {
      // first check masks
      if (this.selected) {
        this.dragged = this.selected.selectPoints();
        if (this.dragged) return true;
        return false;
      }

      return false;
    }
  }, {
    key: "onDrag",
    value: function onDrag() {
      if (this.dragged != null) this.dragged.moveTo();
    }
  }, {
    key: "onRelease",
    value: function onRelease() {
      this.dragged = null;
    }
  }, {
    key: "isDragging",
    value: function isDragging(surface) {
      // TODO - ??? why return true?
      // need to remember what I was doing here
      if (this.dragged === null) return true;
      return this.dragged === surface;
    }
  }, {
    key: "updateEvents",
    value: function updateEvents() {
      if (this.pInst.mouseIsPressed) {
        if (!this.pMousePressed) {
          this.onClick();
        } else {
          this.onDrag();
        }
      } else {
        if (this.pMousePressed) {
          this.onRelease();
        }
      }

      this.pMousePressed = this.pInst.mouseIsPressed;
    } ////////////////////////////////////////
    // LOADING / SAVING
    ////////////////////////////////////////

  }, {
    key: "load",
    value: function load() {
      var filepath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "maps/map.json";
      console.log("loading json file: ".concat(filepath));
      var mainThis = this;

      var error = function error(err) {
        return console.log("error loading ".concat(filepath), err);
      };

      this.pInst.loadJSON("".concat(filepath), mainThis.loadedJson.bind(mainThis), error);
    }
  }, {
    key: "loadedJson",
    value: function loadedJson(json) {
      if (json.surfaces) this.loadSurfaces(json);
      if (json.lines) this.loadLines(json);
    }
  }, {
    key: "loadSurfaces",
    value: function loadSurfaces(json) {
      var jSurfaces = json.surfaces;

      if (jSurfaces.length !== this.surfaces.length) {
        console.warn("json calibration file has ".concat(jSurfaces.length, " surface maps but there are ").concat(this.surfaces.length, " surface maps in memory (check sketch.js for # of map objects)"));
      } // TODO - don't remember what I was doing here...
      // in the future if we want to make sure only to load tris into tris, etc.


      var jTriSurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "TRI";
      });
      var jQuadSurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "QUAD";
      });
      var jBezSurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "BEZ";
      });
      var jPolySurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "POLY";
      });
      var mapTris = this.surfaces.filter(function (surf) {
        return surf.type === "TRI";
      });
      var mapQuads = this.surfaces.filter(function (surf) {
        return surf.type === "QUAD";
      });
      var mapBez = this.surfaces.filter(function (surf) {
        return surf.type === "BEZ";
      });
      var mapPolys = this.surfaces.filter(function (surf) {
        return surf.type === "POLY";
      }); // loading tris

      var index = 0;

      while (index < jTriSurfaces.length && index < mapTris.length) {
        var s = mapTris[index];
        if (s.isEqual(mapTris[index])) s.load(jTriSurfaces[index]);else console.warn("mismatch between calibration surface types / ids");
        index++;
      } // loading quads


      index = 0;

      while (index < jQuadSurfaces.length && index < mapQuads.length) {
        var _s3 = mapQuads[index];
        if (_s3.isEqual(mapQuads[index])) _s3.load(jQuadSurfaces[index]);else console.warn("mismatch between calibration surface types / ids");
        index++;
      } // loading bez


      index = 0;

      while (index < jBezSurfaces.length && index < mapBez.length) {
        var _s4 = mapBez[index];

        if (_s4.isEqual(mapBez[index])) {
          _s4.load(jBezSurfaces[index]);
        } else console.warn("mismatch between calibration bez surface types / ids");

        index++;
      } // loading poly


      index = 0;

      while (index < jPolySurfaces.length && index < mapPolys.length) {
        var _s5 = mapPolys[index];

        if (_s5.isEqual(mapPolys[index])) {
          _s5.load(jPolySurfaces[index]);
        } else console.warn("mismatch between calibration poly surface types / ids");

        index++;
      }
    }
  }, {
    key: "loadLines",
    value: function loadLines(json) {
      var jLines = json.lines;

      if (jLines.length !== this.lines.length) {
        console.warn("json calibration file has ".concat(jLines.length, " line maps but there are ").concat(this.lines.length, " line maps in memory"));
      }

      var index = 0;

      while (index < jLines.length && index < this.lines.length) {
        this.lines[index].load(jLines[index]);
        index++;
      }
    }
  }, {
    key: "save",
    value: function save() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "map.json";
      console.log("saving all mapped surfaces to json...");
      var json = {
        surfaces: [],
        lines: []
      }; // for (const mask of this.masks) {
      //     json.masks.push(mask.getJson());
      // }

      var _iterator = ProjectionMapper_createForOfIteratorHelper(this.surfaces),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var surface = _step.value;
          json.surfaces.push(surface.getJson());
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
          var line = _step2.value;
          json.lines.push(line.getJson());
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.pInst.saveJSON(json, "".concat(filename));
    } ////////////////////////////////////////
    // CALIBRATING
    ////////////////////////////////////////

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
    } ////////////////////////////////////////
    // RENDERING
    ////////////////////////////////////////

    /**
     * begins drawing surfaces
     *
     * @deprecated since v0.0.1
    */

  }, {
    key: "beginSurfaces",
    value: function beginSurfaces() {
      console.warn("beginSurfaces() is a deprecated method");
    }
    /**
     * ends drawing surfaces
     *
     * @deprecated since v0.0.1
    */

  }, {
    key: "endSurfaces",
    value: function endSurfaces() {
      console.warn("endSurfaces() is a deprecated method");
    }
    /**
     * renders surfaces
     *
     * @deprecated since v0.0.1
    */

  }, {
    key: "renderSurfaces",
    value: function renderSurfaces() {
      console.warn("renderSurfaces() is a deprecated method");
    }
    /**
     * displays surfaces
     *
     * @deprecated since v0.0.1
    */

  }, {
    key: "display",
    value: function display() {
      // if (this.selected) {
      //     this.selected.displaySelected();
      // }
      console.warn("display() is a deprecated method");
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      if (this.calibrate) {
        // for (const mask of this.masks) {
        //     mask.displayControlPoints();
        // }
        var _iterator3 = ProjectionMapper_createForOfIteratorHelper(this.surfaces),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var surface = _step3.value;
            surface.displayControlPoints();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var _iterator4 = ProjectionMapper_createForOfIteratorHelper(this.lines),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var lineMap = _step4.value;
            lineMap.displayCalibration();
            lineMap.displayControlPoints();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "getOscillator",
    value: function getOscillator(seconds) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return getPercentWave(seconds, offset);
    }
  }]);

  return ProjectionMapper;
}();

var pMapper = new ProjectionMapper();
/**
 * Initializes the projection mapper object
 *
 * @param {p5} pInst is the p5 object - useful for instance mode (??)
 * @param {number} w is the width of the buffer graphics object used to draw textures on mapped surfaces
 * @param {number} h is the height of the buffer graphics object...
 */

p5.prototype.createProjectionMapper = function (pInst, w, h) {
  if (!w) w = pInst.width;
  if (!h) h = pInst.height;
  pMapper.pInst = pInst;
  pMapper.init(w, h);
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
}; // p5.prototype.registerMethod('pre', () => pMapper.beginSurfaces());


p5.prototype.registerMethod('post', function () {
  return pMapper.displayControlPoints();
});
p5.prototype.registerMethod('post', function () {
  return pMapper.updateEvents();
});
/* harmony default export */ const src_ProjectionMapper = ((/* unused pure expression or super */ null && (pMapper)));
;// CONCATENATED MODULE: ./src/index.js

/******/ 	return __webpack_exports__;
/******/ })()
;
});