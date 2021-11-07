class Surface {

    constructor(id, w, h, res, type, pInst) {
        p5.Graphics.call(this, w, h, WEBGL, pInst);
        this.id = id;
        this.res = Math.floor(res);
        this.type = type;

        this.x = 0;
        this.y = 0;
        this.clickX = 0;
        this.clickY = 0;

        this.gridColor = color(200);
        this.controlPointColor = color(255, 0, 255);
    }

  
}

Surface.prototype = Object.create(p5.Graphics.prototype);

export default Surface;