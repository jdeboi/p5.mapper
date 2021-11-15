export function inside(point, polyon, offset) {

    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point.x, y = point.y;

    var inside = false;
    for (var i = 0, j = polyon.length - 1; i < polyon.length; j = i++) {
        var xi = polyon[i].x + offset.x, yi = polyon[i].y + offset.y;
        var xj = polyon[j].x + offset.x, yj = polyon[j].y + offset.y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

export function getRandomizedColor(id, type) {
    let shapeOffset = type ? type[0].charCodeAt(0) : 2;
    let offset = (1 + id) * 88 + shapeOffset * 80;
    // a kind of wack hash function (?) for randomized color
    // based on parent (so all 4 control points are same color)
    colorMode(HSB, 255);
    let col = color(offset % 255, 255, 255);
    colorMode(RGB, 255);
    return col;
}

export function getPercent(seconds = 1) {
    seconds = constrain(seconds, .1, 100);
    // 60 frames / second
    let per = frameCount / (60*seconds) % 1;
    // console.log(frameCount / (60*seconds), per)
    return per;
}


export function getPercentWave(seconds=1, offset=0) {
    seconds = constrain(seconds, .01, 100);
    let per = .5 + .5*sin(frameCount/(60*seconds)*2*PI + offset);
    return per;
}