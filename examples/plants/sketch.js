let pMapper;
let surfaces = [];

let flowers = [];

let flyingTerr = 0;
let windAngle = 0;

let myFont;

function preload() {
    myFont = loadFont('assets/Roboto.ttf');
}

function setup() {
    // createCanvas(windowWidth, windowHeight, WEBGL);
    let renderer = createCanvas(windowWidth, windowHeight, WEBGL);
    renderer.drawingContext.disable(renderer.drawingContext.DEPTH_TEST);

    textFont(myFont);

    pMapper = createProjectionMapper(this);
    for (let i = 0; i < 7; i++) {
        surfaces.push(pMapper.createQuadMap(500, height - 100));
    }
    pMapper.load("maps/map.json");

    let gf = 1.4;
    flowers.push(new Blueeye(surfaces[0].height, gf));
    flowers.push(new Obedient(surfaces[1].height, gf));
    flowers.push(new Rose(surfaces[2].height, gf));
    flowers.push(new Beauty(surfaces[3].height, gf));
    flowers.push(new Stokes(surfaces[4].height, gf));
    flowers.push(new Sleeping(surfaces[5].height, gf));
    flowers.push(new Clasping(surfaces[6].height, gf));

    drawingContext.disable(drawingContext.DEPTH_TEST);

}

function draw() {
    background(0);
    displayFrameRate();

    let index = 0;
    for (const surface of surfaces) {
        surface.clear();
        // surface.background(index * 20, index * 20, 0);
        flowers[index++].display(surface);
    }


    for (const flower of flowers)
        flower.grow();

    wind();
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

function wind() {
    let windForce = map(noise(0, flyingTerr), 0, 1, -PI / 15, PI / 15);
    windAngle = windForce + windForce / 4 * sin(map(noise(0, flyingTerr += .01), 0, 1, 0, width) / 1000.0);
}

function displayFrameRate() {
    fill(255);
    noStroke();
    text(round(frameRate()), -width / 2 + 20, -height / 2 + 20);
}