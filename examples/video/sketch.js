let pMapper;
let video;
let quadMap;
let myFont;
let isPlaying = false;

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

    quadMap.clear();
    quadMap.translate(-quadMap.width / 2, -quadMap.height / 2);
    if (isPlaying)
        quadMap.image(video, 0, 0);
    quadMap.noFill();
    quadMap.stroke(0, 255, 0);
    quadMap.rect(5, 5, quadMap.width - 25, quadMap.height - 20);
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
    isPlaying = true;
    video.loop();
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