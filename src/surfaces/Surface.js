import Draggable from './Draggable';
import { getRandomizedColor } from '../helpers/helpers';

class Surface extends Draggable {


    // since there's a limit on WEBGL context
    constructor(id, w, h, res, type, buffer) {
        super(0, 0);
        // https://github.com/processing/p5.js/issues/3736
        // let g = p5.Graphics.call(this, w, h, WEBGL, pInst);
        // g.drawingContext.disable(g.drawingContext.DEPTH_TEST);

        // TODO - think about size of surface...
        this.width = constrain(w, 0, width);
        this.height = constrain(h, 0, height);
        this.id = id;
        this.res = Math.floor(res);
        this.type = type;

        this.controlPointColor = getRandomizedColor(this.id, this.type);

        this.buffer = buffer;
    }

    getMutedControlColor(col = this.controlPointColor) {
        return color(red(col), green(col), blue(col), 50);
    }

    display(col=color('black')) {
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
        this.displaySurface(tX, tY, tW, tH);
        pop();
    }

    isEqual(json) {
        return json.id === this.id && json.type === this.type;
    }

    getBounds(points) {
        let minX = Math.min(...points.map((pt) => pt.x));
        let minY = Math.min(...points.map((pt) => pt.y));
        let maxX = Math.max(...points.map((pt) => pt.x));
        let maxY = Math.max(...points.map((pt) => pt.y));

        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }

}

// TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);

export default Surface;