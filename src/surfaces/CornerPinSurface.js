import PerspT from '../perspective/PerspT';
import MeshPoint from './MeshPoint';


class CornerPinSurface {

    /**
     * @param w
     *            The surface's width, in pixels
     * @param h
     *            The surface's height, in pixels
     * @param res	
     *            The surface's grid resolution
     */
    constructor(w, h, res, type) {
        this.w = w;
        this.h = h;
        this.res = Math.floor(res);
        this.type = type;

        this.x = 0;
        this.y = 0;
        this.clickX = 0;
        this.clickY = 0;

        this.gridColor = color(200);
        this.controlPointColor = color(255, 0, 255);

        this.surface = createGraphics(w, h, WEBGL);
        this.perspT = null;
       
        this.initMesh();
        this.calculateMesh();
    }

    initMesh() {
        this.mesh = [];
        for (let y = 0; y < this.res; y++) {
            for (let x = 0; x < this.res; x++) {
                let mx = Math.floor(map(x, 0, this.res, 0, this.w));
                let my = Math.floor(map(y, 0, this.res, 0, this.h));
                let u = map(x, 0, this.res, 0, 1);
                let v = map(y, 0, this.res, 0, 1)
                // let x = (i % this.res) / (this.res - 1);
                // let y = Math.floor((i / this.res)) / (this.res - 1);
                this.mesh[y * this.res + x] = new MeshPoint(this, mx, my, u, v);
            }
        }

        this.TL = 0 + 0; // x + y
        this.TR = this.res - 1 + 0;
        this.BL = 0 + (this.res - 1) * (this.res);
        this.BR = this.res - 1 + (this.res - 1) * (this.res);

        // make the corners control points
        this.mesh[this.TL].setControlPoint(true);
        this.mesh[this.TR].setControlPoint(true);
        this.mesh[this.BL].setControlPoint(true);
        this.mesh[this.BR].setControlPoint(true);
    }

    load(x, y, points) {
        this.x = x;
        this.y = y;
        for (const point of points) {
            let mp = this.mesh[point.i];
            mp.x = point.x;
            mp.y = point.y;
            mp.u = point.u;
            mp.v = point.v;
            mp.setControlPoint(true);
        }
        this.calculateMesh();
    }


    // abstract render()
    // abstract isMouseOver();
    calculateMesh() {
        // nada
    }

    beginDraw() {
        this.surface.push();
        this.surface.clear();
        this.surface.translate(-this.w / 2, -this.h / 2);

    }

    background(r, g, b) {
        let col = this.getColor(r, g, b);
        this.surface.fill(col);
        this.surface.noStroke();
        this.surface.rect(0, 0, this.w, this.h);
    }

    endDraw() {
        this.surface.pop();
    }

    fill(r, g, b) {
        this.surface.fill(this.getColor(r, g, b));
    }

    noFill() {
        this.surface.noFill();
    }

    stroke(r, g, b) {
        this.surface.stroke(this.getColor(r, g, b));
    }


    noStroke() {
        this.surface.noStroke();
    }

    strokeWeight(sw) {
        this.surface.strokeWeight(sw);
    }

    getColor(r, g, b) {
        if (typeof r === "object")
            return r;

        if (typeof g !== 'undefined' && typeof b !== 'undefined') {
            return color(r, g, b);
        }

        return color(r);
    }

    rect(x, y, w, h) {
        this.surface.rect(x, y, w, h);
    }

    ellipse(x, y, w, h) {
        this.surface.ellipse(x, y, w, h);
    }

    line(x0, y0, x1, y1) {
        this.surface.line(x0, y0, x1, y1);
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
    moveMeshPointBy(corner, moveX, moveY) {
        this.mesh[corner].moveTo(this.mesh[corner].x + moveX, this.mesh[corner].y + moveY);
    }

    /**
     * @return The surface's mesh resolution, in number of "tiles"
     */
    getRes() {
        // The actual resolution is the number of tiles, not the number of mesh
        // points
        return this.res - 1;
    }



    /**
     * Draws targets around the control points
     */
    renderControlPoints() {
        strokeWeight(2);
        stroke(this.controlPointColor);
        noFill();
        for (let i = 0; i < this.mesh.length; i++) {
            if (this.mesh[i].isControlPoint) {
                ellipse(this.mesh[i].x, this.mesh[i].y, 30, 30);
                ellipse(this.mesh[i].x, this.mesh[i].y, 10, 10);
            }
        }
    }

    /**
     * This function will give you the position of the mouse in the surface's
     * coordinate system.
     * 
     * @return The transformed mouse position
     */

    getTransformedCursor(cx, cy) {
        let point = this.perspT(cx - this.x, cy - this.y);
        return createVector(point[0], point[1]);
    }


    getTransformedMouse() {
        return getTransformedCursor(mouseX, mouseY);
    }

    // 2d cross product
    cross2(x0, y0, x1, y1) {
        return x0 * y1 - y0 * x1;
    }



    /**
     * Sets the grid used for calibration's color
     */
    setGridColor(newColor) {
        gridColor = newColor;
    }

    /**
     * Sets the control points color
     */
    setControlPointsColor(newColor) {
        controlPointColor = newColor;
    }

    /**
     * @invisible
     */
    select() {
        let x = mouseX - width / 2;
        let y = mouseY - height / 2;
        // first, see if one of the control points are selected
        x -= this.x;
        y -= this.y;
        for (let i = 0; i < this.mesh.length; i++) {
            if (dist(this.mesh[i].x, this.mesh[i].y, x, y) < 30
                && this.mesh[i].isControlPoint)
                return this.mesh[i];
        }

        // then, see if the surface itself is selected
        if (this.isMouseOver()) {
            this.clickX = x;
            this.clickY = y;
            return this;
        }
        return null;
    }


    /**
     * Used for mouse selection of surfaces
     * http://www.blackpawn.com/texts/pointinpoly/default.html
     */
    isPointInTriangle(x, y, a,
        b, c) {
        let v0 = createVector(c.x - a.x, c.y - a.y);
        let v1 = createVector(b.x - a.x, b.y - a.y);
        let v2 = createVector(x - a.x, y - a.y);

        let dot00 = v0.dot(v0);
        let dot01 = v1.dot(v0);
        let dot02 = v2.dot(v0);
        let dot11 = v1.dot(v1);
        let dot12 = v2.dot(v1);

        // Compute barycentric coordinates
        let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        return (u > 0) && (v > 0) && (u + v < 1);
    }

    /*
     * @invisible
     * 
     *            This moves the surface according to the offset from where the
     *            mouse was pressed when selecting the surface.
     */
    moveTo(x, y) {
        this.x = x - this.clickX;
        this.y = y - this.clickY;
        // console.log("move", x, y, this.x, this.y);
    }


    getWidth() {
        return this.w;
    }

    getHeight() {
        return this.h;
    }
}

export default CornerPinSurface;