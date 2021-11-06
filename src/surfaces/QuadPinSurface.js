import PerspT from '../perspective/PerspT';
import CornerPinSurface from './CornerPinSurface';


class QuadPinSurface extends CornerPinSurface {

    constructor(w, h, res) {
        super(w, h, res, "QUAD");
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

        const srcCorners = [0, 0, this.w, 0, this.w, this.h, 0, this.h];
        const dstCorners = [
            this.mesh[this.TL].x, this.mesh[this.TL].y,
            this.mesh[this.TR].x, this.mesh[this.TR].y,
            this.mesh[this.BR].x, this.mesh[this.BR].y,
            this.mesh[this.BL].x, this.mesh[this.BL].y
        ];

        this.perspT = PerspT(srcCorners, dstCorners);

        // this.warpPerspective = new WarpPerspective(transform);

        let xStep = this.w / (this.res - 1);
        let yStep = this.h / (this.res - 1);

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

    

    render(pg = this.surface, tX = 0, tY = 0, tW = this.w, tH = this.h) {


        push();
        translate(this.x, this.y);

        stroke(255, 0, 255);
        strokeWeight(3);
        fill(0, 255, 0);

        texture(pg);
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
        // console.log(mp.u, mp.v)
        vertex(mp.x, mp.y, u, v);
    }
}

export default QuadPinSurface;