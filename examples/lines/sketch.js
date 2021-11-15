let lineMode = 0;
const CENTER_PULSE = 0;
const WIDTH_PULSE = 1;
const LEFT_PULSE = 2;
const NUM_MODES = LEFT_PULSE+1;

let pMapper;
const lineMaps = [];

let myFont;
let startC, endC, nextStartC;

function preload() {
    myFont = loadFont('assets/Roboto.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);

    pMapper = createProjectionMapper(this);
    for (let i = 0; i < 9; i++) {
        lineMaps.push(pMapper.createLineMap());
    }

    colorMode(HSB, 100);
    setStartColors();
    // pMapper.load("maps/map.json");
}

function draw() {
    background(0);
    displayFrameRate();

    cycleColors(.1);
    cycleLineMode(500);

    let index = 0;
    for (const lineMap of lineMaps) {
        let c = lerpColor(startC, endC, index / 9);
        getLineMode(lineMap, index++, c);
    }
}

function setStartColors() {
    startC = color(random(100), 100, 100);
    let endHue = (hue(startC) + random(25, 75)) % 100;
    endC = color(endHue, 100, 100);
}

function cycleColors(dC) {
    startC = color((hue(startC) + dC) % 100, 100, 100);
    endC = color((hue(endC) + dC) % 100, 100, 100);
}

function cycleLineMode(framesPerCycle) {
    if (frameCount % framesPerCycle === 0) {
        lineMode++;
        lineMode %= NUM_MODES;
    }
}

function getLineMode(l, index, c) {
    let offset = index / 9 * 2 * PI;
    let percent = pMapper.getOscillator(3, offset);
    switch (lineMode) {
        case LEFT_PULSE:
            l.displayPercent(percent, c);
            break;
        case CENTER_PULSE:
            l.displayCenterPulse(percent, c);
            break;
        case WIDTH_PULSE:
            l.displayPercentWidth(percent, c);
            break;
        default:
            l.display(c);
    }
}



function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}

function keyPressed() {
    switch (key) {
        case 'c':
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