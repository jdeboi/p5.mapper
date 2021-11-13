let pMapper;
const lineMaps = [];
let myFont;

function preload() {
    myFont = loadFont('assets/Roboto.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);

    pMapper = createProjectionMapper();
    for (let i = 0; i < 4; i++) {
        lineMaps.push(pMapper.createLineMap());
    }
    pMapper.load("maps/map.json");
}

function draw() {
    background(0);
    displayFrameRate();

    for (const lineMap of lineMaps) {
        let per = frameCount/200.0%1;
        // lineMap.display();
        lineMap.display(color(255, 0, 255));
        // lineMap.displayPercent(per);
        // lineMap.displayCenterPulse(per);
        // lineMap.displayPercentWidth(per);
        // lineMap.displayRainbowCycle()
        // lineMap.displayGradientLine(color(0, 255, 255), color(0, 0, 255), per);
    }
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width/2 + 20, -height/2 + 20);
}

function keyPressed() {
    switch (key) {
        case 'c':
            pMapper.toggleCalibration();
            break;

        case 'l':
            pMapper.load("maps/map.json");
            break;

        case 's':
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