
  - [ProjectionMapper](#projectionmapper)
  - [QuadMap](#quadmap)
  - [TriMap](#trimap)
  - [LineMap](#linemap)
  - [MaskMap](#maskmap)

---

## ProjectionMapper

```javascript
const pMapper = createProjectionMapper(this);
```
  
Methods to create mapping surfaces:
* `createQuadMap(width, height, [resolution])`
* `createTriMap(width, height, [resolution])`
* `createLineMap([x0, y0, x1, y1])`
* `createMaskMap(numPoints)`

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
  
`DEPRECATED` (no longer need to call explicitly) — mouse interaction (for calibration):
* `onClick()`
* `onDrag()`
* `onRelease()`



## QuadMap

The QuadMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
const pMapper = createProjectionMapper();
// width, height
const quad = pMapper.createQuadMap(400, 400);
quad.clear();
quad.background(255, 0, 0);
quad.fill(255);
quad.ellipse(100, 100, 100);
// many more ...
```

You can optionally initialize with a map resolution (defaults to 20):
```javascript
const tri = pMapper.createQuadMap(400, 400, 30);
```

## TriMap

The TriMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
const pMapper = createProjectionMapper(this);
const tri = pMapper.createTri(400, 400);
tri.clear();
tri.background(255, 0, 0);
tri.fill(255);
tri.ellipse(100, 100, 100);
// many more ...
```

You can optionally initialize with a map resolution (defaults to 20):
```javascript
const tri = pMapper.createTri(400, 400, 30);
```

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


# MaskMap
Useful for masking out parts of shapes. You can create a mask with an arbitrary number of points and then move those points around to cover up other projection maps.

```javascript
const pMapper = createProjectionMapper(this);
// initialize with a number of points
const line = pMapper.createMaskMap(6);
```

Methods
* `display()`
