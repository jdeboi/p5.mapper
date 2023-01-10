
class Draggable {
    
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
        this.clickX = 0;
        this.clickY = 0;
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
    }

    startDrag() {
        this.xStartDrag = this.x;
        this.yStartDrag = this.y;
        this.clickX = mouseX;
        this.clickY = mouseY;
    }

    moveTo() {
        this.x = this.xStartDrag + mouseX - this.clickX;
        this.y = this.yStartDrag + mouseY - this.clickY;
    }

}

export default Draggable;