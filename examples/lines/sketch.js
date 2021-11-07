let pMapper;
const lines = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper();
    lines.push(pMapper.createLine(-200, -200, 100, 40));
    // loads surface layouts in the "maps" directory
    // p5Mapper.load("maps");
}

function draw() {
    background(0);
   
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
            // p5Mapper.load("maps");
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