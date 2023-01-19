/*
* p5.mapper
* https://github.com/jdeboi/p5.mapper
* 
* Jenna deBoisblanc
* jdeboi.com
* 
*/

let pMapper;
let quadMap;

let video;
let isPlaying = false;

let myFont;


function preload() {
    myFont = loadFont('assets/Roboto.ttf');
    video = createVideo(['assets/fingers.mov', 'assets/fingers.webm']);
    video.hide();
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    textFont(myFont);

    pMapper = createProjectionMapper(this);
    quadMap = pMapper.createQuadMap(video.width, video.height);
    pMapper.load("maps/map.json");
}

function draw() {
    background(0);

    displayFrameRate();

    
    if (isPlaying) {
        quadMap.displayTexture(video);
    }
    else {
        fill(255);
        text("click to play", 0, 0);
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

function mousePressed() {
    isPlaying = true;
    video.loop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}