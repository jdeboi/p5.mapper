

# p5.mapper

p5.mapper is a projection mapping library for [p5.js](https://p5js.org/). This library makes it easy to code and keystone interactive, algorithmic sketches. Created by [Jenna deBoisblanc](https://jdeboi.com/).


* [Examples](examples)
* [Reference](reference/README.md)

![projection mapped example](images/mapped_surfaces.png)
![shapes example](images/shapes.png)

You'll find the library, `p5.mapper.min.js`, in the dist folder of this repo. Include the library in your `index.html` (after loading p5.js).

```html
<script type="text/javascript" src="p5.mapper.min.js"></script>
```

Inside the `sketch.js`:
```javascript
let pMapper;
let quadMap, triMap, lineMap, maskMap;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    // create mapping surfaces
    triMap = pMapper.createTriMap(300, 300);
    quadMap = pMapper.createQuadMap(400, 400);
    lineMap = pMapper.createLineMap();

    // creates a black mask with 5 moveable points
    maskMap = pMapper.createMaskMap(5);
}

function draw() {
    background(0);

    // display order from back to front is determined in setup, not draw
    quadMap.clear();
    quadMap.background(255, 0, 0);

    triMap.clear();
    triMap.background(255, 255, 0);

    lineMap.display(color(0, 255, 0));

    maskMap.display();
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode
            pMapper.toggleCalibration();
            break;
        case 'l':
            // load calibration file
            pMapper.load("maps/map.json");
            break;
        case 's':
            // saves the calibration to map.json
            pMapper.save("map.json");
            break;
    }
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

