
class Obedient extends Plant {

    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor);
        // this.growthScaler = 300;
        this.y += 50;
        this.branching = false;
        this.hasLeaves = true;
    }

    getParams() {
        const params = {
            name: "obedient",
            flowers: {
                scales: [.4, .3],
                flipped: [false, false],
                rot: [0, 0],
                snaps: [createVector(25, 142), createVector(60, 300)]
            },
            leaves: {
                scales: [.3],
                flipped: [false],
                rot: [0],
                snaps: [createVector(250, 60)]
            }

        }
        return params;
    }


    display(s) {
        //s.stroke(col);
        s.push();
        s.translate(this.x, this.y, this.z);
        //s.rotateX(radians(25));
        let angle = this.stemAngle + windAngle / 3.0;
        angle = constrain(angle, -10, 10);
        s.rotate(angle);

        this.numBranch = 0;
        this.totLen = this.leafSpacing;
        this.currentLen = this.leafSpacing;

        this.stem(s, this.plantHeight * this.growthScaler, 0, this.age);

        s.pop();
    }

    flower(s, stemAge) {
        this.isFlowering = true;
        if (this.isFlowering)
            this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
    }

    leaf(segment, s) {
        let scal = map(this.numBranch, 0, 15, 1.0, .3) * this.plantHeight;
        let leafScale = map(segment, 0, this.numSegments, 1.0, 0.4);
        if (segment !== 4) {
            s.push();
            s.translate(0, 0, -2);
            if (segment > 0) {
                this.leaves[0].display(0, 0, 0, scal * leafScale, false, s);
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



    stem(s, plantH, ang, stemAge) {
        s.push();
        s.strokeWeight(1);
        //while (len > 2) {
        let len = this.growthFactor* 1.0 * plantH / this.numSegments;
        for (let i = 0; i < this.numSegments; i++) {
            this.numBranch++;

            //s.push();  
            s.translate(0, -len);
            //len *= 0.66;
            let angle = this.curveAngle + windAngle + ang;
            angle = constrain(angle, -PI / 7, PI / 7);
            // s.rotate(angle);   
            let sw = map(i, 0, this.numSegments, 10, 1) * this.plantHeight*this.growthFactor;
            sw = constrain(sw, 1, 10*this.growthFactor);
            //s.noStroke();
            s.stroke(this.getStemStroke());
            s.fill(this.getStemFill(this.numBranch));
            s.rect(-sw/2, 0, sw, -len);
            // s.beginShape(QUADS);
            
            // //s.stroke(0);
            // s.vertex(-sw / 2, 0);
            // s.vertex(sw / 2, 0);
            // s.vertex(sw / 2, -len);
            // s.vertex(-sw / 2, -len);
            // s.endShape(CLOSE);

            if (this.branching) {
                this.branchOut(s, stemAge);
            }
            if (this.hasLeaves) {
                s.push();
                s.translate(0, -len);
                this.leaf(i, s);
                s.pop();
            }
        }
        if (this.isFlowering) {
            s.translate(0, -len);
            this.flower(s, stemAge);
        }
        s.pop();
    }

    getStemStroke() {
        return 0;
    }

    getStemFill(numBranch) {
        return color(constrain(numBranch * 40, 0, 255), 255, 0);
    }
}