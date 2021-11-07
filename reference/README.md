## Reference

  - [ProjectionMapper](#projectionmapper)
  - [QuadMap](#quadmap)
  - [TriMap](#trimap)
  - [LineMap](#linemap)

### ProjectionMapper

```javascript
const pMapper = createProjectionMapper();
```
  
Creating mapping surfaces:
* `createQuadMap(width, height, resolution, pInstance)`
* `createTriMap(width, height, resolution, pInstance)`
* `createLineMap(x0, y0, x1, y1)`
  
Saving / loading:
* `save()`
* `load(directory)`
  
Calibrating:
* `startCalibration()`
* `stopCalibration()`
* `toggleCalibration()`
  
Mouse interaction (for calibration):
* `onClick()`
* `onDrag()`
* `onRelease()`



### QuadMap

The QuadMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
const pMapper = createProjectionMapper();
// width, height, resolution
const quad = pMapper.createQuadMap(400, 400, 20, this);
quad.clear();
quad.background(255, 0, 0);
quad.fill(255);
quad.ellipse(100, 100, 100);
// many more ...
```

### TriMap

The TriMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
const pMapper = createProjectionMapper();
// width, height, resolution
const tri = pMapper.createTri(400, 400, 20, this);
tri.clear();
tri.background(255, 0, 0);
tri.fill(255);
tri.ellipse(100, 100, 100);
// many more ...
```

### LineMap

```javascript
const pMapper = createProjectionMapper();
// x0, y0, x1, y1
const line = pMapper.createLineMap(-100, -100, 200, 200);
```

* display(color)
