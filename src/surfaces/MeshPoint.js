
class MeshPoint {
     
     constructor( parent,  x,  y,  u,  v) {
         this.x = x;
         this.y = y;
         this.u = u;
         this.v = v;
         this.isControlPoint = false;
         this.parent = parent;
     }
     
     isControlPoint() {
         return this.isControlPoint;
     }
     
     moveTo( x,  y) {
         this.x = x - this.parent.x;
         this.y = y - this.parent.y;
         //parent.calculateMesh(this.id);
         this.parent.calculateMesh();
     }
     
     setControlPoint( cp) {
         this.isControlPoint = cp;
     }
     
     /*
     protected void setControlPoint(String id) {
         isControlPoint = true;
         this.id = id;
     }
     */
     
     /**
      * This creates a new MeshPoint with (u,v) = (0,0) and does
      * not modify the current MeshPoint. Its used to generate 
      * temporary points for the interpolation.
      */
     interpolateTo( p,  f) {
         let nX = this.x + (p.x - this.x) * f;
         let nY = this.y + (p.y - this.y) * f;
         return new MeshPoint(this.parent, nX, nY, 0, 0);
     }
     
     interpolateBetween( start,  end,  f) {
         this.x = start.x + (end.x - start.x) * f;
         this.y = start.y + (end.y - start.y) * f;
     }	
 }

 export default MeshPoint;