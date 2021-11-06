let p5Mapper;
let wall;
let img;
let x = 0;

function preload() {
    img = loadImage("catnap.jpg");
}
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    p5Mapper = getP5Mapper();
    wall = p5Mapper.createQuad(200, 200, 20);
}

function draw() {
    background(100);

    wall.beginDraw();
    wall.background(255, 0, 0);
    wall.ellipse(200, 200, 100);
    wall.endDraw();
}




function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            p5Mapper.toggleCalibration();
            break;

        case 'l':
            // loads the saved layout
            //   projection.load();
            break;

        case 's':
            // saves the layout
            //   projection.save();
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