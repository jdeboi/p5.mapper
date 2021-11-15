
class Beauty extends Plant {

    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor);
        this.hasLeaves = true;
        this.leafSpacing = 20;

    }

    getParams() {
        const params = {
            name: "beauty",
            flowers: {
                scales: []
            },
            leaves: {
                scales: [.78, .78, .95],
                flipped: [false, true, false],
                rot: [-30, 0, -40],
                snaps: [createVector(108, 82), createVector(3, 47), createVector(76, 109)]
            }
        }
        return params;
    }

    display(s) {
        //s.stroke(col);
        s.push();
        s.translate(this.x, this.y, this.z);
        //s.rotateX(radians((-groundRot)));
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

        this.col = color(`#57ED66`);
    }

    leaf(segment, s) {
        let numleaves = floor(this.plantHeight * this.growthScaler / this.leafSpacing);
        if (segment <= numleaves) {
            let leafScale = map(segment, 0, 5, .6, .2) * this.plantHeight;
            leafScale = constrain(leafScale, 0.1, 1.0);
            s.push();
            s.translate(0, 0, -2);
            this.leaves[1].display(0, 0, 0, leafScale, false, s);
            this.leaves[1].display(0, 0, 0, leafScale, true, s);
            s.pop();
            if (this.isFlowering)
                this.berry(s, leafScale);
        }
    }

    berry(s, leafScale) {
        s.fill(235, 0, 255);
        s.stroke(255);
        let a = constrain(this.age, 0, 1.1);
        let berryAge = map(a, this.bloomAge, 1.0, 0, 1.0);
        let berrySize = leafScale * 20 * berryAge*this.growthFactor;
        let berrySpacings = [[0, 0], [-15, 13], [7, 12], [-9, -10], [4, -6]];

        s.push();
        s.translate(0, 0, 1);
        s.strokeWeight(map(berrySize, 0, 20, 0, 3));
        for (let j = 0; j < berrySpacings.length; j++) {
            s.push();
            s.translate(0, 0, j*1);
            s.ellipse(berrySpacings[j][0] * leafScale*this.growthFactor, berrySpacings[j][1] * leafScale*this.growthFactor, berrySize, berrySize);
            s.pop();
        }
        s.pop();
    }

    // @Override
    flower(s, stemAge) {
        // nada
    }
}