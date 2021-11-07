class MovePoint {

    constructor( parent,  x,  y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isControlPoint = false;
        this.parent = parent;
    }

    set(point) {
       this.x = point.x;
       this.y = point.y;
    }

    moveTo( x,  y) {
        this.x = x;
        this.y = y;
    }
    
    setControlPoint( cp) {
        this.isControlPoint = cp;
    }
    
    interpolateBetween( start,  end,  f) {
        this.x = start.x + (end.x - start.x) * f;
        this.y = start.y + (end.y - start.y) * f;
    }	
}

export default MovePoint;