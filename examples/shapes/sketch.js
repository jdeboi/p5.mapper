let pMapper;
let quad, tri;

let img;
let x = 0;


function preload() {
    img = loadImage("catnap.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper();
    quad = pMapper.createQuadMap(400, 400, 20, this);
    tri = pMapper.createTriMap(300, 300, 20, this);
    
    // loads surface layouts in the "maps" directory
    pMapper.load("maps");
}

function draw() {
    background(0);
    
    quad.clear();
    quad.imageMode(CENTER);
    quad.background(255, 0, 0);
    quad.image(img, 0, 0);
    quad.fill(255);
    quad.ellipse(x++%300, 100, 100);

    tri.clear();
    tri.background(255, 255, 0);
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            pMapper.toggleCalibration();
            break;

        case 'l':
            // loads the saved layouts in "maps" directory
            pMapper.load("maps");
            break;

        case 's':
            // saves the layouts
            pMapper.save();
            break;
    }
}

function mousePressed() {
    pMapper.onClick();
}

function mouseDragged() {
    pMapper.onDrag();
}

function mouseReleased() {
    pMapper.onRelease();
}