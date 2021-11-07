let p5Mapper;
let surfaces = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    p5Mapper = getP5Mapper();

    for (let i = 0; i < 5; i++) {
        surfaces.push(p5Mapper.createQuad(100, 400, 20, this));
    }
    
    // p5Mapper will look for calibration files in "maps" directory
    p5Mapper.load("maps");
}

function draw() {
    background(0);
    
    let index = 0;
    for (const surface of surfaces) {
        let bg = map(index++, 0, surfaces.length, 0, 255);
        surface.push();
        surface.clear();
        surface.background((bg+frameCount)%255);
        surface.pop();
    }
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            p5Mapper.toggleCalibration();
            break;

        case 'l':
            // loads the saved surface layouts in "maps directory"
            p5Mapper.load("maps");
            break;

        case 's':
            // saves the surface layouts
            p5Mapper.save();
            break;
    }
}

function mousePressed() {
    p5Mapper.onClick();
}

function mouseDragged() {
    p5Mapper.onDrag();
}

function mouseReleased() {
    p5Mapper.onRelease();
}