/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let surfaces = [];

let myFont;

function preload() {
  myFont = loadFont("assets/Roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // initialize map surfaces
  pMapper = createProjectionMapper(this);

  for (let i = 0; i < 10; i++) {
    surfaces.push(pMapper.createQuadMap(50, 300));
  }
  // load maps
  pMapper.load("maps/map.json");

  textFont(myFont);

  // HSB color for rainbow effect
  colorMode(HSB, 255);
}

function draw() {
  background(0);

  let index = 0;
  for (const surface of surfaces) {
    let col = color((frameCount + index++ * 20) % 255, 255, 255);
    surface.display(col);
  }
  displayFrameRate();
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("maps/map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 50, -height / 2 + 50);
}
