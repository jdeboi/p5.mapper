/*
* p5.mapper
* create mapped surfaces (quad, tri, line, masks)
* 
* Jenna deBoisblanc
* jdeboi.com
* 11/16/2021
* 
*/

let pMapper;
let quadMap, triMap, lineMap, maskMap;

let myFont;
let img;
let x = 0;

function preload() {
    img = loadImage("assets/catnap.jpg");
    myFont = loadFont('assets/Roboto.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    textFont(myFont);

    // create mapper object
    pMapper = createProjectionMapper(this);
    // create mapping surfaces (width / height)
    triMap = pMapper.createTriMap(300, 300);
    quadMap = pMapper.createQuadMap(400, 400);
    lineMap = pMapper.createLineMap();

    // creates a black mask with 5 moveable points
    maskMap = pMapper.createMaskMap(5);

    // loads calibration in the "maps" directory
    pMapper.load("maps/map.json");
}

function draw() {
    background(0);

    displayFrameRate();

    // display order from back to front is determined in setup, not draw
    quadMap.clear();
    quadMap.imageMode(CENTER);
    quadMap.background(255, 0, 0);
    quadMap.image(img, 0, 0);
    quadMap.fill(255);
    quadMap.ellipse(x++ % 300, 100, 100);

    triMap.clear();
    triMap.background(255, 255, 0);

    lineMap.display(color(0, 255, 0));

    maskMap.display();
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            pMapper.toggleCalibration();
            break;
        case 'f':
            // enter/ exit fullscreen mode
            let fs = fullscreen();
            document.getElementById("header").style.display = "none";
            fullscreen(!fs);
            break;
        case 'l':
            // load calibration file
            pMapper.load("maps/map.json");
            break;

        case 's':
            // saves the calibration to map.json
            // change browser download location as needed
            pMapper.save("map.json");
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}
