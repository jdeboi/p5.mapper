let pMapper;
let surfaces = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper(this);

    for (let i = 0; i < 5; i++) {
        surfaces.push(pMapper.createQuadMap(100, 400));
    }
    pMapper.load("maps/map.json");
}

function draw() {
    background(0);

    let index = 0;
    for (const surface of surfaces) {
        let bg = map(index++, 0, surfaces.length, 0, 255);
        surface.push();
        surface.clear();
        surface.background((bg + frameCount) % 255);
        surface.pop();
    }
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