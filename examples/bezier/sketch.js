/*
* p5.mapper
* https://github.com/jdeboi/p5.mapper
* 
* Jenna deBoisblanc
* jdeboi.com
* 
*/

let pMapper;
let bez;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper(this);
  
    bez = pMapper.createBezierMap(5);
    // pMapper.load("maps/map.json");
}

function draw() {
    background(100);

    bez.display(color('blue'));
   
}

function mousePressed() {
    // if shift is down while clicking, add anchor and controls points
    if (keyIsDown(SHIFT)) {
        bez.addSegment();
    }
    // if 'd' key is down when clicking, remove anchor
    else if (keyIsDown(68)) {
        bez.removeSegment();
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
