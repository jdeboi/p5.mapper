import PerspT from '../perspective/PerspT';
import CornerPinSurface from './CornerPinSurface';


class QuadMap extends CornerPinSurface {

    constructor(id, w, h, res, pInst) {
        super(id, w, h, res, "QUAD", pInst);
    }

    /**
     * Returns true if the mouse is over this surface, false otherwise.
     */
    isMouseOver() {
        let x = mouseX - width / 2;
        let y = mouseY - height / 2;
        if (this.isPointInTriangle(x - this.x, y - this.y, this.mesh[this.TL],
            this.mesh[this.TR], this.mesh[this.BL])
            || this.isPointInTriangle(x - this.x, y - this.y,
                this.mesh[this.BL], this.mesh[this.TR], this.mesh[this.BR]))
            return true;
        return false;
    }

    calculateMesh() {

        // The float constructor is deprecated, so casting everything to double

        const srcCorners = [0, 0, this.width, 0, this.width, this.height, 0, this.height];
        const dstCorners = [
            this.mesh[this.TL].x, this.mesh[this.TL].y,
            this.mesh[this.TR].x, this.mesh[this.TR].y,
            this.mesh[this.BR].x, this.mesh[this.BR].y,
            this.mesh[this.BL].x, this.mesh[this.BL].y
        ];

        this.perspT = PerspT(srcCorners, dstCorners);

        // this.warpPerspective = new WarpPerspective(transform);

        let xStep = this.width / (this.res - 1);
        let yStep = this.height / (this.res - 1);

        for (let i = 0; i < this.mesh.length; i++) {

            if (this.TL == i || this.BR == i || this.TR == i || this.BL == i)
                continue;

            let x = i % this.res;
            let y = Math.floor(i / this.res);

            x *= xStep;
            y *= yStep;

            // let point = this.warpPerspective.mapDestPoint(new Point((x, y));
            // this.mesh[i].x = point.getX();
            // this.mesh[i].y = point.getY();
            let dest = this.perspT.transform(x, y);
            this.mesh[i].x = dest[0];
            this.mesh[i].y = dest[1];
        }
    }

    
    // setMeshPoints(points) {
    //     this.mesh[this.TL].set(points[0]);
    //     this.mesh[this.TR].set(points[1]);
    //     this.mesh[this.BL].set(points[2]);
    //     this.mesh[this.BR].set(points[3]);
    // }

    render(tX = 0, tY = 0, tW = this.width, tH = this.height) {


        push();
        translate(this.x, this.y);

        stroke(255, 0, 255);
        strokeWeight(3);
        fill(0, 255, 0);

        texture(this);
        beginShape(TRIANGLES);

        for (let x = 0; x < this.res - 1; x++) {
            for (let y = 0; y < this.res - 1; y++) {
                this.getQuadTriangles(x, y, tX, tY, tW, tH);
            }
        }
        endShape(CLOSE);
        // if (ProjectionMap.calibrate)
            this.renderControlPoints();

        pop();
    }

    getQuadTriangles(x, y, tX, tY, tW, tH) {

        ////////////////////////////////
        let mp = this.mesh[(x) + (y) * this.res];
        this.getVertexUV(mp, tX, tY, tW, tH);

        mp = this.mesh[(x + 1) + (y) * this.res];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, -1, 0, u, 0);


        mp = this.mesh[(x + 1) + (y + 1) * this.res];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, 1, 0, u, v);

        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(1, 1, 0, u, v);

        mp = this.mesh[(x) + (y + 1) * this.res];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(-1, 1, 0, 0, v);


        mp = this.mesh[(x) + (y) * this.res];
        this.getVertexUV(mp, tX, tY, tW, tH);
        // vertex(-1, -1, 0, 0, 0);
    }

    getVertexUV(mp, tX, tY, tW, tH) {
        let u = map(mp.u, 0, 1, tX, tX + tW);
        let v = map(mp.v, 0, 1, tY, tY + tH);
        vertex(mp.x, mp.y, u, v);
    }
}

export default QuadMap;