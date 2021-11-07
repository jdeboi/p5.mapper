 
 
 # p5.mapper

 This library is designed to making projection mapping easy using the popular, easy-to-learn JavaScript library, [p5.js](https://p5js.org/). Checkout the [examples](examples) folder to see full working p5.js sketches.

 ### Installation
 You'll find the library, `p5.mapper.min.js`, in the dist folder of this repo. Include the library in your `index.html` (after loading p5.js):

 ```html
 <script type="text/javascript" src="p5.mapper.min.js"></script>
 ```

### Creating surfaces
```javascript
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    p5Mapper = getP5Mapper();
    
    // width, height, resolution of surfaces
    quad = p5Mapper.createQuad(400, 400, 20, this);
    tri = p5Mapper.createTri(300, 300, 20, this);   
}
```

### Drawing on surfaces
The Quad and Tri `p5Mapper` objects extend the `p5.Graphics` class, which means you can call any methods associated with a `p5.Graphics` object. For example:

```javascript
quad.clear();
quad.imageMode(CENTER);
quad.background(255, 0, 0);
quad.image(img, 0, 0);
quad.fill(255);
quad.ellipse(frameCount%300, 100, 100);
```

### Calibrating

The following methods will start / stop / toggle calibration mode.

```javascript
 p5Mapper.startCalibration();
 p5Mapper.stopCalibration();
 p5Mapper.toggleCalibration();
 ```

To load calibration `json` files from the "maps" directory (inside the project directory):

```javascript
 p5Mapper.load("maps");
```

To save `.json` files (saves one json file per mapped shape):

```javascript
 p5Mapper.save();
```

### Mouse input
Make sure to call the following to ensure you can move the surfaces during calibration:

```javascript
function mousePressed() {
    p5Mapper.onClick();
}

function mouseDragged() {
    p5Mapper.onDrag();
}

function mouseReleased() {
    p5Mapper.onRelease();
}
```


---

 ## Acknowledgements

 The logic of this library builds upon and/or adapts:
 * [David Bouchard's (Java) Processing Keystone Library](http://keystonep5.sourceforge.net/)
 * [Jenny Louthan, projection transform algorithms](https://github.com/jlouthan/perspective-transform) 
