let pMapper;
let surfaces = [];
let palette = ["#4464a1", "#56a1c4", "#ee726b", "#ffc5c7", "#fef9c6", "#df5f50", "#5a3034", "#f5b800", "#ffcc4d", "#4b8a5f", "#e590b8"];
// let palette = ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6", "#EE9B00", "#CA6702", "#BB3E03", "#AE2012", "#9B2226"]
// let palette = ["#080708","#3772ff","#df2935","#fdca40","#e6e8e6"]; // primary

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    pMapper = createProjectionMapper(this);

    for (let i = 0; i < 10; i++) {
        surfaces.push(pMapper.createQuadMap(50, 300, 4));
    }
    pMapper.load("maps/map.json");
}

function draw() {
    background(0);

    
    // colorMode(HSB, 255);

    

    if (frameCount % 60 === 0) {
        drawSurfaces();
    }
}

function drawSurfaces() {
    let index = 0;
    for (const surface of surfaces) {
        let col = color((frameCount + index * 20) % 255, 255, 255);
        let bg = map(index++, 0, surfaces.length, 0, 255);
        col = color((bg + frameCount) % 255, 0, 255);
        // surface.colorMode(HSB, 255);
        surface.push();
        surface.clear();
        surface.translate(-surface.width / 2, -surface.height / 2);
        // surface.background(col);

        // displayShapes(surface, index);
        makeShapes(surface);
        surface.pop();
    }
}

function displayShapes(surface, index) {
    let h = 20;

    randomSeed(index);
    for (let i = 0; i < surface.height; i += h) {
        surface.fill(random(palette));
        surface.rect(0, i, surface.width, h);
    }
}

// function shufflePalette() {
//     let r1 = floor(random(palette.length));
//     let r2 = floor(random(palette.length));
//     let temp = palette[r1];
//     palette[r1] = palette[r2];
//     palette[r2] = temp;
// }

function makeTile(x, y, s, surface) {
    shuffle(palette, true);
    surface.fill(palette[0]);
    surface.square(x, y, s);
    surface.push();
    surface.translate(x + s / 2, y + s / 2);
    surface.rotate(random([0, PI / 2, PI, 3 * PI / 2]));
    surface.fill(palette[1]);
    let r = floor(random(4));
    if (r == 0) {
        surface.arc(-s / 2, 0, s, s, -PI / 2, PI / 2);
    } else if (r == 1) {
        surface.rect(-s / 2, -s / 2, s / 2, s);
    } else if (r == 2) {
        surface.triangle(-s / 2, -s / 2, s / 2, -s / 2, -s / 2, s / 2);
    }
    surface.pop();
}

function makeShapes(surface) {
    let s = width / 15;

    for (let x = 0; x < width; x += s) {
        for (let y = 0; y < height; y += s) {
            if (random() < 1 / 2) {
                makeTile(x, y, s / 2, surface);
                makeTile(x + s / 2, y, s / 2, surface);
                makeTile(x, y + s / 2, s / 2, surface);
                makeTile(x + s / 2, y + s / 2, s / 2, surface);
            } else {
                makeTile(x, y, s, surface);
            }
        }
    }
}

function keyPressed() {
    switch (key) {
        case 'c':
            pMapper.toggleCalibration();
            break;
        case 'f':
            let fs = fullscreen();
            document.getElementById("header").style.display = "none";
            fullscreen(!fs);
            break;
        case 'l':
            pMapper.load("maps/map.json");
            break;

        case 's':
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}