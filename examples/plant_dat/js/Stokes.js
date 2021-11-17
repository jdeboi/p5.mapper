

class Stokes extends Plant {



    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor);
        // this.growthScaler = 500;
        // this.branching = true;

        // have to draw branches in a particular order for transparency...
        // don't feel like figuring this out
        this.branching = false;
        this.isFlowering = true;
        this.hasLeaves = true;

        this.numBranches = floor(random(0, 3));
        this.branchDeg = random(8, 15);
        if (Math.random() > -0.5)
            this.branchDeg *= -1;
        this.col = color('#4EBD00');

    }


    getParams() {
        const params = {
            name: "stokes",
            flowers: {
                scales: [.5, .7, .6, .6],
                flipped: [false, false, false, false],
                rot: [0, 0, 0, 0],
                snaps: [createVector(27, 35), createVector(56, 81), createVector(75, 85), createVector(95, 105)],
            },
            leaves: {
                scales: [.6],
                flipped: [false],
                snaps: [createVector(4, 131)],
                rot: [0]
            }
        }
        return params;
    }

    display(s) {
        //s.stroke(col);
        s.push();
        s.translate(this.x, this.y, this.z);
        let angle = this.stemAngle + windAngle / 3.0;
        angle = constrain(angle, -10, 10);
        // s.rotate(angle);

        this.numBranch = 0;
        this.totLen = this.leafSpacing;
        this.currentLen = this.leafSpacing;

        s.stroke(0);
        s.fill(this.col);
        this.stem(s, this.plantHeight * this.growthScaler, 0, this.age, this.stemStroke);

        s.pop();
    }

    flower(s, stemAge) {
        s.push();
        s.translate(0, 0, 3);
        this.isFlowering = true;
        //s.translate(0, 0, 5);
        // if (this.isFlowering)
        //    this.displayFlower(stemAge, s)
        this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
        s.pop();
    }

    // displayFlower(stemAge, s) {
    //     this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
    // }


    leaf(segment, s) {
        if (this.numBranch < 9) {
            //super.leaf(segment, s);
            s.push();
            s.translate(0, 0, -3);
            let leafScale = map(segment, 0, 5, .7, 0.1);
            if (this.numBranch == 1) {
                this.leaves[0].display(0, 0, 0, this.plantHeight * leafScale, false, s);
            } else if (this.numBranch % 5 == 3) {
                //float scal = map(numBranch, 0, 15, 1.0, .25)*plantHeight;
                this.leaves[0].display(0, 0, 0, this.plantHeight * leafScale, true, s);
            } else if (this.numBranch % 5 == 4) {
                //float scal = map(numBranch, 0, 15, 1.0, .2)*plantHeight;
                this.leaves[0].display(0, 0, 0, this.plantHeight * leafScale, false, s);
            }
            s.pop();
        }

    }

    getFlowerIndex(stemAge) {
        let num = floor(map(stemAge, this.bloomAge, 1, 0, 4));
        num = constrain(num, 0, 3);
        return num;
    }


    // @Override
    branchOut(s, stemAge) {
        s.push();
        s.translate(0, 0, 4 - this.numBranch);
        if (this.numBranches > 0) {
            if (this.numBranch == 2) {
                this.stem(s, this.plantHeight * this.growthScaler / 2, radians(this.branchDeg), stemAge * .8, this.stemStroke);
            }
        }
        if (this.numBranches > 1) {
            if (this.numBranch == 3) {
                this.stem(s, this.plantHeight * this.growthScaler / 4, radians(-this.branchDeg), stemAge * .5, this.stemStroke);
            }
        }
        s.pop();
    }

}