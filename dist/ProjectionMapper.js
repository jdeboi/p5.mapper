"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QuadMap_1 = __importDefault(require("./surfaces/QuadMap"));
var TriMap_1 = __importDefault(require("./surfaces/TriMap"));
var PolyMap_1 = __importDefault(require("./surfaces/PolyMap"));
var BezierMap_1 = __importDefault(require("./surfaces/Bezier/BezierMap"));
var LineMap_1 = __importDefault(require("./lines/LineMap"));
var helpers_1 = require("./helpers/helpers");
var ProjectionMapper = /** @class */ (function () {
    function ProjectionMapper() {
        this.buffer;
        // for pOutput bezier
        this.bufferWEBGL;
        this.surfaces = [];
        this.lines = [];
        this.dragged = null;
        this.selected = null;
        this.calibrate = false;
        this.pInst = null;
        this.pMousePressed = false;
        this.moveMode = "ALL";
        this.bezBuffer = null;
        this.bezShader = null;
        this.bezierShaderLoaded = false;
        this.lastFrame = -1;
    }
    ProjectionMapper.prototype.preload = function (shader) {
        this.bezShader = shader;
        this.bezierShaderLoaded = true;
    };
    ProjectionMapper.prototype.init = function (w, h) {
        if (this.bezBuffer == null) {
            this.bufferWEBGL = this.pInst.createGraphics(w, h, this.pInst.WEBGL);
            // TODO
            // should these be WEBGL??
            // warning about reading frequently??
            // https://stackoverflow.com/questions/74020182/canvas2d-multiple-readback-operations-using-getimagedata-are-faster-with-the-wi
            this.buffer = this.pInst.createGraphics(w, h);
            this.bezBuffer = this.pInst.createGraphics(w, h);
            this.initPMapperShaderStr();
        }
    };
    // TODO - doesn't work for some reason?
    // I'm honestly very confused; seems to need this and
    // redefining in BezierMap.js?
    // https://github.com/processing/p5.js/issues/4899
    ProjectionMapper.prototype.initPMapperShaderStr = function () {
        var frag = "// https://github.com/aferriss/p5jsShaderExamples \n        #ifdef GL_ES\n        precision mediump float;\n        #endif\n        \n        // grab texcoords from vert shader\n        varying vec2 vTexCoord;\n        \n        // our texture coming from p5\n        uniform sampler2D texMask;\n        uniform sampler2D texImg;\n        \n        \n        void main() {\n          vec2 uv = vTexCoord;\n          \n          // the texture is loaded upside down and backwards by default so lets flip it\n          uv.y = 1.0 - uv.y;\n          \n          vec4 maskT = texture2D(texMask, uv);\n          vec4 imgT = texture2D(texImg, uv);\n          \n          float gray = (maskT.r + maskT.g + maskT.b) / 3.0;\n        \n          // mask\n          float threshR = imgT.r* gray ;\n          float threshG = imgT.g* gray ;\n          float threshB = imgT.b* gray ;\n          vec3 thresh = vec3(threshR, threshG, threshB);\n        \n          // render the output\n          gl_FragColor = vec4(thresh, gray);\n        }";
        var vert = "// vert file and comments from adam ferriss\n        // https://github.com/aferriss/p5jsShaderExamples\n        \n        #ifdef GL_ES\n        precision mediump float;\n        #endif\n        \n        // our vertex data\n        attribute vec3 aPosition;\n        attribute vec2 aTexCoord;\n        \n        // lets get texcoords just for fun! \n        varying vec2 vTexCoord;\n        \n        void main() {\n          // copy the texcoords\n          vTexCoord = aTexCoord;\n        \n          // copy the position data into a vec4, using 1.0 as the w component\n          vec4 positionVec4 = vec4(aPosition, 1.0);\n          positionVec4.xy = positionVec4.xy * 2.0 - 1.0;\n        \n          // send the vertex information on to the fragment shader\n          gl_Position = positionVec4;\n        }";
        this.bezShader = this.bufferWEBGL.createShader(vert, frag);
        this.bezierShaderLoaded = true;
    };
    ////////////////////////////////////////
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
    ProjectionMapper.prototype.createQuadMap = function (w, h, res) {
        if (res === void 0) { res = 20; }
        var s = new QuadMap_1.default(this.surfaces.length, w, h, res, this.buffer, this.pInst);
        this.surfaces.push(s);
        return s;
    };
    /**
     * Creates and registers a new triangle surface.
     *
     * @param w width
     * @param h height
     * @param res resolution (number of tiles per axis)
     * @return
     */
    ProjectionMapper.prototype.createTriMap = function (w, h, res) {
        if (res === void 0) { res = 20; }
        var s = new TriMap_1.default(this.surfaces.length, w, h, res, this.buffer, this.pInst);
        this.surfaces.push(s);
        return s;
    };
    ProjectionMapper.prototype.createLineMap = function (x0, y0, x1, y1) {
        if (x0 === void 0) { x0 = 0; }
        if (y0 === void 0) { y0 = 0; }
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x0 == 0 && y0 == 0 && x1 == 0 && y1 == 0) {
            x1 = 200;
            y0 = 30 * this.lines.length;
            y1 = 30 * this.lines.length;
        }
        var l = new LineMap_1.default(x0, y0, x1, y1, this.lines.length, this.pInst);
        this.lines.push(l);
        return l;
    };
    ProjectionMapper.prototype.createPolyMap = function (numPoints) {
        if (numPoints === void 0) { numPoints = 3; }
        if (numPoints < 3)
            numPoints = 3;
        var s = new PolyMap_1.default(this.surfaces.length, numPoints, this.buffer, this.pInst);
        this.surfaces.push(s);
        return s;
    };
    ProjectionMapper.prototype.createBezierMap = function (numPoints) {
        if (numPoints === void 0) { numPoints = 5; }
        // why was it calling this twice??
        var bez = new BezierMap_1.default(this.surfaces.length, numPoints, this, this.pInst);
        this.surfaces.push(bez);
        return bez;
    };
    ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////
    ProjectionMapper.prototype.onClick = function () {
        // ignore input events if the calibrate flag is not set
        if (!this.calibrate)
            return;
        if (this.moveMode == "SURFACES") {
            this.checkSurfacesClick();
        }
        else if (this.moveMode == "POINTS") {
            this.checkPointsClick();
        }
        else {
            if (!this.checkPointsClick()) {
                this.checkSurfacesClick();
            }
        }
    };
    ProjectionMapper.prototype.moveSurfaces = function () {
        this.moveMode = "SURFACES";
    };
    ProjectionMapper.prototype.moveControlPoints = function () {
        this.moveMode = "POINTS";
    };
    ProjectionMapper.prototype.moveAll = function () {
        this.moveMode = "ALL";
    };
    ProjectionMapper.prototype.isMovingPoints = function () {
        return this.moveMode == "ALL" || this.moveMode == "POINTS";
    };
    ProjectionMapper.prototype.checkSurfacesClick = function () {
        // Check Lines
        // navigate the list backwards, as to select
        for (var i = this.lines.length - 1; i >= 0; i--) {
            var s = this.lines[i];
            this.dragged = s.selectSurface();
            if (this.dragged != null) {
                return true;
            }
        }
        // check mapping surfaces
        for (var i = this.surfaces.length - 1; i >= 0; i--) {
            var s = this.surfaces[i];
            this.dragged = s.selectSurface();
            if (this.dragged != null) {
                this.selected = s;
                return true;
            }
        }
        this.selected = null;
        return false;
    };
    ProjectionMapper.prototype.checkPointsClick = function () {
        // Check Lines
        // navigate the list backwards, as to select
        for (var i = this.lines.length - 1; i >= 0; i--) {
            var s = this.lines[i];
            this.dragged = s.selectPoints();
            if (this.dragged != null) {
                return true;
            }
        }
        // TODO - check bez control points before anchors
        // check mapping surfaces
        for (var i = this.surfaces.length - 1; i >= 0; i--) {
            var s = this.surfaces[i];
            this.dragged = s.selectPoints();
            if (this.dragged != null) {
                this.selected = s;
                return true;
            }
        }
        this.selected = null;
        return false;
    };
    ProjectionMapper.prototype.checkSelectedClick = function () {
        // first check masks
        if (this.selected) {
            this.dragged = this.selected.selectPoints();
            if (this.dragged)
                return true;
            return false;
        }
        return false;
    };
    ProjectionMapper.prototype.onDrag = function () {
        if (this.dragged != null)
            this.dragged.moveTo();
    };
    ProjectionMapper.prototype.onRelease = function () {
        this.dragged = null;
    };
    ProjectionMapper.prototype.isDragging = function (surface) {
        // TODO - ??? why return true?
        // need to remember what I was doing here
        if (this.dragged === null)
            return true;
        return this.dragged === surface;
    };
    ProjectionMapper.prototype.updateEvents = function () {
        if (this.pInst.mouseIsPressed) {
            if (!this.pMousePressed) {
                this.onClick();
            }
            else {
                this.onDrag();
            }
        }
        else {
            if (this.pMousePressed) {
                this.onRelease();
            }
        }
        this.pMousePressed = this.pInst.mouseIsPressed;
    };
    ////////////////////////////////////////
    // LOADING / SAVING
    ////////////////////////////////////////
    ProjectionMapper.prototype.load = function (filepath, callback) {
        if (filepath === void 0) { filepath = "maps/map.json"; }
        if (callback === void 0) { callback = null; }
        console.log("loading json file: ".concat(filepath));
        var mainThis = this;
        var error = function (err) { return console.log("error loading ".concat(filepath), err); };
        this.pInst.loadJSON("".concat(filepath), function (json) {
            mainThis.loadedJson.bind(mainThis)(json);
            if (callback)
                callback();
        }, error);
    };
    ProjectionMapper.prototype.loadedJson = function (json) {
        if (json.surfaces)
            this.loadSurfaces(json);
        if (json.lines)
            this.loadLines(json);
    };
    ProjectionMapper.prototype.loadSurfaces = function (json) {
        var jSurfaces = json.surfaces;
        if (jSurfaces.length !== this.surfaces.length) {
            console.warn("json calibration file has ".concat(jSurfaces.length, " surface maps but there are ").concat(this.surfaces.length, " surface maps in memory (check sketch.js for # of map objects)"));
        }
        // TODO - don't remember what I was doing here...
        // in the future if we want to make sure only to load tris into tris, etc.
        var jTriSurfaces = jSurfaces.filter(function (surf) { return surf.type === "TRI"; });
        var jQuadSurfaces = jSurfaces.filter(function (surf) { return surf.type === "QUAD"; });
        var jBezSurfaces = jSurfaces.filter(function (surf) { return surf.type === "BEZ"; });
        var jPolySurfaces = jSurfaces.filter(function (surf) { return surf.type === "POLY"; });
        var mapTris = this.surfaces.filter(function (surf) { return surf.type === "TRI"; });
        var mapQuads = this.surfaces.filter(function (surf) { return surf.type === "QUAD"; });
        var mapBez = this.surfaces.filter(function (surf) { return surf.type === "BEZ"; });
        var mapPolys = this.surfaces.filter(function (surf) { return surf.type === "POLY"; });
        // loading tris
        var index = 0;
        while (index < jTriSurfaces.length && index < mapTris.length) {
            var s = mapTris[index];
            if (s.isEqual(mapTris[index]))
                s.load(jTriSurfaces[index]);
            else
                console.warn("mismatch between calibration surface types / ids");
            index++;
        }
        // loading quads
        index = 0;
        while (index < jQuadSurfaces.length && index < mapQuads.length) {
            var s = mapQuads[index];
            if (s.isEqual(mapQuads[index]))
                s.load(jQuadSurfaces[index]);
            else
                console.warn("mismatch between calibration surface types / ids");
            index++;
        }
        // loading bez
        index = 0;
        while (index < jBezSurfaces.length && index < mapBez.length) {
            var s = mapBez[index];
            if (s.isEqual(mapBez[index])) {
                s.load(jBezSurfaces[index]);
            }
            else
                console.warn("mismatch between calibration bez surface types / ids");
            index++;
        }
        // loading poly
        index = 0;
        while (index < jPolySurfaces.length && index < mapPolys.length) {
            var s = mapPolys[index];
            if (s.isEqual(mapPolys[index])) {
                s.load(jPolySurfaces[index]);
            }
            else
                console.warn("mismatch between calibration poly surface types / ids");
            index++;
        }
    };
    ProjectionMapper.prototype.loadLines = function (json) {
        var jLines = json.lines;
        if (jLines.length !== this.lines.length) {
            console.warn("json calibration file has ".concat(jLines.length, " line maps but there are ").concat(this.lines.length, " line maps in memory"));
        }
        var index = 0;
        while (index < jLines.length && index < this.lines.length) {
            this.lines[index].load(jLines[index]);
            index++;
        }
    };
    ProjectionMapper.prototype.save = function (filename) {
        if (filename === void 0) { filename = "map.json"; }
        console.log("saving all mapped surfaces to json...");
        var json = { surfaces: [], lines: [] };
        // for (const mask of this.masks) {
        //     json.masks.push(mask.getJson());
        // }
        for (var _i = 0, _a = this.surfaces; _i < _a.length; _i++) {
            var surface = _a[_i];
            json.surfaces.push(surface.getJson());
        }
        for (var _b = 0, _c = this.lines; _b < _c.length; _b++) {
            var line = _c[_b];
            json.lines.push(line.getJson());
        }
        this.pInst.saveJSON(json, "".concat(filename));
    };
    ////////////////////////////////////////
    // CALIBRATING
    ////////////////////////////////////////
    ProjectionMapper.prototype.startCalibration = function () {
        this.calibrate = true;
    };
    ProjectionMapper.prototype.stopCalibration = function () {
        this.calibrate = false;
    };
    ProjectionMapper.prototype.toggleCalibration = function () {
        this.calibrate = !this.calibrate;
    };
    ////////////////////////////////////////
    // RENDERING
    ////////////////////////////////////////
    /**
     * begins drawing surfaces
     *
     * @deprecated since v0.0.1
     */
    ProjectionMapper.prototype.beginSurfaces = function () {
        console.warn("beginSurfaces() is a deprecated method");
    };
    /**
     * ends drawing surfaces
     *
     * @deprecated since v0.0.1
     */
    ProjectionMapper.prototype.endSurfaces = function () {
        console.warn("endSurfaces() is a deprecated method");
    };
    /**
     * renders surfaces
     *
     * @deprecated since v0.0.1
     */
    ProjectionMapper.prototype.renderSurfaces = function () {
        console.warn("renderSurfaces() is a deprecated method");
    };
    /**
     * displays surfaces
     *
     * @deprecated since v0.0.1
     */
    ProjectionMapper.prototype.display = function () {
        // if (this.selected) {
        //     this.selected.displaySelected();
        // }
        console.warn("display() is a deprecated method");
    };
    ProjectionMapper.prototype.displayControlPoints = function () {
        if (this.calibrate) {
            // for (const mask of this.masks) {
            //     mask.displayControlPoints();
            // }
            for (var _i = 0, _a = this.surfaces; _i < _a.length; _i++) {
                var surface = _a[_i];
                surface.displayControlPoints();
            }
            for (var _b = 0, _c = this.lines; _b < _c.length; _b++) {
                var lineMap = _c[_b];
                lineMap.displayCalibration();
                lineMap.displayControlPoints();
            }
        }
    };
    ProjectionMapper.prototype.getOscillator = function (seconds, offset) {
        if (offset === void 0) { offset = 0; }
        return (0, helpers_1.getPercentWave)(this.pInst, seconds, offset);
    };
    return ProjectionMapper;
}());
var pMapper = new ProjectionMapper();
/**
 * Initializes the projection mapper object
 *
 * @param {p5} pInst is the p5 object - useful for instance mode (??)
 * @param {number} w is the width of the buffer graphics object used to draw textures on mapped surfaces
 * @param {number} h is the height of the buffer graphics object...
 */
p5.prototype.createProjectionMapper = function (pInst, w, h) {
    if (!w)
        w = pInst.width;
    if (!h)
        h = pInst.height;
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
};
p5.prototype.initPMapperShader = function () {
    // TODO - is there a better way to do this?
    // const filePath = "../../src/surfaces/Bezier/shader";
    // const filePath = "https://cdn.jsdelivr.net/gh/jdeboi/p5.mapper/src/surfaces/Bezier/shader"
    var filePath = "https://cdn.statically.io/gh/jdeboi/p5.mapper/main/src/surfaces/Bezier/shader";
    this.loadShader(filePath + ".vert", filePath + ".frag", function (bezShader) {
        return pMapper.preload(bezShader);
    });
};
// p5.prototype.registerMethod('init', p5.prototype.initPMapperShader);
// p5.prototype.registerMethod('pre', () => pMapper.beginSurfaces());
p5.prototype.registerMethod("post", function () { return pMapper.displayControlPoints(); });
p5.prototype.registerMethod("post", function () { return pMapper.updateEvents(); });
exports.default = pMapper;
