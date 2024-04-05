/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let bez1, bez2;
let lastClickedBez = null;

let myFont;

function preload() {
  myFont = loadFont("assets/Roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  pMapper = createProjectionMapper(this);

  bez1 = pMapper.createBezierMap(2);
  bez2 = pMapper.createBezierMap(5);

  lastClickedBez = bez1;

  textFont(myFont);

  pMapper.load("maps/map.json");
  pMapper.toggleCalibration();
}

function draw() {
  background(0);

  bez1.display(color("red"));
  bez2.displaySketch(mouseSketch);

  displayFrameRate();
}

function mousePressed() {
  setBezClicked();
  setAnchors();
}

function setAnchors() {
  // if shift is down while clicking, add anchor and controls points
  if (keyIsDown(SHIFT)) {
    lastClickedBez.addSegment();
  }
  // if 'd' key is down when clicking, remove anchor
  else if (keyIsDown(68)) {
    lastClickedBez.removeSegment();
  }
}

function setBezClicked() {
  if (bez1.isMouseOver()) {
    console.log("first bez selected");
    lastClickedBez = bez1;
  } else if (bez2.isMouseOver()) {
    console.log("second bez selected");
    lastClickedBez = bez2;
  }
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

function mouseSketch(pg) {
  pg.push();
  pg.background("blue");
  pg.fill(255);
  pg.ellipse(mouseX, mouseY, 300);
  pg.pop();
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 50, -height / 2 + 50);
}
