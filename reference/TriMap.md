# p5.mapper Reference

## TriMap

```javascript
const pMapper = createProjectionMapper();
// width, height, resolution
const tri = pMapper.createTri(400, 400, 20, this);
```

### Methods
The TriMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
tri.clear();
tri.background(255, 0, 0);
tri.fill(255);
tri.ellipse(100, 100, 100);
// many more ...
```
