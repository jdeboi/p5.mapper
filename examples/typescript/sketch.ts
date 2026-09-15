// TypeScript example for p5.mapper
//
// Importing p5.mapper applies the runtime patch (createProjectionMapper, etc.
// become callable on any p5 instance). For typing, annotate your sketch's `p`
// as P5WithMapper instead of plain p5 — p5 v2's own bundled types use
// `export default class p5 {}`, which can't be declaration-merged into from
// outside, so plain `p5` won't see the new methods.
import p5 from "p5";
import "p5.mapper";
import type { P5WithMapper } from "p5.mapper";

const sketch = (p: p5) => {
  let pMapper: ReturnType<P5WithMapper["createProjectionMapper"]>;
  let quad: ReturnType<typeof pMapper.createQuadMap>;
  let bez: ReturnType<typeof pMapper.createBezierMap>;

  p.setup = () => {
    p.createCanvas(800, 600, p.WEBGL);
    // p5.mapper's side-effect import above adds createProjectionMapper to
    // every p5 instance at runtime; this cast just tells TS it's there.
    pMapper = (p as unknown as P5WithMapper).createProjectionMapper(p);

    quad = pMapper.createQuadMap(300, 200);
    bez = pMapper.createBezierMap(5);
  };

  p.draw = () => {
    p.background(0);

    // Display a procedural sketch on the quad surface
    quad.displaySketch((g: p5.Graphics) => {
      g.background(20, 20, 80);
      g.fill(255);
      g.noStroke();
      g.textSize(24);
      g.textAlign(g.CENTER, g.CENTER);
      g.text("p5.mapper + TypeScript", g.width / 2, g.height / 2);
    });

    // Display a solid color on the bezier surface
    bez.display(p.color(200, 50, 50));
  };

  p.keyPressed = () => {
    if (p.key === "c") pMapper.toggleCalibration();
    if (p.key === "s") pMapper.save("map.json");
  };

  p.mousePressed = () => {
    pMapper.onClick();
  };

  p.mouseDragged = () => {
    pMapper.onDrag();
  };

  p.mouseReleased = () => {
    pMapper.onRelease();
  };
};

new p5(sketch);
