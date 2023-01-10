// Credit:
// https://geeksoutofthebox.com/2020/11/23/simons-bezier-editor-in-p5-js/

class ControlPoint {

    constructor(x, y, parentPath) {
        // this.id = parentPath.points.length;
        this.pos = createVector(x, y);
        this.parentPath = parentPath;
        this.type = "CPOINT";
    }

    add(x, y) {
        this.pos.add(x, y);
    }

    set(x, y) {
        this.pos.set(x, y);
    }

    select() {
        let px = this.pos.x + this.parentPath.x;
        let py = this.pos.y + this.parentPath.y;
        let mx = mouseX - width / 2;
        let my = mouseY - height / 2;
        if (dist(px, py, mx, my) < 5) {
            return true;
        }
        return false;
    }

    moveTo() {
        const x = mouseX - width / 2 - this.parentPath.x;
        const y = mouseY - height / 2 - this.parentPath.y;
        
        const closed = true;
        const path = this.parentPath;
        const i = path.points.indexOf(this);
        
        if (i % 3 == 0) {
            const dx = x - (this.pos.x);
            const dy = y - (this.pos.y);
            this.pos.set(x, y);
            if (i - 1 >= 0 || closed) {
                path.points[path.loopIndex(i - 1)].add(dx, dy);
            }
            if (i + 1 < path.points.length || closed) {
                path.points[path.loopIndex(i + 1)].add(dx, dy);
            }
            if (path.mode == "AUTOMATIC") path.autoSetAllControlPoints();
        } else if (path.mode != "AUTOMATIC") {
            this.pos.set(x, y);
            const anchorI = (i % 3 == 1) ? i - 1 : i + 1;
            const otherI = (i % 3 == 1) ? i - 2 : i + 2;
            if (otherI >= 0 && otherI < path.points.length || closed) {
                const anchor = path.points[path.loopIndex(anchorI)].pos;
                const other = path.points[path.loopIndex(otherI)].pos;
                if (path.mode == "ALIGNED") {
                    const dist = p5.Vector.dist(anchor, other);
                    const disp = p5.Vector.sub(anchor, this.pos);
                    disp.setMag(dist);
                    other.set(p5.Vector.add(anchor, disp));
                } else if (path.mode == "MIRRORED") {
                    other.set(p5.Vector.lerp(anchor, this.pos, -1))
                }
            }
        }
        path.setDimensions();
    }

    displayControlCircle(strokeC) {
        const i = this.parentPath.points.indexOf(this);
        stroke(strokeC);
        strokeWeight(1);
        if (i % 3 == 0) {
            fill(255, 0, 0);
            circle(this.pos.x, this.pos.y, 10);
        } else if (!this.parentPath.auto) {
            fill(255);
            circle(this.pos.x, this.pos.y, 8);
        }
    }
}

export default ControlPoint;