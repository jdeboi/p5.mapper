import QuadMap from './surfaces/QuadMap';
import TriMap from './surfaces/TriMap';
import LineMap from './lines/LineMap';

class ProjectionMapper {

    constructor() {
        this.surfaces = [];
        this.lines = [];
        this.dragged = null;
        this.calibrate = false;
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
    createQuadMap(w, h, res, pInst) {
        const s = new QuadMap(this.surfaces.length, w, h, res, pInst);
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
    createTriMap(w, h, res, pInst) {
        const s = new TriMap(this.surfaces.length, w, h, res, pInst);
        this.surfaces.push(s);
        return s;
    }

    createLineMap(x0=0, y0=0, x1=100, y1=100) {
        const l = new LineMap(x0, y0, x1, y1, this.lines.length);
        this.lines.push(l);
        return l;
    }

    /**
     * Called post draw()
     */
    renderSurfaces() {
        for (const surface of this.surfaces) {
            surface.render();
        }
    }

    ////////////////////////////////////////
    // INTERACTION
    ////////////////////////////////////////
    onClick() {
        // ignore input events if the calibrate flag is not set
        if (!this.calibrate)
            return;

        let top = null;
        // navigate the list backwards, as to select 
        for (let i = this.lines.length - 1; i >= 0; i--) {
            let s = this.lines[i];
            this.dragged = s.select();
            if (this.dragged != null) {
                top = s;
                break;
            }
        }

        for (let i = this.surfaces.length - 1; i >= 0; i--) {
            let s = this.surfaces[i];
            this.dragged = s.select();
            if (this.dragged != null) {
                top = s;
                break;
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
        let x = mouseX - width / 2;
        let y = mouseY - height / 2;
        if (this.dragged != null)
            this.dragged.moveTo(x, y);
    }

    onRelease() {
        this.dragged = null;
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
        let jSurfaces = json.surfaces;
        if (jSurfaces.length !== this.surfaces.length) {
            console.warn(`json calibration file has ${jSurfaces.length} surface maps but there are ${this.surfaces.length} surface maps in memory (check sketch.js for # of map objects)`)
        }

        let index = 0;
        while (index < jSurfaces.length && index < this.surfaces.length) {
            const s = this.surfaces[index];
            if (s.isEqual(this.surfaces[index]))
                s.load(jSurfaces[index]);
            else
                console.warn("mismatch between calibration surface types / ids")

            index++;
        }

        let jLines = json.lines;
        if (jLines.length !== this.lines.length) {
            console.warn(`json calibration file has ${jLines.length} line maps but there are only ${this.lines.length} line maps in memory`)
        }

        index = 0;
        while (index < jLines.length && index < this.lines.length) {
            this.lines[index].load(jLines[index]);
            index++;
        }
    }


    save(filename = "map.json") {
        console.log("saving all mapped surfaces to json...");
        let json = { surfaces: [], lines: [] }
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


    displayControlPoints() {
        if (this.calibrate) {
            for (const surface of this.surfaces) {
                surface.displayControlPoints();
            }
            for (const lineMap of this.lines) {
                lineMap.displayControlPoints();
            }
        }
        
    }
}

const pMapper = new ProjectionMapper();

p5.prototype.createProjectionMapper = function () {
    return pMapper;
};


p5.prototype.isCalibratingMapper = function () {
    return pMapper.calibrate;
};


p5.prototype.beginSurfaces = function () {
    pMapper.beginSurfaces();
}

p5.prototype.renderSurfaces = function () {
    pMapper.endSurfaces();
    pMapper.renderSurfaces();
    pMapper.displayControlPoints();
}



p5.prototype.registerMethod('pre', p5.prototype.beginSurfaces);
p5.prototype.registerMethod('post', p5.prototype.renderSurfaces);

export default pMapper;
