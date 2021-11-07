import QuadPinSurface from './surfaces/QuadPinSurface';
import TriPinSurface from './surfaces/TriPinSurface';
import Surface from './surfaces/Surface';

class Main {

    constructor() {
        this.surfaces = [];
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
    createQuad(w, h, res, pInst) {
        const s = new QuadPinSurface(this.surfaces.length, w, h, res, pInst);
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
    createTri(w, h, res, pInst) {
        const s = new TriPinSurface(this.surfaces.length, w, h, res, pInst);
        this.surfaces.push(s);
        return s;
    }

    /**
     * Called post draw()
     */
    renderSurfaces() {
        for (const surface of this.surfaces) {
            surface.render();
        }
    }

    getSurface(i) {
        return this.surfaces[i];
    }

    getSurfaceCount() {
        return this.surfaces.length;
    }

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

}

const p5mapper = new Main();

p5.prototype.getP5Mapper = function () {
    return p5mapper;
};


p5.prototype.isCalibratingMapper = function () {
    return p5mapper.calibrate;
};

p5.prototype.createSurface = function (w, h, res) {
    return new Surface(w, h, res, this);
};

p5.prototype.renderSurfaces = function () {
    p5mapper.renderSurfaces();
}

p5.prototype.registerMethod('post', p5.prototype.renderSurfaces);

export default p5mapper;
