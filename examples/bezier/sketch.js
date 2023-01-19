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
    if (keyIsDown(SHIFT)) {
        console.log("adding bezier point");
        bez.addSegment();
    }
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode, where surfaces can be warped 
            // and moved
            pMapper.toggleCalibration();
            break;
        case 'f':
            // enter/ exit fullscreen mode
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case 'l':
            // load calibration file
            pMapper.load("maps/map.json");
            break;

        case 's':
            // saves the calibration to map.json
            // change browser download location as needed
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
