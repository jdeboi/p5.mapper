class Surface {

    constructor(id, w, h, res, type, pInst) {
        // https://github.com/processing/p5.js/issues/3736
        let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
        // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);
    
        this.id = id;
        this.res = Math.floor(res);
        this.type = type;

        this.x = 0;
        this.y = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;

        this.gridColor = color(200);
        this.controlPointColor = color(255, 0, 255);
    }

   

  
}

Surface.prototype = Object.create(p5.Graphics.prototype);

export default Surface;