let pMapper;
let quadMap, triMap, lineMap;
let maskMap;

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

    pMapper = createProjectionMapper(this);
    triMap = pMapper.createTriMap(300, 300);
    quadMap = pMapper.createQuadMap(400, 400);
    lineMap = pMapper.createLineMap();


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
    // triMap.background(255, 255, 0);

    lineMap.display(color(0, 255, 0));

    maskMap.display();
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            pMapper.toggleCalibration();
            break;
        case 'f':
            let fs = fullscreen();
            document.getElementById("header").style.display = "none";
            fullscreen(!fs);
            break;
        case 'l':
            pMapper.load("maps/map.json");
            break;

        case 's':
            // saves the calibration to map.json
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