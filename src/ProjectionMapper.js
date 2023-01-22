import QuadMap from './surfaces/QuadMap';
import TriMap from './surfaces/TriMap';
import PolyMap from './surfaces/PolyMap';
import BezierMap from './surfaces/Bezier/BezierMap';
import LineMap from './lines/LineMap';

import { getPercentWave } from './helpers/helpers';

class ProjectionMapper {

    constructor() {
        this.buffer;
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

    preload(shader) {
        this.bezShader = shader;
        this.bezierShaderLoaded = true;
    }

    init(w, h) {
        if (this.bezBuffer == null) {
            // TODO
            // should these be WEBGL??

            // TODO
            // warning about reading frequently?? 
            // https://stackoverflow.com/questions/74020182/canvas2d-multiple-readback-operations-using-getimagedata-are-faster-with-the-wi
            this.buffer = this.pInst.createGraphics(w, h);
            this.bufferWEBGL = this.pInst.createGraphics(w, h, WEBGL);
            this.bezBuffer = this.pInst.createGraphics(w, h);


        }
    }

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
    createQuadMap(w, h, res = 20) {
        const s = new QuadMap(this.surfaces.length, w, h, res, this.buffer);
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
    createTriMap(w, h, res = 20) {
        const s = new TriMap(this.surfaces.length, w, h, res, this.buffer);
        this.surfaces.push(s);
        return s;
    }

    createLineMap(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
        if (x0 == 0 && y0 == 0 && x1 == 0 && y1 == 0) {
            x1 = 200;
            y0 = 30 * this.lines.length;
            y1 = 30 * this.lines.length;
        }
        const l = new LineMap(x0, y0, x1, y1, this.lines.length);
        this.lines.push(l);
        return l;
    }

    createPolyMap(numPoints = 3) {
        if (numPoints < 3)
            numPoints = 3;

        let s = new PolyMap(this.surfaces.length, numPoints, this.buffer);
        this.surfaces.push(s);
        return s;
    }

    createBezierMap(numPoints = 5) {
        // why was it calling this twice??
        let bez = new BezierMap(this.surfaces.length, numPoints, this.pInst, this);
        this.surfaces.push(bez);
        return bez;
    }

    ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////
    onClick() {
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

    }

    moveSurfaces() {
        this.moveMode = "SURFACES";
    }

    moveControlPoints() {
        this.moveMode = "POINTS";
    }

    moveAll() {
        this.moveMode = "ALL";
    }

    isMovingPoints() {
        return this.moveMode == "ALL" || this.moveMode == "POINTS";
    }

    checkSurfacesClick() {

        // Check Lines
        // navigate the list backwards, as to select 
        for (let i = this.lines.length - 1; i >= 0; i--) {
            let s = this.lines[i];
            this.dragged = s.selectSurface();
            if (this.dragged != null) {
                return true;
            }
        }

        // check mapping surfaces
        for (let i = this.surfaces.length - 1; i >= 0; i--) {
            let s = this.surfaces[i];
            this.dragged = s.selectSurface();
            if (this.dragged != null) {
                this.selected = s;
                return true;
            }
        }
        this.selected = null;
        return false;
    }

    checkPointsClick() {

        // Check Lines
        // navigate the list backwards, as to select 
        for (let i = this.lines.length - 1; i >= 0; i--) {
            let s = this.lines[i];
            this.dragged = s.selectPoints();
            if (this.dragged != null) {
                return true;
            }
        }

        // TODO - check bez control points before anchors
        // check mapping surfaces
        for (let i = this.surfaces.length - 1; i >= 0; i--) {
            let s = this.surfaces[i];
            this.dragged = s.selectPoints();
            if (this.dragged != null) {
                this.selected = s;
                return true;
            }
        }
        this.selected = null;
        return false;
    }

    checkSelectedClick() {
        // first check masks
        if (this.selected) {
            this.dragged = this.selected.selectPoints();
            if (this.dragged)
                return true;
            return false;
        }
        return false;
    }

    onDrag() {
        if (this.dragged != null)
            this.dragged.moveTo();
    }

    onRelease() {
        this.dragged = null;
    }

    isDragging(surface) {
        // TODO - ??? why return true?
        // need to remember what I was doing here

        if (this.dragged === null)
            return true;
        return this.dragged === surface;
    }



    updateEvents() {
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
    }

    ////////////////////////////////////////
    // LOADING / SAVING
    ////////////////////////////////////////
    load(filepath = "maps/map.json") {
        console.log(`loading json file: ${filepath}`);
        let mainThis = this;
        let error = (err) => console.log(`error loading ${filepath}`, err);
        this.pInst.loadJSON(`${filepath}`, mainThis.loadedJson.bind(mainThis), error);
    }

    loadedJson(json) {

        if (json.surfaces) this.loadSurfaces(json);

        if (json.lines) this.loadLines(json);
    }



    loadSurfaces(json) {
        let jSurfaces = json.surfaces;
        if (jSurfaces.length !== this.surfaces.length) {
            console.warn(`json calibration file has ${jSurfaces.length} surface maps but there are ${this.surfaces.length} surface maps in memory (check sketch.js for # of map objects)`)
        }

        // TODO - don't remember what I was doing here...
        // in the future if we want to make sure only to load tris into tris, etc.
        const jTriSurfaces = jSurfaces.filter(surf => surf.type === "TRI");
        const jQuadSurfaces = jSurfaces.filter(surf => surf.type === "QUAD");
        const jBezSurfaces = jSurfaces.filter(surf => surf.type === "BEZ");
        const jPolySurfaces = jSurfaces.filter(surf => surf.type === "POLY");

        const mapTris = this.surfaces.filter(surf => surf.type === "TRI");
        const mapQuads = this.surfaces.filter(surf => surf.type === "QUAD");
        const mapBez = this.surfaces.filter(surf => surf.type === "BEZ");
        const mapPolys = this.surfaces.filter(surf => surf.type === "POLY");

        // loading tris
        let index = 0;
        while (index < jTriSurfaces.length && index < mapTris.length) {
            const s = mapTris[index];
            if (s.isEqual(mapTris[index]))
                s.load(jTriSurfaces[index]);
            else
                console.warn("mismatch between calibration surface types / ids")
            index++;
        }

        // loading quads
        index = 0;
        while (index < jQuadSurfaces.length && index < mapQuads.length) {
            const s = mapQuads[index];
            if (s.isEqual(mapQuads[index]))
                s.load(jQuadSurfaces[index]);
            else
                console.warn("mismatch between calibration surface types / ids")
            index++;
        }

        // loading bez
        index = 0;
        while (index < jBezSurfaces.length && index < mapBez.length) {
            const s = mapBez[index];

            if (s.isEqual(mapBez[index])) {
                s.load(jBezSurfaces[index]);
            }
            else
                console.warn("mismatch between calibration bez surface types / ids")
            index++;
        }

        // loading poly
        index = 0;
        while (index < jPolySurfaces.length && index < mapPolys.length) {
            const s = mapPolys[index];

            if (s.isEqual(mapPolys[index])) {
                s.load(jPolySurfaces[index]);
            }
            else
                console.warn("mismatch between calibration poly surface types / ids")
            index++;
        }
    }

    loadLines(json) {
        let jLines = json.lines;
        if (jLines.length !== this.lines.length) {
            console.warn(`json calibration file has ${jLines.length} line maps but there are ${this.lines.length} line maps in memory`)
        }

        let index = 0;
        while (index < jLines.length && index < this.lines.length) {
            this.lines[index].load(jLines[index]);
            index++;
        }
    }


    save(filename = "map.json") {
        console.log("saving all mapped surfaces to json...");
        let json = { surfaces: [], lines: [] }

        // for (const mask of this.masks) {
        //     json.masks.push(mask.getJson());
        // }

        for (const surface of this.surfaces) {
            json.surfaces.push(surface.getJson());
        }

        for (const line of this.lines) {
            json.lines.push(line.getJson());
        }
        this.pInst.saveJSON(json, `${filename}`)
    }

    ////////////////////////////////////////
    // CALIBRATING
    ////////////////////////////////////////
    startCalibration() {
        this.calibrate = true;
    }

    stopCalibration() {
        this.calibrate = false;
    }

    toggleCalibration() {
        this.calibrate = !this.calibrate;
    }

    ////////////////////////////////////////
    // RENDERING
    ////////////////////////////////////////
    /**
     * begins drawing surfaces
     *
     * @deprecated since v0.0.1
    */
    beginSurfaces() {
        console.warn("beginSurfaces() is a deprecated method");
    }

    /**
     * ends drawing surfaces
     *
     * @deprecated since v0.0.1
    */
    endSurfaces() {
        console.warn("endSurfaces() is a deprecated method");
    }

    /**
     * renders surfaces
     *
     * @deprecated since v0.0.1
    */
    renderSurfaces() {
        console.warn("renderSurfaces() is a deprecated method");
    }

    /**
     * displays surfaces
     *
     * @deprecated since v0.0.1
    */
    display() {
        // if (this.selected) {
        //     this.selected.displaySelected();
        // }
        console.warn("display() is a deprecated method");
    }

    displayControlPoints() {
        if (this.calibrate) {
            // for (const mask of this.masks) {
            //     mask.displayControlPoints();
            // }
            for (const surface of this.surfaces) {
                surface.displayControlPoints();
            }

            for (const lineMap of this.lines) {
                lineMap.displayCalibration();
                lineMap.displayControlPoints();
            }
        }

    }

    getOscillator(seconds, offset = 0) {
        return getPercentWave(seconds, offset);
    }
}

const pMapper = new ProjectionMapper();

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
};


p5.prototype.initPMapperShader = function () {
    // TODO - is there a better way to do this?
    // let filePath = "../../src/surfaces/Bezier/shader";
    let filePath = "https://cdn.jsdelivr.net/gh/jdeboi/p5.mapper/src/surfaces/Bezier/shader"
    this.loadShader(filePath + ".vert", filePath + ".frag", (bezShader) => pMapper.preload(bezShader));
}

p5.prototype.registerMethod('init', p5.prototype.initPMapperShader);

// p5.prototype.registerMethod('pre', () => pMapper.beginSurfaces());
p5.prototype.registerMethod('post', () => pMapper.displayControlPoints());
p5.prototype.registerMethod('post', () => pMapper.updateEvents());

export default pMapper;
