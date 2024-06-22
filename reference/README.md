- [Reference](#reference)
  - [QuadMap](#quadmap)
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
  * (basically a sine wave helper- returns a number 0-1 that oscillates with a `seconds`-long period and an optional phase, `offset`
  
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
  
In calibration mode, it's possible to limit dragging to surfaces / control points:
* `pMapper.moveAll()`
  * sets dragging to surfaces or control points
* `pMapper.moveSurfaces()`
  * limits movement to dragging surfaces (not control points)
* `pMapper.moveControlPoints()`
  * limits movement to control points
  
## QuadMap
Quads do perspective matrix transformation of visuals (unlike the other surface objects). Quads have the following methods:
* `display([color])`
* `displayTexture(img, [x], [y], [w], [h])`
  * *img* - a p5.Image|p5.Element|p5.Texture
  * *x* - the x-coordinate of the top-left corner of the image
  * *y* - the y-coordinate of the top-left corner of the image
  * *w* - the width of the image
  * *h* - the height of the image
* `displaySketch(function, [x], [y], [w], [h])`
  * *function* - a function that has a graphics parameter and draws on the graphics object 

## BezierMap

```javascript
const bezMap = pMapper.createBezierMap([numPoints]);
```
  
Bezier objects have the following methods:
* `bezMap.display([color])`
* `bezMap.displayTexture(img, [x], [y], [w], [h])`
  * *img* - a p5.Image|p5.Element|p5.Texture
  * *x* - the x-coordinate of the top-left corner of the image
  * *y* - the y-coordinate of the top-left corner of the image
  * *w* - the width of the image
  * *h* - the height of the image
* `bezMap.displaySketch(function, [x], [y], [w], [h])`
  * *function* - a function that has a graphics parameter and draws on the graphics object 

To add / remove points to a bezier map:
* `bezMap.addSegment([x], [y])`
  * x and y default to location of the mouse; otherwise, specify coordinates
* `bezMap.removeSegment([x], [y])`
  * x and y default to location of the mouse (delete by clicking on anchor point); otherwise, specify coordinates

## LineMap

To create a line map:
```javascript
const lineMap = pMapper.createLineMap();
```

It's also possible to initialize with x y values:
```javascript
const lineMap = pMapper.createLineMap(-200, 0, 100, 100);
```

The following display methods can optionally take a color object:
* `lineMap.display([color])`
* `lineMap.displayPercent(percent, [color])`
* `lineMap.displayCenterPulse(percent, [color])`
* `lineMap.displayPercentWidth(percent, [color])`
* `lineMap.displayRainbowCycle()`
* `lineMap.displayGradientLine(color0, color1, percent, [phase])`
  * currently super expensive.. TODO..
* `lineMap.displayNumber()`
  * a helper when the line order matters and you need to visualize the line id
* `lineMap.OnMouseOverCallback(callback)`
  * useful if you want to call a function if a line has been clicked, for example to set the line thickness

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
    selectedLine.setLineThickness(selectedLine.lineW + increment);
  }
}
```


