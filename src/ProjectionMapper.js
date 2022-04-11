import QuadMap from './surfaces/QuadMap';
import TriMap from './surfaces/TriMap';
import LineMap from './lines/LineMap';
import Mask from './mask/Mask';

import { getPercent, getPercentWave } from './helpers/helpers';

class ProjectionMapper {

    constructor() {
        this.surfaces = [];
        this.lines = [];
        this.masks = [];
        this.dragged = null;
        this.calibrate = false;
        this.pInst = null;
        this.pMousePressed = false;
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
        const s = new QuadMap(this.surfaces.length, w, h, res, this.pInst);
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
        const s = new TriMap(this.surfaces.length, w, h, res, this.pInst);
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

    createMaskMap(numPoints = 3) {
        if (numPoints < 3)
            numPoints = 3;

        let mask = new Mask(this.masks.length, numPoints);
        this.masks.push(mask);
        return mask;
    }


    ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////
    onClick() {
        // ignore input events if the calibrate flag is not set
        if (!this.calibrate)
            return;

        // first check masks
        let top = null;
        for (const mask of this.masks) {
            this.dragged = mask.select();
            if (this.dragged != null) {
                top = mask;
                return;
            }
        }
        // Check Lines
        // navigate the list backwards, as to select 
        for (let i = this.lines.length - 1; i >= 0; i--) {
            let s = this.lines[i];
            this.dragged = s.select();
            if (this.dragged != null) {
                top = s;
                return;
            }
        }

        // check mapping surfaces
        for (let i = this.surfaces.length - 1; i >= 0; i--) {
            let s = this.surfaces[i];
            this.dragged = s.select();
            if (this.dragged != null) {
                top = s;
                return;
            }
        }



        if (top != null) {
            // TODO
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

    onDrag() {
        if (this.dragged != null)
            this.dragged.moveTo();
    }

    onRelease() {
        this.dragged = null;
    }

    isDragging(surface) {
        // TODO - ??? why return true?
        if (this.dragged === null)
            return true;
        return this.dragged === surface;
    }



    updateEvents() {
        if (mouseIsPressed) {
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
        this.pMousePressed = mouseIsPressed;
    }

    ////////////////////////////////////////
    // LOADING / SAVING
    ////////////////////////////////////////
    load(filepath = "maps/map.json") {
        console.log(`loading json file: ${filepath}`);
        let mainThis = this;
        let error = (err) => console.log(`error loading ${filepath}`, err);
        loadJSON(`${filepath}`, mainThis.loadedJson.bind(mainThis), error);
    }

    loadedJson(json) {

        if (json.masks) this.loadMasks(json);

        if (json.surfaces) this.loadSurfaces(json);

        if (json.lines) this.loadLines(json);
    }

    loadMasks(json) {
        let jMasks = json.masks;
        if (jMasks.length !== this.masks.length) {
            console.warn(`json calibration file has ${jMasks.length} masks but there are ${this.masks.length} masks in memory (check sketch.js for # of mask objects)`)
        }
        let index = 0;
        while (index < jMasks.length && index < this.masks.length) {
            const s = this.masks[index];
            if (s.isEqual(this.masks[index]))
                s.load(jMasks[index]);
            else
                console.warn("mismatch between calibration mask types / ids")

            index++;
        }
    }

    loadSurfaces(json) {
        let jSurfaces = json.surfaces;
        if (jSurfaces.length !== this.surfaces.length) {
            console.warn(`json calibration file has ${jSurfaces.length} surface maps but there are ${this.surfaces.length} surface maps in memory (check sketch.js for # of map objects)`)
        }

        // in the future if we want to make sure only to load tris into tris, etc.
        const jTriSurfaces = jSurfaces.filter(surf => surf.type === "TRI");
        const jQuadSurfaces = jSurfaces.filter(surf => surf.type === "QUAD");
        const mapTris = this.surfaces.filter(surf => surf.type === "TRI");
        const mapQuads = this.surfaces.filter(surf => surf.type === "QUAD");

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
        let json = { surfaces: [], lines: [], masks: [] }

        for (const mask of this.masks) {
            json.masks.push(mask.getJson());
        }

        for (const surface of this.surfaces) {
            json.surfaces.push(surface.getJson());
        }

        for (const line of this.lines) {
            json.lines.push(line.getJson());
        }
        saveJSON(json, `${filename}`)
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
    beginSurfaces() {
        for (const surface of this.surfaces) {
            surface.beginDrawing();
        }
    }

    endSurfaces() {
        for (const surface of this.surfaces) {
            surface.endDrawing();
        }
    }

    renderSurfaces() {
        this.endSurfaces();
        for (const surface of this.surfaces) {
            surface.render();
        }
    }

    display() {
        this.renderSurfaces();
        this.displayControlPoints();
    }

    displayControlPoints() {
        if (this.calibrate) {
            for (const mask of this.masks) {
                mask.displayControlPoints();
            }
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

p5.prototype.createProjectionMapper = function (pInst) {
    pMapper.pInst = this;
    return pMapper;
};


p5.prototype.isCalibratingMapper = function () {
    return pMapper.calibrate;
};

p5.prototype.isDragging = function (surface) {
    return pMapper.isDragging(surface);
};





p5.prototype.registerMethod('pre', () => pMapper.beginSurfaces());
p5.prototype.registerMethod('post', () => pMapper.display());
p5.prototype.registerMethod('post', () => pMapper.updateEvents());

export default pMapper;
