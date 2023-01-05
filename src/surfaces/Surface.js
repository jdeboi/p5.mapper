class Surface {


    // since there's a limit on WEBGL context
    constructor(id, w, h, res, type, buffer) {
        // https://github.com/processing/p5.js/issues/3736
        // let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
        // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);

        // TODO - think about size of surface...
        this.width = constrain(w, 0, width);
        this.height = constrain(h, 0, height);
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

        this.buffer = buffer;
    }

    displaySolid(col) {
        this.buffer.background(col);
        this.displayTexture(this.buffer);
    }

    displaySketch(sketch) {
        this.buffer.clear();
        this.buffer.push();
        // start by drawing everything on buffer at the top left
        this.buffer.translate(-this.buffer.width/2, -this.buffer.height/2);

        // now get in the middle for the final shape
        this.buffer.translate(this.width/2, this.height/2);
        sketch(this.buffer);
        this.buffer.pop();
        
        this.displayTexture(this.buffer);
    }

    displayTexture(tex, tX = 0, tY = 0, tW = this.width, tH = this.height) {
        push();
        translate(this.x, this.y);
        texture(tex);
        this.display(tX, tY, tW, tH);
        pop();
    }


}

// TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);

export default Surface;