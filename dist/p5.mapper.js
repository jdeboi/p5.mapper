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
    var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;

    _classCallCheck(this, MovePoint);

    this.x = x;
    this.y = y;
    this.r = r;
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
      if (this.parent.type === "LINE") {
        this.moveToMouse();
      } else {
        this.x = this.xStartDrag + mouseX - this.clickX;
        this.y = this.yStartDrag + mouseY - this.clickY;
      }
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
      var c = col;

      if (this.isMouseOver() && isDragging(this)) {
        c = color(255);
      } // c = color(255);


      push();
      translate(0, 0, 5);
      stroke(c);
      strokeWeight(2);
      noFill();
      ellipse(this.x, this.y, this.r);
      fill(c);
      ellipse(this.x, this.y, this.r / 2);
      pop();
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
;// CONCATENATED MODULE: ./src/surfaces/Surface.js
function Surface_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Surface_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Surface_createClass(Constructor, protoProps, staticProps) { if (protoProps) Surface_defineProperties(Constructor.prototype, protoProps); if (staticProps) Surface_defineProperties(Constructor, staticProps); return Constructor; }

var Surface = /*#__PURE__*/function () {
  // since there's a limit on WEBGL context
  function Surface(id, w, h, res, type, buffer) {
    Surface_classCallCheck(this, Surface);

    // https://github.com/processing/p5.js/issues/3736
    // let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
    // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);
    // TODO - think about size of surface...
    this.width = constrain(w, 0, width);
    this.height = constrain(h, 0, height);
    this.id = id;
    this.res = Math.floor(res);
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.gridColor = color(200);
    this.controlPointColor = color(255, 0, 255);
    this.buffer = buffer;
  }

  Surface_createClass(Surface, [{
    key: "displaySolid",
    value: function displaySolid(col) {
      this.buffer.background(col);
      this.displayTexture(this.buffer);
    }
  }, {
    key: "displaySketch",
    value: function displaySketch(sketch) {
      this.buffer.clear();
      this.buffer.push(); // start by drawing everything on buffer at the top left

      this.buffer.translate(-this.buffer.width / 2, -this.buffer.height / 2); // now get in the middle for the final shape

      this.buffer.translate(this.width / 2, this.height / 2);
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
      this.display(tX, tY, tW, tH);
      pop();
    }
  }]);

  return Surface;
}(); // TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);


/* harmony default export */ const surfaces_Surface = (Surface);
;// CONCATENATED MODULE: ./src/surfaces/CornerPinSurface.js
function CornerPinSurface_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { CornerPinSurface_typeof = function _typeof(obj) { return typeof obj; }; } else { CornerPinSurface_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return CornerPinSurface_typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

    _this.controlPointColor = getRandomizedColor(_this.id, _this.type);
    return _this;
  } // ABSTRACT / OVERRIDDEN METHODS


  CornerPinSurface_createClass(CornerPinSurface, [{
    key: "render",
    value: function render() {}
  }, {
    key: "isMouseOver",
    value: function isMouseOver() {}
  }, {
    key: "calculateMesh",
    value: function calculateMesh() {}
  }, {
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
      } // for (let i = 0; i < this.res*this.res; i++) {
      // 	let x = floor(i % this.res) / (this.res - 1);
      // 	let y = floor(i / this.res) / (this.res - 1);
      // 	this.mesh[i] = new MeshPoint(this, x * this.width, y * this.height, x * this.width, y * this.height);
      // }


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
    }
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
    key: "isEqual",
    value: function isEqual(json) {
      return json.id === this.id && json.type === this.type;
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
    key: "select",
    value: function select() {
      // check if control points are selected
      var cp = this.isMouseOverControlPoints();

      if (cp) {
        cp.startDrag();
        return cp;
      } // then, see if the surface itself is selected


      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
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
    key: "moveTo",
    value: function moveTo() {
      this.x = this.xStartDrag + mouseX - this.clickX;
      this.y = this.yStartDrag + mouseY - this.clickY;
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
  }, {
    key: "displayOutline",
    value: function displayOutline() {
      strokeWeight(3);
      stroke(this.controlPointColor);
      fill(red(this.controlPointColor), green(this.controlPointColor), blue(this.controlPointColor), 50);
      beginShape();

      var _iterator4 = _createForOfIteratorHelper(this.controlPoints),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var cp = _step4.value;
          vertex(cp.x, cp.y);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      endShape(CLOSE);
    }
  }, {
    key: "beginDrawing",
    value: function beginDrawing() {
      this.push();
    }
  }, {
    key: "endDrawing",
    value: function endDrawing() {
      this.pop();
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
    key: "display",
    value: function display() {
      var tX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var tY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var tW = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
      var tH = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;
      beginShape(TRIANGLES);

      for (var x = 0; x < this.res - 1; x++) {
        for (var y = 0; y < this.res - 1; y++) {
          this.getQuadTriangles(x, y, tX, tY, tW, tH);
        }
      }

      endShape(CLOSE);

      if (isCalibratingMapper()) {
        translate(0, 0, 3);
        this.displayOutline();
        this.displayGrid();
      }
    } // render(tX = 0, tY = 0, tW = this.width, tH = this.height) {
    //     push();
    //     translate(this.x, this.y);
    //     texture(this);
    //     this.displayTriangles(tX, tY, tW, tH);
    //     if (isCalibratingMapper()) {
    //         translate(0, 0, 3);
    //         this.displayOutline();
    //         this.displayGrid();
    //     }
    //     pop();
    // }

  }, {
    key: "displayGrid",
    value: function displayGrid() {
      strokeWeight(2);
      stroke(this.controlPointColor);
      fill(red(this.controlPointColor), green(this.controlPointColor), blue(this.controlPointColor), 50); // stroke(200);
      // noFill();

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
    key: "display",
    value: function display() {
      beginShape();
      var u = 0;
      var v = this.height;
      vertex(this.mesh[this.BL].x, this.mesh[this.BL].y, u, v);
      u = this.width / 2;
      v = 0;
      vertex(this.mesh[this.TP].x, this.mesh[this.TP].y, u, v);
      u = this.width;
      v = this.height;
      vertex(this.mesh[this.BR].x, this.mesh[this.BR].y, u, v);
      endShape(CLOSE);

      if (isCalibratingMapper()) {
        // translate(0, 0, 1);
        this.displayOutline();
      }
    }
  }]);

  return TriMap;
}(surfaces_CornerPinSurface);

/* harmony default export */ const surfaces_TriMap = (TriMap);
;// CONCATENATED MODULE: ./src/lines/LineMap.js
function LineMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function LineMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LineMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) LineMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) LineMap_defineProperties(Constructor, staticProps); return Constructor; }


 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var LineMap = /*#__PURE__*/function () {
  function LineMap(x0, y0, x1, y1, id) {
    LineMap_classCallCheck(this, LineMap);

    this.id = id;
    this.x = 0;
    this.y = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.type = "LINE";
    this.lineW = 10;
    this.lastChecked = 0;
    this.lineC = color(255);
    this.highlightColor = color(0, 255, 0);
    this.controlPointColor = getRandomizedColor(this.id, this.type);
    this.p0 = new surfaces_MovePoint(this, x0, y0, 20);
    this.p1 = new surfaces_MovePoint(this, x1, y1, 20);
    this.controlCol = getRandomizedColor();
    this.leftToRight();
    this.ang = atan2(this.p0.y - this.p1.y, this.p0.x - this.p1.x);
    if (this.ang > PI / 2) this.ang -= 2 * PI;
  } //////////////////////////////////////////////
  // LOADING / SAVING
  //////////////////////////////////////////////


  LineMap_createClass(LineMap, [{
    key: "load",
    value: function load(json) {
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
      line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
      this.drawEndCaps(this.p0, this.p1, col, col);
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
      line(x0, y0, x1, y1);
      this.drawEndCaps({
        x: x0,
        y: y0
      }, {
        x: x1,
        y: y1
      }, col, col);
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
      line(this.p0.x, this.p0.y, pTemp.x, pTemp.y);
      this.drawEndCaps(p0, pTemp, col, col);
    }
  }, {
    key: "displayPercentWidth",
    value: function displayPercentWidth(per) {
      var col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineC;
      per = constrain(per, 0, 1.0);
      var sw = map(per, 0, 1.0, 0, 10);
      strokeWeight(sw);
      stroke(col);
      line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
      this.drawEndCaps(this.p0, this.p1, col, col, sw);
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
      this.p0.display(this.controlPointColor);
      this.p1.display(this.controlPointColor);
    }
  }, {
    key: "drawEndCaps",
    value: function drawEndCaps(p0, p1) {
      var col0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.lineC;
      var col1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.lineC;
      var w = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.lineW;
      noStroke();

      if (dist(p0.x, p0.y, p1.x, p1.y) > 1) {
        fill(col0);
        ellipse(p0.x, p0.y, w, w);
        fill(col1);
        ellipse(p1.x, p1.y, w, w);
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
      var pTempEnd = p5.Vector.lerp(pTemp, p1, startPer + sizePer);
      line(pTemp.x, pTemp.y, pTempEnd.x, pTempEnd.y);
      this.drawEndCaps(pTemp, pTempEnd, col, col);
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

  }, {
    key: "isMouseOverPoint",
    value: function isMouseOverPoint(p) {
      var d = dist(p.x, p.y, mouseX - width / 2, mouseY - height / 2);
      return d < p.r;
    } // www.jeffreythompson.org/collision-detection/line-point.php

  }, {
    key: "isMouseOver",
    value: function isMouseOver() {
      var x1 = this.p0.x;
      var y1 = this.p0.y;
      var x2 = this.p1.x;
      var y2 = this.p1.y;
      var px = mouseX - width / 2;
      var py = mouseY - height / 2;
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
    key: "select",
    value: function select() {
      var x = mouseX - width / 2;
      var y = mouseY - height / 2;
      if (dist(this.p0.x, this.p0.y, x, y) < this.p0.r) return this.p0;
      if (dist(this.p1.x, this.p1.y, x, y) < this.p1.r) return this.p1;
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
}();

/* harmony default export */ const lines_LineMap = (LineMap);
;// CONCATENATED MODULE: ./src/mask/Mask.js
function Mask_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = Mask_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function Mask_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Mask_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Mask_arrayLikeToArray(o, minLen); }

function Mask_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Mask_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Mask_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Mask_createClass(Constructor, protoProps, staticProps) { if (protoProps) Mask_defineProperties(Constructor.prototype, protoProps); if (staticProps) Mask_defineProperties(Constructor, staticProps); return Constructor; }




var Mask = /*#__PURE__*/function () {
  function Mask(id, numPoints) {
    Mask_classCallCheck(this, Mask);

    this.id = id;
    this.x = 0;
    this.y = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.xStartDrag = this.x;
    this.yStartDrag = this.y;
    this.type = "MASK";
    this.controlPointColor = getRandomizedColor(this.id, this.type);
    this.points = [];

    for (var i = 0; i < numPoints; i++) {
      var r = 200;
      var x = r * cos(i / numPoints * 2 * PI);
      var y = r * sin(i / numPoints * 2 * PI);

      if (!isWEBGL()) {
        x += width / 2;
        y += height / 2;
      }

      var cp = new surfaces_MovePoint(this, x, y);
      cp.isControlPoint = true;
      this.points.push(cp);
    }
  }

  Mask_createClass(Mask, [{
    key: "setPoints",
    value: function setPoints(pts) {
      this.points = [];

      var _iterator = Mask_createForOfIteratorHelper(pts),
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
    key: "display",
    value: function display() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : color(0);
      push();
      translate(this.x, this.y, 1);
      noStroke();
      if (isCalibratingMapper()) fill(this.controlPointColor);else {
        fill(col);
        stroke(col);
      }
      beginShape();

      var _iterator2 = Mask_createForOfIteratorHelper(this.points),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var point = _step2.value;
          vertex(point.x, point.y);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      endShape();
      pop();
    }
  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      push();
      translate(this.x, this.y, 2);

      var _iterator3 = Mask_createForOfIteratorHelper(this.points),
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

      var _iterator4 = Mask_createForOfIteratorHelper(points),
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
    key: "isEqual",
    value: function isEqual(json) {
      return json.type === this.type && json.id === this.id;
    }
  }, {
    key: "select",
    value: function select() {
      // check control points
      var _iterator5 = Mask_createForOfIteratorHelper(this.points),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var p = _step5.value;

          if (p.isMouseOver()) {
            p.startDrag();
            return p;
          }
        } // then, see if the mask itself is selected

      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      if (this.isMouseOver()) {
        this.startDrag();
        return this;
      }

      return null;
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
    key: "moveTo",
    value: function moveTo() {
      this.x = this.xStartDrag + mouseX - this.clickX;
      this.y = this.yStartDrag + mouseY - this.clickY;
    }
  }]);

  return Mask;
}();

/* harmony default export */ const mask_Mask = (Mask);
;// CONCATENATED MODULE: ./src/surfaces/Bezier/BezierMap.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || BezierMap_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return BezierMap_arrayLikeToArray(arr); }

function BezierMap_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = BezierMap_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function BezierMap_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return BezierMap_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return BezierMap_arrayLikeToArray(o, minLen); }

function BezierMap_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function BezierMap_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BezierMap_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BezierMap_createClass(Constructor, protoProps, staticProps) { if (protoProps) BezierMap_defineProperties(Constructor.prototype, protoProps); if (staticProps) BezierMap_defineProperties(Constructor, staticProps); return Constructor; }

var BezierMap = /*#__PURE__*/function () {
  // constructor(json = null) {
  //     if (json) {
  //         this.load(json);
  //     }
  //     else {
  //         this.initEmpty();
  //     }
  //     // let filePath = "../../src/surfaces/Bezier/shader."
  //     // this.theShader = loadShader(filePath + "vert", filePath + "frag")
  // }
  function BezierMap(buffer) {
    BezierMap_classCallCheck(this, BezierMap);

    this.buffer = buffer;
    this.initEmpty();
  }

  BezierMap_createClass(BezierMap, [{
    key: "initEmpty",
    value: function initEmpty() {
      this.points = [];
      this.points.push(createVector(-100, 0));
      this.points.push(createVector(-50, -50));
      this.points.push(createVector(50, 50));
      this.points.push(createVector(100, 0));
      this.closed = false;
      this.auto = false;
      this.toggleClosed();
    }
  }, {
    key: "load",
    value: function load(json) {
      this.points = [];

      var _iterator = BezierMap_createForOfIteratorHelper(json.points),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          this.points.push(createVector(p.x, p.y));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.closed = json.closed;
      this.auto = json.auto;
    }
  }, {
    key: "getJson",
    value: function getJson() {
      return {
        points: this.points.map(function (p) {
          return {
            x: p.x - width / 2,
            y: p.y - height / 2
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
        var anchor1 = this.points[this.points.length - 1];
        var control1 = this.points[this.points.length - 2];
        var anchor2 = this.points[0];
        var control2 = this.points[1];
        var newControl1 = p5.Vector.lerp(anchor1, control1, -1);
        var newControl2 = p5.Vector.lerp(anchor2, control2, -1);
        this.points.push(newControl1, newControl2);
      }
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
      var prevAnchor = this.points[this.points.length - 2];
      var prevControl = this.points[this.points.length - 1];
      var anchor = createVector(x, y);
      var control1 = p5.Vector.lerp(prevControl, prevAnchor, -1);
      var control2 = p5.Vector.lerp(control1, anchor, 0.5);
      this.points.push(control1, control2, anchor);
    }
  }, {
    key: "movePoint",
    value: function movePoint(point, x, y, mode) {
      var i = this.points.indexOf(point);

      if (i % 3 == 0) {
        var dx = x - point.x;
        var dy = y - point.y;
        point.set(x, y);

        if (i - 1 >= 0 || this.closed) {
          this.points[this.loopIndex(i - 1)].add(dx, dy);
        }

        if (i + 1 < this.points.length || this.closed) {
          this.points[this.loopIndex(i + 1)].add(dx, dy);
        }

        if (mode == AUTOMATIC) this.autoSetAllControlPoints();
      } else if (mode != AUTOMATIC) {
        point.set(x, y);
        var anchorI = i % 3 == 1 ? i - 1 : i + 1;
        var otherI = i % 3 == 1 ? i - 2 : i + 2;

        if (otherI >= 0 && otherI < this.points.length || this.closed) {
          var anchor = this.points[this.loopIndex(anchorI)];
          var other = this.points[this.loopIndex(otherI)];

          if (mode == ALIGNED) {
            var dist = p5.Vector.dist(anchor, other);
            var disp = p5.Vector.sub(anchor, point);
            disp.setMag(dist);
            other.set(p5.Vector.add(anchor, disp));
          } else if (mode == MIRRORED) {
            other.set(p5.Vector.lerp(anchor, point, -1));
          }
        }
      }
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
      this.points[1].set(p5.Vector.lerp(this.points[0], this.points[2], controlSpacing));
      this.points[this.points.length - 2].set(p5.Vector.lerp(this.points[this.points.length - 1], this.points[this.points.length - 3], controlSpacing));
    }
  }, {
    key: "autoSetAllControlPoints",
    value: function autoSetAllControlPoints(controlSpacing) {
      for (var i = 0; i < this.points.length; i += 3) {
        this.autoSetControlPoint(i, controlSpacing);
      }

      this.autoSetEdgePoints(controlSpacing);
    } // render(fillC, strokeC) {
    //     stroke(strokeC);
    //     beginShape();
    //     vertex(this.points[0].x, this.points[0].y)
    //     for (let i = 0; i < this.numSegments(); i++) {
    //         const seg = this.getSegment(i);
    //         bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
    //     }
    //     endShape();
    // }

  }, {
    key: "displayTexture",
    value: function displayTexture(tex) {
      var _this$getBounds = this.getBounds(),
          x = _this$getBounds.x,
          y = _this$getBounds.y,
          w = _this$getBounds.w,
          h = _this$getBounds.h;

      this.buffer.clear();
      this.buffer.push();
      this.buffer.background('white'); // this.buffer.translate(-this.buffer.width / 2-x/2, -this.buffer.height / 2-y/2);

      this.buffer.fill(255); // this.buffer.beginShape();
      // this.buffer.vertex(this.points[0].x, this.points[0].y)
      // for (let i = 0; i < this.numSegments(); i++) {
      //     const seg = this.getSegment(i);
      //     this.buffer.bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
      // }
      // this.buffer.endShape();

      this.buffer.pop(); // tex.mask(this.buffer);

      image(tex, 0, 0); // this.buffer.pop();
      // tex.mask(this.buffer);
      // image(tex, 0, 0);
    }
  }, {
    key: "displaySolid",
    value: function displaySolid(col) {
      noStroke();
      fill(col);
      beginShape();
      vertex(this.points[0].x, this.points[0].y);

      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        bezierVertex(seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y);
      }

      endShape();

      if (isCalibratingMapper()) {
        translate(0, 0, 3);
        this.displayControls();
      }
    }
  }, {
    key: "getBounds",
    value: function getBounds() {
      var minX = Math.min.apply(Math, _toConsumableArray(this.points.map(function (pt) {
        return pt.x;
      })));
      var maxX = Math.max.apply(Math, _toConsumableArray(this.points.map(function (pt) {
        return pt.x;
      })));
      var minY = Math.min.apply(Math, _toConsumableArray(this.points.map(function (pt) {
        return pt.y;
      })));
      var maxY = Math.max.apply(Math, _toConsumableArray(this.points.map(function (pt) {
        return pt.y;
      })));
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY
      };
    }
  }, {
    key: "displayControls",
    value: function displayControls() {
      var lineC = color(255); // this.render(color(0, 255, 0), lineC);

      this.displayControlCircles(lineC);

      if (!this.auto) {
        this.displayControlLines(lineC);
      }
    }
  }, {
    key: "displayControlLines",
    value: function displayControlLines(strokeC) {
      for (var i = 0; i < this.numSegments(); i++) {
        var seg = this.getSegment(i);
        stroke(strokeC);
        line(seg[0].x, seg[0].y, seg[1].x, seg[1].y);
        line(seg[2].x, seg[2].y, seg[3].x, seg[3].y);
      }
    }
  }, {
    key: "displayControlCircles",
    value: function displayControlCircles(strokeC) {
      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        stroke(strokeC);
        strokeWeight(1);

        if (i % 3 == 0) {
          fill(255, 0, 0);
          circle(p.x, p.y, 10);
        } else if (!this.auto) {
          fill(255);
          circle(p.x, p.y, 8);
        }
      }
    }
  }]);

  return BezierMap;
}();

/* harmony default export */ const Bezier_BezierMap = (BezierMap);
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
    this.masks = [];
    this.dragged = null;
    this.calibrate = false;
    this.pInst = null;
    this.pMousePressed = false;
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


  ProjectionMapper_createClass(ProjectionMapper, [{
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
    key: "createMaskMap",
    value: function createMaskMap() {
      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
      if (numPoints < 3) numPoints = 3;
      var mask = new mask_Mask(this.masks.length, numPoints);
      this.masks.push(mask);
      return mask;
    }
  }, {
    key: "createBezierMap",
    value: function createBezierMap() {
      var bez = new Bezier_BezierMap(this.buffer);
      return bez;
    } ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////

  }, {
    key: "onClick",
    value: function onClick() {
      // ignore input events if the calibrate flag is not set
      if (!this.calibrate) return; // first check masks

      var top = null;

      var _iterator = ProjectionMapper_createForOfIteratorHelper(this.masks),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mask = _step.value;
          this.dragged = mask.select();

          if (this.dragged != null) {
            top = mask;
            return;
          }
        } // Check Lines
        // navigate the list backwards, as to select 

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      for (var i = this.lines.length - 1; i >= 0; i--) {
        var s = this.lines[i];
        this.dragged = s.select();

        if (this.dragged != null) {
          top = s;
          return;
        }
      } // check mapping surfaces


      for (var _i = this.surfaces.length - 1; _i >= 0; _i--) {
        var _s = this.surfaces[_i];
        this.dragged = _s.select();

        if (this.dragged != null) {
          top = _s;
          return;
        }
      }

      if (top != null) {// TODO
        // moved the dragged surface to the beginning of the list
        // this actually breaks the load/save order.
        // in the new version, add IDs to surfaces so we can just 
        // re-load in the right order (or create a separate list 
        // for selection/rendering)
        //let i = surfaces.indexOf(top);
        //surfaces.remove(i);
        //surfaces.add(0, top);
      }
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
      if (json.masks) this.loadMasks(json);
      if (json.surfaces) this.loadSurfaces(json);
      if (json.lines) this.loadLines(json);
    }
  }, {
    key: "loadMasks",
    value: function loadMasks(json) {
      var jMasks = json.masks;

      if (jMasks.length !== this.masks.length) {
        console.warn("json calibration file has ".concat(jMasks.length, " masks but there are ").concat(this.masks.length, " masks in memory (check sketch.js for # of mask objects)"));
      }

      var index = 0;

      while (index < jMasks.length && index < this.masks.length) {
        var s = this.masks[index];
        if (s.isEqual(this.masks[index])) s.load(jMasks[index]);else console.warn("mismatch between calibration mask types / ids");
        index++;
      }
    }
  }, {
    key: "loadSurfaces",
    value: function loadSurfaces(json) {
      var jSurfaces = json.surfaces;

      if (jSurfaces.length !== this.surfaces.length) {
        console.warn("json calibration file has ".concat(jSurfaces.length, " surface maps but there are ").concat(this.surfaces.length, " surface maps in memory (check sketch.js for # of map objects)"));
      } // in the future if we want to make sure only to load tris into tris, etc.


      var jTriSurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "TRI";
      });
      var jQuadSurfaces = jSurfaces.filter(function (surf) {
        return surf.type === "QUAD";
      });
      var mapTris = this.surfaces.filter(function (surf) {
        return surf.type === "TRI";
      });
      var mapQuads = this.surfaces.filter(function (surf) {
        return surf.type === "QUAD";
      }); // loading tris

      var index = 0;

      while (index < jTriSurfaces.length && index < mapTris.length) {
        var s = mapTris[index];
        if (s.isEqual(mapTris[index])) s.load(jTriSurfaces[index]);else console.warn("mismatch between calibration surface types / ids");
        index++;
      } // loading quads


      index = 0;

      while (index < jQuadSurfaces.length && index < mapQuads.length) {
        var _s2 = mapQuads[index];
        if (_s2.isEqual(mapQuads[index])) _s2.load(jQuadSurfaces[index]);else console.warn("mismatch between calibration surface types / ids");
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
        lines: [],
        masks: []
      };

      var _iterator2 = ProjectionMapper_createForOfIteratorHelper(this.masks),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var mask = _step2.value;
          json.masks.push(mask.getJson());
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = ProjectionMapper_createForOfIteratorHelper(this.surfaces),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var surface = _step3.value;
          json.surfaces.push(surface.getJson());
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
          var line = _step4.value;
          json.lines.push(line.getJson());
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
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
    // beginSurfaces() {
    //     for (const surface of this.surfaces) {
    //         surface.beginDrawing();
    //     }
    // }
    // endSurfaces() {
    //     for (const surface of this.surfaces) {
    //         surface.endDrawing();
    //     }
    // }
    // renderSurfaces() {
    //     this.endSurfaces();
    //     for (const surface of this.surfaces) {
    //         surface.render();
    //     }
    // }
    // display() {
    //     this.renderSurfaces();
    //     this.displayControlPoints();
    // }

  }, {
    key: "displayControlPoints",
    value: function displayControlPoints() {
      if (this.calibrate) {
        var _iterator5 = ProjectionMapper_createForOfIteratorHelper(this.masks),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var mask = _step5.value;
            mask.displayControlPoints();
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        var _iterator6 = ProjectionMapper_createForOfIteratorHelper(this.surfaces),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var surface = _step6.value;
            surface.displayControlPoints();
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var _iterator7 = ProjectionMapper_createForOfIteratorHelper(this.lines),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var lineMap = _step7.value;
            lineMap.displayCalibration();
            lineMap.displayControlPoints();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
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

p5.prototype.createProjectionMapper = function (pInst) {
  pMapper.pInst = pInst;
  pMapper.buffer = pInst.createGraphics(pInst.width, pInst.height, pInst.WEBGL);
  return pMapper;
};

p5.prototype.isCalibratingMapper = function () {
  return pMapper.calibrate;
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