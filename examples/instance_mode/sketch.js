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

let font;
let img;

new p5((p5) => {
  p5.preload = () => {
    font = p5.loadFont("./assets/Roboto.ttf");
    img = p5.loadImage("./assets/catnap.jpg");
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.textFont(font);

    // create mapper object
    pMapper = p5.createProjectionMapper(p5);

    polyMap = pMapper.createPolyMap(5);
    triMap = pMapper.createTriMap(300, 300);
    quadMap = pMapper.createQuadMap(400, 400);
    lineMap = pMapper.createLineMap();
    bezMap = pMapper.createBezierMap();

    // loads calibration in the "maps" directory
    pMapper.load("maps/map.json");
  };

  p5.draw = () => {
    p5.background(0);

    lineMap.display(p5.color("lime"));
    quadMap.displayTexture(img);
    triMap.displaySketch((pg) => rainbow(pg, p5));
    bezMap.display(p5.color("orange"));
    polyMap.displaySketch((pg) => dots(pg, p5));

    p5.displayFrameRate();
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  p5.keyPressed = () => {
    switch (p5.key) {
      case "c":
        pMapper.toggleCalibration();
        break;
      case "f":
        let fs = p5.fullscreen();
        fullscreen(!fs);
        break;
      case "l":
        pMapper.load("maps/map.json");
        break;

      case "s":
        pMapper.save("map.json");
        break;
    }
  };

  p5.displayFrameRate = () => {
    p5.textFont(font);
    p5.fill(255);
    p5.noStroke();
    p5.textSize(18);
    p5.text(p5.round(p5.frameRate()), -p5.width / 2 + 50, -p5.height / 2 + 50);
  };
});

function dots(pg, p5) {
  p5.randomSeed(0);
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.fill(255);
  pg.noStroke();
  for (let i = 0; i < 60; i++) {
    pg.ellipse(p5.random(p5.width), p5.random(p5.height), p5.random(10, 80));
  }
  pg.pop();
}

function rainbow(pg, p5) {
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.colorMode(p5.HSB, 255);

  for (let i = 0; i < 1000; i++) {
    pg.stroke(i % 255, 255, 255);
    pg.line(i, 0, i, 300);
  }
  pg.pop();
}
