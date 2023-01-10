import Surface from "./Surface";
import MovePoint from "./MovePoint";

// TODO 
// inside method could be reused in bezier
import { inside, isWEBGL } from '../helpers/helpers';

class PolyMap extends Surface {

    constructor(id, numPoints, buffer) {
        super(id, 0, 0, 0, "POLY", buffer);

        this.points = [];

        for (let i = 0; i < numPoints; i++) {
            let r = 200;
            let x = r * cos(i / numPoints * 2 * PI);
            let y = r * sin(i / numPoints * 2 * PI);
            if (!isWEBGL()) {
                x += width / 2;
                y += height / 2;
            }
            let cp = new MovePoint(this, x, y);
            cp.isControlPoint = true;
            this.points.push(cp);
        }

        // TODO

        const {w, h} = this.getBounds(this.points);
        this.width = w; 
        this.height = h;
    }

    

    setPoints(pts) {
        this.points = [];
        for (const p of pts) {
            let cp = new MovePoint(this, p.x, p.y);
            cp.isControlPoint = true;
            this.points.push(cp);
        }
    }


    displaySelected() {
        this.display("pink");
    }

    display(col = color(0)) {
        push();
        translate(this.x, this.y, 1);

        if (isCalibratingMapper()) {
            stroke(this.controlPointColor);
            fill(this.getMutedControlColor());
        }
        else {
            fill(col);
            noStroke();
        }
        beginShape();
        for (const point of this.points) {
            vertex(point.x, point.y);
        }
        endShape(CLOSE);
        pop();
    }

    displayControlPoints() {
        push();
        translate(this.x, this.y, 2);
        for (const p of this.points) {
            p.display(this.controlPointColor);
        }
        pop();
    }

    isMouseOver() {
        let p = { x: mouseX, y: mouseY };
        if (isWEBGL()) {
            p.x -= width / 2;
            p.y -= height / 2
        };
        let ins = inside(p, this.points, { x: this.x, y: this.y });
        return ins;
    }


    load(json) {
        const { x, y, points } = json;
        this.x = x;
        this.y = y;

        for (const point of points) {
            let mp = this.points[point.i];
            mp.x = point.x;
            mp.y = point.y;
        }
    }

    getJson() {
        let sJson = {};
        sJson.id = this.id;
        sJson.x = this.x;
        sJson.y = this.y;
        sJson.type = this.type;
        sJson.points = [];

        for (let i = 0; i < this.points.length; i++) {
            let point = {};
            point.i = i;
            point.x = this.points[i].x;
            point.y = this.points[i].y;
            sJson.points.push(point);
        }
        return sJson;
    }

    selectSurface() {
        // then, see if the poly itself is selected
        if (this.isMouseOver()) {
            this.startDrag();
            return this;
        }
        return null;
    }

    selectPoints() {
        // check control points
        for (const p of this.points) {
            if (p.isMouseOver()) {
                p.startDrag();
                return p;
            }
        }
        return null;
    }
}

export default PolyMap;