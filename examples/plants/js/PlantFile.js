
class PlantFile {

    // constructor() {
    //     console.log("test")
    // }

    constructor(path, isFlipped, snapx, snapy, sc, rad, growthFactor) {
        this.img = loadImage("images/" + path);
        this.isFlipped = isFlipped;
        this.snapX = floor(snapx);
        this.snapY = floor(snapy);
        this.sc = sc;
        this.radRot = rad;
        this.growthFactor = growthFactor;
    }


    display(xx, yy, rr, scsc, isFF, s) {
        //img.disableStyle();
        s.push();

        let f = false;
        if (this.isFlipped == isFF) {
            f = false;
        } else
            f = true;
        if (f) {
            s.scale(-1, 1);
        }
        s.translate(xx, yy);

        s.scale(this.sc * scsc);
        s.scale(this.growthFactor);

        //float n = radians(10)*noise(num*50+millis()/1000.0);

        s.rotate(this.radRot + rr);
        s.translate(-this.snapX, -this.snapY);
        s.fill(0,0,0,0);
        s.noStroke();
        s.image(this.img, 0, 0);

        // s.push();
        // s.translate(this.img.width/2, this.img.height/2);
        // s.texture(this.img);
	    // s.plane(this.img.width,this.img.height);
        // s.pop();

        s.pop();
    }
}