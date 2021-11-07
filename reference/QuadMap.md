# p5.mapper Reference

## QuadMap

```javascript
const pMapper = createProjectionMapper();
// width, height, resolution
const quad = pMapper.createQuadMap(400, 400, 20, this);
```

### Methods
The QuadMap class extends `p5.Graphics`, which means this class inherits all of the methods associated with the `p5.Graphics` object. For example:

```javascript
quad.clear();
quad.background(255, 0, 0);
quad.fill(255);
quad.ellipse(100, 100, 100);
// many more ...
```
