


class Sleeping extends Stokes {


    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor);
        this.col = color('#4EBD00');
    }



    getParams() {

        const params = {
            name: "sleeping",
            flowers: {
                scales: [.1, .05],
                rot: [0, 0],
                flipped: [false, false],
                snaps: [createVector(100, 150), createVector(400, 1450)]
            },
            leaves: {
                scales: [.8, .4],
                rot: [radians(-140), radians(-140)],
                flipped: [true, true],
                snaps: [createVector(80, -20), createVector(220, 20)]
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
        s.rotate(angle);

        this.numBranch = 0;
        this.totLen = this.leafSpacing;
        this.currentLen = this.leafSpacing;

        s.stroke(0);
        s.fill(this.col);
        this.stem(s, this.plantHeight * this.growthScaler, 0, this.age, this.stemStroke);

        s.pop();
    }

    // @Override
    displayFlower(stemAge, s) {
        this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
    }

    leaf(segment, s) {
        //super.leaf(segment, s);
        s.push();
        s.translate(0, 0, (5 - segment));
        let leafScale = map(segment, 0, 5, .7, 0.1);
        let r = radians(0); //-90
        let factor = this.plantHeight * leafScale;
        let w = 35 * factor;
        let h = 5 * factor;
        let rW = w*this.growthFactor;
        let rH = h*this.growthFactor*2;
        s.noStroke();
        if (this.numBranch == 1) {

            s.push();
            s.rotate(radians(-45));
            
            s.rect(0, -rH / 2, rW, rH);
            s.pop();
            this.leaves[this.pID % 2].display(0, 0, r, factor, true, s);
        }
        if (this.numBranch == 2) {
            s.push();
            s.rotate(radians(-135));

            s.rect(0, -rH / 2, rW, rH);
            s.pop();
            this.leaves[(this.pID + 1) % 2].display(0, 0, r, this.plantHeight * leafScale, false, s);
        }
        if (this.numBranch % 5 == 3) {
            this.leaves[(this.pID) % 2].display(0, 0, r, this.plantHeight * leafScale, true, s);
            s.push();
            s.rotate(radians(-45));
            s.rect(0, -rH / 2, rW, rH);
            s.pop();
        }
        if (this.numBranch % 5 == 4) {
            s.push();
            s.rotate(radians(-135));
            s.rect(0, -rH / 2, rW, rH);
            s.pop();
            this.leaves[(this.pID + 1) % 2].display(0, 0, r, this.plantHeight * leafScale, false, s);
        }
        s.pop();
    }

    // @Override
    getFlowerIndex(stemAge) {
        let num = int(map(stemAge, this.bloomAge, 1, 0, 2));
        num = constrain(num, 0, 1);
        return num;
    }
}