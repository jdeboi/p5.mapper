class MovePoint {

    constructor(parent, x, y, r = 20) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isControlPoint = false;
        this.parent = parent;

        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = 0;
        this.clickY = 0;

        this.col = color(0, 255, 255);
    }

 

    isMouseOver() {
        let mx = mouseX - width / 2;
        let my = mouseY - height / 2;
        let d = dist(mx, my, this.x + this.parent.x, this.y + this.parent.y);
        return (d < this.r);
    }

    set(point) {
        this.x = point.x;
        this.y = point.y;
    }

    startDrag() {
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = mouseX;
        this.clickY = mouseY;
    }

    moveToMouse() {
        this.x = mouseX - width / 2;
        this.y = mouseY - height / 2;
    }

    moveTo() {
        if (this.parent.type === "LINE") {
            this.moveToMouse();
        }
        else {
            this.x = this.xStartDrag + mouseX - this.clickX;
            this.y = this.yStartDrag + mouseY - this.clickY;
        }
    }

    setControlPoint(cp) {
        this.isControlPoint = cp;
    }

    interpolateBetween(start, end, f) {
        this.x = start.x + (end.x - start.x) * f;
        this.y = start.y + (end.y - start.y) * f;
    }

    display(col = this.col) {
        let c = col;
        if (this.isMouseOver() && isDragging(this)) {
            c = color(255);
        }
        c = color(255);
        push();
        translate(0, 0, 5);
        stroke(c);
        strokeWeight(2);
        noFill();

        ellipse(this.x, this.y, this.r);
        fill(c);
        ellipse(this.x, this.y, this.r / 2);
        pop();
    }


}

export default MovePoint;