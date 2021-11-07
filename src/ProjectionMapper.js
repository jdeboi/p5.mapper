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

    createLineMap(x0, y0, x1, y1) {
        const l = new LineMap(x0, y0, x1, y1);
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

        for (const line of this.lines) {
            line.display();
        }
    }

    // getSurface(i) {
    //     return this.surfaces[i];
    // }

    // getSurfaceCount() {
    //     return this.surfaces.length;
    // }

    // clearSurfaces() {
    //     this.surfaces = [];
    // }

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
    load(dir="") {
        console.log(`loading json calibration files in directory ${dir}/`);
        for (const surface of this.surfaces) {
            surface.load(dir);
        }
    }


    save() {
        console.log("saving all mapped surfaces to json...");
        for (const surface of this.surfaces) {
            surface.save();
        }
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

    endSurfaces() {
        for (const surface of this.surfaces) {
            surface.endDrawing();
        }
    }

    beginSurfaces() {
        for (const surface of this.surfaces) {
            surface.beginDrawing();
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


p5.prototype.renderSurfaces = function () {
    pMapper.endSurfaces();
    pMapper.renderSurfaces();
}

p5.prototype.beginSurfaces = function () {
    pMapper.beginSurfaces();
}



p5.prototype.registerMethod('pre', p5.prototype.beginSurfaces);
p5.prototype.registerMethod('post', p5.prototype.renderSurfaces);

export default pMapper;