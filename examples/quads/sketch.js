/*
* p5.mapper
* Display rainbow array of quad maps
* 
* Jenna deBoisblanc
* jdeboi.com
* 11/16/2021
* 
*/

let pMapper;
let surfaces = [];


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // initialize map surfaces
    pMapper = createProjectionMapper(this);
    for (let i = 0; i < 10; i++) {
        surfaces.push(pMapper.createQuadMap(50, 300, 4));
    }
    // load maps
    pMapper.load("maps/map.json");

    // HSB color for rainbow effect
    colorMode(HSB, 255);
}

function draw() {
    background(0);

    // draw on quad surfaces
    let index = 0;
    for (const surface of surfaces) {
        let col = color((frameCount + index++ * 20) % 255, 255, 255);
        surface.clear();
        surface.background(col);
    }
}


function keyPressed() {
    switch (key) {
        case 'c':
            // toggle calibration
            pMapper.toggleCalibration();
            break;
        case 'f':
            // toggle fullscreen
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}