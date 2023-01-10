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
let quadMap, triMap, lineMap, bezMap, polyMap;

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
    bezMap = pMapper.createBezierMap();
    // creates a black mask with 5 moveable points
    polyMap = pMapper.createPolyMap(5);

    // loads calibration in the "maps" directory
    pMapper.load("maps/map.json");
}

function draw() {
    background(100);

    displayFrameRate();

    // display order from back to front is determined in setup, not draw
    quadMap.display(color('red'));
    triMap.display(color('blue'));
    lineMap.display(color('lime'));
    bezMap.display(color('orange'));
    polyMap.display(color('black'));
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


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}
