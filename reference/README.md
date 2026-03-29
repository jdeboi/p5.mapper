- [Reference](#reference)
  - [QuadMap](#quadmap)
  - [TriMap](#trimap)
  - [BezierMap](#beziermap)
  - [LineMap](#linemap)

---
# Reference

```javascript
const pMapper = createProjectionMapper(this);
```

Methods to create mapping surfaces:
* `pMapper.createQuadMap(width, height, [resolution])`
* `pMapper.createTriMap(width, height, [resolution])`
* `pMapper.createPolyMap([numPoints])`
* `pMapper.createBezierMap([numPoints])`
* `pMapper.createLineMap([x0], [y0], [x1], [y1])`


Get the value of an oscillator (useful for LineMap animations):
* `pMapper.getOscillator(seconds, [offset])`
  * Returns a number 0–1 that oscillates with a `seconds`-long period and an optional phase `offset` (sine wave helper)

Saving / loading methods:
* `pMapper.save([filename.json])`
* `pMapper.load([directory/filename.json], [callback])`

```javascript
pMapper.load("maps/map.json", () => console.log("done loading json"));
```

Calibrating methods:
* `pMapper.startCalibration()`
* `pMapper.stopCalibration()`
* `pMapper.toggleCalibration()`

In calibration mode, dragging can be restricted:
* `pMapper.moveAll()`
  * allows dragging surfaces or control points
* `pMapper.moveSurfaces()`
  * limits movement to dragging surfaces (not control points)
* `pMapper.moveControlPoints()`
  * limits movement to control points only

## QuadMap
Quads perform a perspective matrix transform of visuals (unlike the other surface objects). The following methods are available:
* `display([color])`
* `displayTexture(img, [x], [y], [w], [h])`
  * *img* — a `p5.Image`, `p5.Element`, or `p5.Texture`
  * *x*, *y* — top-left corner of the source image (default: 0, 0)
  * *w*, *h* — source dimensions (default: image size)
* `displaySketch(fn, [x], [y], [w], [h])`
  * *fn* — a function that receives a `p5.Graphics` object and draws on it

## TriMap
A triangular surface with three control points (apex, bottom-left, bottom-right). Extends QuadMap and shares the same display interface:
* `display([color])`
* `displayTexture(img, [x], [y], [w], [h])`
* `displaySketch(fn, [x], [y], [w], [h])`

## BezierMap

```javascript
const bezMap = pMapper.createBezierMap([numPoints]);
```

Bezier objects have the following display methods:
* `bezMap.display([color])`
* `bezMap.displayTexture(img, [x], [y], [w], [h])`
  * *img* — a `p5.Image`, `p5.Element`, or `p5.Texture`
  * *x*, *y* — top-left corner of the source image (default: 0, 0)
  * *w*, *h* — source dimensions (default: image size)
* `bezMap.displaySketch(fn, [x], [y], [w], [h])`
  * *fn* — a function that receives a `p5.Graphics` object and draws on it

To add / remove points to a bezier map:
* `bezMap.addSegment([x], [y])`
  * *x*, *y* default to mouse position; otherwise specify coordinates
* `bezMap.removeSegment([x], [y])`
  * *x*, *y* default to mouse position (deletes closest anchor); otherwise specify coordinates

## LineMap

To create a line map:
```javascript
const lineMap = pMapper.createLineMap();
```

Initialize with explicit coordinates:
```javascript
const lineMap = pMapper.createLineMap(-200, 0, 100, 100);
```

Display methods (all accept an optional color and stroke weight):
* `lineMap.display([color], [strokeWeight])`
* `lineMap.displayNone()`
  * draws the line in black (hides it on a black background)
* `lineMap.displayPercent(percent, [color], [strokeWeight])`
  * draws from `p0` to a point `percent` of the way toward `p1`
* `lineMap.displayCenterPulse(percent, [color], [strokeWeight])`
  * pulses outward from the center toward both endpoints
* `lineMap.displayPercentWidth(percent, [color])`
  * keeps the full line but scales stroke width by `percent`
* `lineMap.displaySegment(startPercent, sizePercent, [color], [strokeWeight])`
  * draws a segment of the line starting at `startPercent` with length `sizePercent`
* `lineMap.displayRainbowCycle()`
  * HSB hue cycle tied to `frameCount`
* `lineMap.displayGradientLine(color0, color1, percent, [phase], [flip])`
  * swept two-color gradient along the line
* `lineMap.displayNumber()`
  * renders the line's id at its midpoint — helpful when line order matters

End cap control:
* `lineMap.setEndCapsOn()` (default)
* `lineMap.setEndCapsOff()`

Setting line width — set the property directly:
```javascript
lineMap.lineW = 20;
```

Mouse-over callback (useful for click interactions):
* `lineMap.isMouseOverCallback(callback)`

```javascript
function mousePressed() {
  for (const lineMap of lineMaps) {
    lineMap.isMouseOverCallback(lineClickedCallback);
  }
}

function lineClickedCallback(line) {
  selectedLine = line;
}

function setLineThickness(increment) {
  if (selectedLine != null) {
    selectedLine.lineW += increment;
  }
}
```
