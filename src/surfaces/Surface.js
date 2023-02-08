
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

    display(col = color('black')) {
        this.buffer.background(col);
        this.displayTexture(this.buffer);
    }

    // override with geometry specifics
    displaySurface(isUV = true, tX = 0, tY = 0, tW = 1, tH = 1) {
        console.warn("should be overriding with specific geometry...");
    }

    displaySketch(sketch, tX = 0, tY = 0, texW = 0, texH = 0) {
        this.buffer.clear();
        this.buffer.push();
        // draw all textures from top left of surface
        sketch(this.buffer);
        this.buffer.pop();

        this.displayTexture(this.buffer, tX, tY, texW, texH);
    }

    displayTexture(tex, tX = 0, tY = 0, texW = 0, texH = 0) {
        if (!tex || tex.width <= 0 || tex.height <= 0) return;
        if (texW <= 0) texW = tex.width;
        if (texH <= 0) texH = tex.height;
        const tW = tex.width / texW;
        const tH = tex.height / texH;

        push();
        translate(this.x, this.y);
        textureMode(IMAGE);
        texture(tex);
        this.displaySurface(true, tX, tY, tW, tH);

        if (isCalibratingMapper()) {
            this.displayCalibration();
        }
        pop();
    }

    displayCalibration() {
        push();
        // TODO -
        // why translate??
        // to do with the way lines overlap in z dimension?
        // translate(0, 0, 3); 
        this.displayOutline();
        pop();
    }

    displayOutline(col = this.controlPointColor) {
        strokeWeight(3);
        stroke(col);
        fill(this.getMutedControlColor());
        this.displaySurface(false);
    }


    isEqual(json) {
        return json.id === this.id && json.type === this.type;
    }

    getBounds(points) {
        let minX = Math.floor(Math.min(...points.map((pt) => pt.x)));
        let minY = Math.floor(Math.min(...points.map((pt) => pt.y)));
        let maxX = Math.floor(Math.max(...points.map((pt) => pt.x)));
        let maxY = Math.floor(Math.max(...points.map((pt) => pt.y)));

        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }

    setDimensions(points) {
        const { w, h } = this.getBounds(points);
        this.width = w;
        this.height = h;
    }

}

// TRYING OUT A NEW METHOD OF DISPLAYING TEXTURE
// Surface.prototype = Object.create(p5.Graphics.prototype);

export default Surface;