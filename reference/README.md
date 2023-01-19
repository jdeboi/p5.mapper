
  - [ProjectionMapper](#projectionmapper)
---

# TODO - this reference is a work in progress

## ProjectionMapper

```javascript
const pMapper = createProjectionMapper(this);
```
  
Methods to create mapping surfaces:
* `createQuadMap(width, height, [resolution])`
* `createTriMap(width, height, [resolution])`
* `createPolyMap([numPoints])`
* `createBezierMap([numPoints])`
* `createLineMap([x0], [y0], [x1], [y1])`


Get the value of an oscillator (useful for LineMap animations):
* `getOscillator(seconds, [offset])`
  * (bascially a sine wave helper- returns a number 0-1 that oscillates with a `seconds`-long period and an optional phase, `offset`
  
Saving / loading methods:
* `save([filename.json])`
* `load([directory/filename.json])`
  
Calibrating methods:
* `startCalibration()`
* `stopCalibration()`
* `toggleCalibration()`
  
## LineMap

To create a line map:
```javascript
const pMapper = createProjectionMapper(this);
const line = pMapper.createLineMap();
```

It's also possible to initialize with x y values:
```javascript
const pMapper = createProjectionMapper(this);
const line = pMapper.createLineMap(-200, 0, 100, 100);
```

The following display methods can optionally take a color object:
* `display([color])`
* `displayPercent(percent, [color])`
* `displayCenterPulse(percent, [color])`
* `displayPercentWidth(percent, [color])`
* `displayRainbowCycle()`
* `displayGradientLine(color0, color1, percent, [phase])`
  * currently super expensive.. TODO..

