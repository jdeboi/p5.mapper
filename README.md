# p5.mapper

This library is designed to making projection mapping easy using the popular, easy-to-learn JavaScript library, [p5.js](https://p5js.org/). 

* [Examples](examples/README.md)
* [Reference](reference/README.md)


## Overview 
You'll find the library, `p5.mapper.min.js`, in the dist folder of this repo. Include the library in your `index.html` (after loading p5.js).

```html
<script type="text/javascript" src="p5.mapper.min.js"></script>
```

```javascript
// sketch.js
const pMapper;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper();
    quad = pMapper.createQuad(400, 400, 20, this);
}

function draw() {
    background(0);

    quad.clear();
    quad.background(255, 0, 0);
    quad.fill(255);
    quad.ellipse(0, 0, 100);
}

function keyPressed() {
    if (key === 'c')
        pMapper.toggleCalibration();
}

function mousePressed() {
    pMapper.onClick();
}

function mouseDragged() {
    pMapper.onDrag();
}

function mouseReleased() {
    pMapper.onRelease();
}
```



 ## Acknowledgements

 The logic of this library builds upon and/or adapts:
 * [David Bouchard's (Java) Processing Keystone Library](http://keystonep5.sourceforge.net/)
 * [Jenny Louthan, projection transform algorithms](https://github.com/jlouthan/perspective-transform) 
