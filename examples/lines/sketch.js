/*
* p5.mapper
* https://github.com/jdeboi/p5.mapper
* 
* Jenna deBoisblanc
* jdeboi.com
* 
*/

// projection mapping objects
let pMapper;
const lineMaps = [];

// line modes
let lineMode = 0;
const CENTER_PULSE = 0;
const DISPLAY = 1;
const LEFT_PULSE = 2;
const NUM_MODES = LEFT_PULSE + 1;

let startC, endC;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper(this);

    // initialize empty lines
    for (let i = 0; i < 9; i++) {
        let lineMap = pMapper.createLineMap();
        lineMaps.push(lineMap);

        // decrease line width for higher stairs (farther away)
        lineMap.lineW = map(i, 0, 9, 20, 70);

        // end cap display
        // lineMap.setEndCapsOff();
        // lineMap.setEndCapsOn();
    }

    pMapper.load("maps/map.json");

    // initialize gradient colors
    setStartColors();
}

function draw() {
    background(0);

    cycleColors(300);
    cycleLineMode(500);

    // display gradient lines
    let index = 0;
    for (const lineMap of lineMaps) {
        let c = lerpColor(startC, endC, index / 9);
        getLineMode(lineMap, index++, c);
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
        case DISPLAY:
            l.display(c);
            break;
        case WIDTH_PULSE:
            l.displayPercentWidth(percent, c);
            break;
        default:
            l.display(c);
    }
}

function setStartColors() {
    colorMode(HSB, 100);
    startC = color(random(100), 100, 100);
    let endHue = (hue(startC) + random(25, 75)) % 100;
    endC = color(endHue, 100, 100);
    colorMode(RGB, 255);
}

function cycleColors(framesPerCycle) {
    if (frameCount % framesPerCycle === 0) {
        setStartColors();
    }
}

function cycleLineMode(framesPerCycle) {
    if (frameCount % framesPerCycle === 0) {
        lineMode++;
        lineMode %= NUM_MODES;
    }
}

function keyPressed() {
    switch (key) {
        case 'c':
            pMapper.toggleCalibration();
            break;
        case 'f':
            let fs = fullscreen();
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


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

