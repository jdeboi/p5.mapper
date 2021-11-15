
class Clasping extends Plant {


    constructor(surfaceH, growthFactor) {
        super(surfaceH, growthFactor);
        // this.growthScaler = 300;
        this.branching = false;
        this.hasLeaves = true;
    }

    getParams() {

        const params = {
            name: "clasping",
            flowers: {
                scales: [0.4, 0.4, 0.6],
                rot: [0, 0, 0],
                flipped: [false, false, false],
                snaps: [
                    createVector(75, 100),
                    createVector(100, 100),
                    createVector(100, 120)
                ],
            },
            leaves: {
                scales: [.6],
                flipped: [false],
                rot: [radians(190)],
                snaps: [createVector(90, 140)],
            }
        }
        return params;
    }


    display(s) {
        s.stroke(this.col);
        s.fill(this.col);
        s.push();
        s.translate(this.x, this.y, this.z);
        // s.translate(0, 0, 0);
        //s.rotateX(radians(25));
        let angle = this.stemAngle + windAngle / 3.0;
        angle = constrain(angle, -10, 10);
        s.rotate(angle);

        this.numBranch = 0;
        this.totLen = this.leafSpacing;
        this.currentLen = this.leafSpacing;

        this.stem(s, this.plantHeight * this.growthScaler, 0, this.age);

        s.pop();
        // s.fill(255, 0, 0);
        // s.ellipse(0, 0, 200);
        // this.stem(s, 100, 0, 1);

        // this.flowers[this.getStokesFlowerIndex(.1)].display(0, 0, 0, this.plantHeight, false, s);
    }

    flower(s, stemAge) {
        // if (stemAge > this.bloomAge)
        //     this.isFlowering = true;
        // else
        //     this.isFlowering = false;
        this.isFlowering = true;
        // if (this.isFlowering)
        this.flowers[this.getFlowerIndex(stemAge)].display(0, 0, 0, this.plantHeight, false, s);
    }

    leaf(segment, s) {
        //s.push();
        //s.translate(0, 0, 1);
        if (segment < 3 && segment > 0) {
            let scal = map(this.numBranch, 0, 15, 1.0, .3) * this.plantHeight;
            let leafScale = map(segment, 0, this.numSegments, 1.0, 0.4);
            this.leaves[0].display(0, 0, 0, scal * leafScale, false, s);
            this.leaves[0].display(0, 0, 0, scal * leafScale, true, s);
            //s.pop();
        }
        //s.pop();
    }

  

    //   int getStokesFlowerIndex() {
    //     int num = int(map(age, bloomAge, 1, 0, claspingFlowers.length));
    //         num = constrain(num, 0, claspingFlowers.length - 1);
    //         return num;
    //     }


    stem(s, plantH, ang, stemAge) {

        s.push();
        //while (len > 2) {

        let len = this.growthFactor* 1.0 * plantH / this.numSegments;
        s.translate(0, len);
        for (let i = 0; i < this.numSegments; i++) {
            this.numBranch++;

            //s.push();  
            s.translate(0, -len);
            //len *= 0.66;
            let angle = (this.curveAngle + windAngle + ang)/4;
            angle = constrain(angle, -PI / 7, PI / 7);
            // s.rotate(angle);
            let sw = map(i, 0, this.numSegments, 10, 1) * this.plantHeight*this.growthFactor;
            sw = constrain(sw, 2, 10*this.growthFactor);
            //s.noStroke();
            s.stroke(0);
            s.strokeWeight(1);
            //constrain(this.numBranch * 40, 0, 255), 255, 0
            s.fill(constrain(this.numBranch * 40, 0, 255), 255, 0);
            s.rect(-sw/2, 0, sw, -len);
            // s.beginShape(QUADS);
            
            // //s.stroke(0);
            // s.vertex(-sw / 2, 0);
            // s.vertex(sw / 2, 0);
            // s.vertex(sw / 2, -len);
            // s.vertex(-sw / 2, -len);
            // s.endShape();


            if (this.hasLeaves) {
                s.push();
                s.translate(0, -len, -0.1);
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
}