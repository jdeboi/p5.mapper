import QuadPinSurface from './surfaces/QuadPinSurface';
import TriPinSurface from './surfaces/TriPinSurface';

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
    createQuad(w, h, res) {
        const s = new QuadPinSurface(w, h, res);
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
    createTri(w, h, res) {
        const s = new TriPinSurface(w, h, res);
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

    clearSurfaces() {
        this.surfaces = [];
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
    load() {
        loadJSON("map.json", (json) => this.setSurfaces);
    }

    setSurfaces(json) {
        if (!json.surfaces) {
            console.log("no surfaces to load; is map.json corrupt?");
            return;
        }

        for (const surface of json.surfaces) {
            if (surface.type === "QUAD") {
                let q = this.createQuad(surface.w, surface.h, surface.res);
                let { points, x, y } = surface;
                q.load(x, y, points);
            }
            else if (surface.type === "TRI") {
                let t = this.createTri(surface.w, surface.h, surface.res);
                let { points, x, y } = surface;
                t.load(x, y, points);
            }
        }
    }

    save() {
        let json = { surfaces: [] }
        for (const surface of this.surfaces) {
            let sJson = {};
            sJson.res = surface.getRes();
            sJson.x = surface.x;
            sJson.y = surface.y;
            sJson.w = surface.w;
            sJson.h = surface.h;
            sJson.type = surface.type;
            sJson.points = [];

            for (let i = 0; i < surface.mesh.length; i++) {
                if (surface.mesh[i].isControlPoint()) {
                    let point = {};
                    point.i = i;
                    point.x = surface.mesh[i].x;
                    point.y = surface.mesh[i].y;
                    point.u = surface.mesh[i].u;
                    point.v = surface.mesh[i].v;
                    sJson.points.push(point);
                }
            }
            json.surfaces.push(sJson);
        }
        saveJSON(json, 'map.json');
        console.log("mapping saved to map.json");
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

p5.prototype.renderSurfaces = function () {
    p5mapper.renderSurfaces();
}

p5.prototype.registerMethod('post', p5.prototype.renderSurfaces);

export default p5mapper;
