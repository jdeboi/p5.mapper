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


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper(this);

    // p5.js 2.0 removed preload(), so assets are loaded here with callbacks
    loadFont('assets/Roboto.ttf', (font) => {
        myFont = font;
        textFont(myFont);
    });

    // the video's width/height aren't known until it's loaded, so the
    // quadMap that displays it is created inside this callback. map.json is
    // loaded here too, since pMapper.load() only applies saved calibration
    // to surfaces that already exist.
    video = createVideo(['assets/fingers.mov', 'assets/fingers.webm'], () => {
        video.hide();
        quadMap = pMapper.createQuadMap(video.width, video.height);
        pMapper.load("maps/map.json");
    });
}

function draw() {
    background(0);

    displayFrameRate();

    
    if (isPlaying && quadMap) {
        quadMap.displayTexture(video);
    }
    else if (myFont) {
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
    if (!myFont) return; // font hasn't finished loading yet

    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}