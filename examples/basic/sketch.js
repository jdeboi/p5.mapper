/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let quadMap, triMap, lineMap, bezMap, polyMap;

let sel;
let mode;
let myFont;
let img;

function preload() {
  img = loadImage("assets/catnap.jpg");
  myFont = loadFont("assets/Roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  initSelection();

  // create mapper object
  pMapper = createProjectionMapper(this);
  console.log(this);
  polyMap = pMapper.createPolyMap(5);
  triMap = pMapper.createTriMap(300, 300);
  quadMap = pMapper.createQuadMap(400, 400);
  lineMap = pMapper.createLineMap();
  bezMap = pMapper.createBezierMap();

  // loads calibration in the "maps" directory
  pMapper.load("maps/map.json");
}

function draw() {
  background(0);
  displayFrameRate();

  switch (mode) {
    case "all":
      lineMap.display(color("lime"));
      quadMap.displayTexture(img);
      triMap.displaySketch(rainbow);
      bezMap.display(color("orange"));
      polyMap.displaySketch(dots);
      break;
    case "solid":
      lineMap.display(color("lime"));
      quadMap.display(color("red"));
      triMap.display(color("blue"));
      bezMap.display(color("orange"));
      polyMap.display(color("purple"));
      break;
    case "image":
      lineMap.display(color("white"));
      quadMap.displayTexture(img);
      triMap.displayTexture(img);
      bezMap.displayTexture(img);
      polyMap.displayTexture(img);
      break;
    case "sketch":
      lineMap.display(color("white"));
      quadMap.displaySketch(drawCoords);
      triMap.displaySketch(drawCoords);
      bezMap.displaySketch(drawCoords);
      polyMap.displaySketch(drawCoords);
      break;
  }
}

function drawCoords(pg) {
  pg.clear();
  pg.push();
  pg.background(0, 255, 0);
  pg.fill(0);

  for (let i = 0; i < 1000; i += 50) {
    pg.text(i, i, 150);
    pg.text(i, 150, i);
  }
  pg.fill(255);
  pg.ellipse(mouseX, mouseY, 50);
  pg.pop();
}

function dots(pg) {
  randomSeed(0);
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.fill(255);
  pg.noStroke();
  for (let i = 0; i < 60; i++) {
    pg.ellipse(random(width), random(height), random(10, 80));
  }
  pg.pop();
}

function rainbow(pg) {
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.colorMode(HSB, 255);

  for (let i = 0; i < 1000; i++) {
    pg.stroke(i % 255, 255, 255);
    pg.line(i, 0, i, 300);
  }
  pg.pop();
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

function initSelection() {
  mode = "all";
  sel = createSelect();
  sel.position(10, 10);
  sel.option("all");
  sel.option("solid");
  sel.option("image");
  sel.option("sketch");
  sel.changed(mySelectEvent);
}

function mySelectEvent() {
  mode = sel.value();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 15, -height / 2 + 50);
}
