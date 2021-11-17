


class Rose extends Obedient {

    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor*.85);
        // this.growthScaler = 400;
    }

    getParams() {
        return {
            name: "rosemallow",
            flowers: {
                scales: [0.15, 0.15, 0.2],
                flipped: [false, false, false],
                rot: [0, 0, 0],
                snaps: [createVector(150, 400), createVector(257, 630), createVector(255, 450)],
            },
            leaves: {
                scales: [.2],
                flipped: [false],
                rot: [radians(0)],
                snaps: [createVector(250, 60)]
            }
        }
    }

    flower(s, stemAge) {
        this.isFlowering = true;
        s.push();
        s.translate(0, 0, 2);
        if (this.isFlowering)
            this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
        s.pop();
    }


    leaf(segment, s) {
        let scal = map(this.numBranch, 0, 15, 1.0, .3) * this.plantHeight;
        let leafScale = map(segment, 0, this.numSegments, 1.0, 0.4);
        if (segment !== 4) {
            s.push();
            s.translate(0, 0, 2);
            if (segment > 0) {
                s.push();
                s.translate(-3, 0);
                this.leaves[0].display(0, 0, 0, scal * leafScale, false, s);
                s.pop();
            }
            if (segment < 4) {
                s.push();
                s.translate(0, -this.plantHeight * 20);
                this.leaves[0].display(0, 0, 0, scal * leafScale, true, s);
                s.pop();
            }
            s.pop();
        }

    }

    // @Override 
    getStemStroke() {
        return color(0, 50, 0);
    }

    // @Override
    getStemFill(numBranch) {
        return lerpColor(color(0, 80, 0), color(0, 150, 0), map(numBranch, 0, 10, 0, 1));
    }
}