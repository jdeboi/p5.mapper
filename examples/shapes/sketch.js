let p5Mapper;
let wall;
let img;
let x = 0;
let quad, tri;

function preload() {
    img = loadImage("catnap.jpg");
}
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    p5Mapper = getP5Mapper();
    quad = p5Mapper.createQuad(400, 400, 20, this);
    tri = p5Mapper.createTri(300, 300, 20, this);
    
    // p5Mapper.load("maps");
}

function draw() {
    background(100);
    displayQuad();
    displayTri();
}

function displayQuad() {
    quad.push();
    quad.clear();
    quad.imageMode(CENTER);
    quad.background(255, 0, 0);
    quad.image(img, 0, 0);
    quad.fill(255);
    quad.ellipse(x++%300, 100, 100);
    quad.pop();
}

function displayTri() {
    tri.push();
    tri.clear();
    tri.background(255, 255, 0);
    tri.pop();
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
            p5Mapper.load("maps");
            break;

        case 's':
            // saves the layout
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