/*
* p5.mapper
* projection mapping indigenous plants from New Orleans
* part of Plant Dat project
* https://jdeboi.com/projects/2019/plantdat.html
*
* Jenna deBoisblanc
* jdeboi.com
* 11/16/2021
* 
*/

let pMapper;
let surfaces = [];

let flowers = [];

let windAngle = 0;
let windOffset = 0;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // initialize mapping surfaces
    pMapper = createProjectionMapper(this);
    for (let i = 0; i < 7; i++) {
        surfaces.push(pMapper.createQuadMap(300, 400));
    }
    pMapper.load("maps/map.json");

    // initialize flower objects
    let gf = 1.4;
    flowers.push(new Blueeye(surfaces[0].height, gf));
    flowers.push(new Obedient(surfaces[1].height, gf));
    flowers.push(new Rose(surfaces[2].height, gf));
    flowers.push(new Beauty(surfaces[3].height, gf));
    flowers.push(new Stokes(surfaces[4].height, gf));
    flowers.push(new Sleeping(surfaces[5].height, gf));
    flowers.push(new Clasping(surfaces[6].height, gf));
}

function draw() {
    background(0);

    // draw mapped surfaces
    let index = 0;
    for (const surface of surfaces) {
        surface.clear();
        flowers[index++].display(surface);
    }

    // grow flowers
    for (const flower of flowers) {
        flower.grow();
    }
        
    // the elements
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
    let windForce = map(noise(0, windOffset), 0, 1, -PI / 15, PI / 15);
    windAngle = windForce + windForce / 4 * sin(map(noise(0, windOffset += .01), 0, 1, 0, width) / 1000.0);
}
