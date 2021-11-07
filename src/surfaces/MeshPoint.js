import MovePoint from './MovePoint';

class MeshPoint extends MovePoint {

    constructor(parent, x, y, u, v) {
        super(parent, x, y, 30);
        this.u = u;
        this.v = v;
    }


    set(point) {
        super.set(point);
        this.u = point.u;
        this.v = point.v;
    }

    moveTo(x, y) {
        this.x = x - this.parent.x;
        this.y = y - this.parent.y;
        this.parent.calculateMesh();
    }

    /**
     * This creates a new MeshPoint with (u,v) = (0,0) and does
     * not modify the current MeshPoint. Its used to generate 
     * temporary points for the interpolation.
     */
    interpolateTo(p, f) {
        let nX = this.x + (p.x - this.x) * f;
        let nY = this.y + (p.y - this.y) * f;
        return new MeshPoint(this.parent, nX, nY, 0, 0);
    }

}

export default MeshPoint;