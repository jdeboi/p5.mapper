
let plantID = 0;
class Plant {


    constructor(surfaceH, growthFactor) {

        this.dies = true;



        this.x = 0;
        this.y = surfaceH / 2 - 30;
        this.z = 0;
        this.id, this.pID;

        // age
        this.age = 0;
        this.ageDeath = random(1.2, 2.2);
        this.ageGrowthStops = 0.8;
        this.bloomAge = 0.5;
        this.dies = true;
        this.alive = true;
        this.respawns = true;


        this.numBranch = 0;

        this.hasLeaves = false;
        this.leafSpacing = 30;
        this.isFlowering = false;
        this.branching = false;

        this.col = color(0, random(150, 255), 0);


        // randomish noise
        this.yoff = 0;
        this.seed = floor(random(0, 100));

        this.curveAngle = radians(random(-10, 10));
        this.stemAngle = radians(random(-5, 5));
        this.id = plantID;
        this.pID = plantID++;


        this.lifeTimeSeconds = 1 * 10;
        this.lifeTimeFrames = this.lifeTimeSeconds * 60; // 60 frames / second 
        this.ageInc = 1.0 / this.lifeTimeFrames;
        this.plantColor = color('#11BB7C');
        this.stemStroke = color(0, 50, 0);

        // growth and height
        this.plantHeight = 0;
        this.growthFactor = growthFactor;
        this.growthScaler = map(this.growthFactor, 1, 3, 200, 300);
        
        this.numSegments = 5;
        this.totLen = 0;
        this.currentLen = 0;
        this.growthRate = random(this.ageInc - this.ageInc * .2, this.ageInc + this.ageInc * .2);


        this.flowers = [];
        this.leaves = [];

        this.initPlantFiles();
    }

    getParams() {
        const params = {
            name: "clasping",
            flowers: {
                scales: [],
                rot: [],
                flipped: [],
                snaps: [],
            },
            leaves: {
                scales: [],
                flipped: [],
                rot: [],
                snaps: [],
            }
        }
        return params;
    }

    initPlantFiles() {
        let params = this.getParams();
        for (let i = 0; i < params.flowers.scales.length; i++) {
            let path = params.name + "/flower/" + i + ".svg";
            let flower = params.flowers;
            this.flowers.push(new PlantFile(path, flower.flipped[i], flower.snaps[i].x, flower.snaps[i].y, flower.scales[i], flower.rot[i], this.growthFactor))
        }

        for (let i = 0; i < params.leaves.scales.length; i++) {
            let path = params.name + "/leaves/" + i + ".svg";
            let leaf = params.leaves;
            this.leaves.push(new PlantFile(path, leaf.flipped[i], leaf.snaps[i].x, leaf.snaps[i].y, leaf.scales[i], leaf.rot[i], this.growthFactor));
        }
    }

    display(s) {
        //s.stroke(this.col);
        s.push();
        s.translate(this.x, this.y, this.z);
        let angle = this.stemAngle + windAngle / 3.0;
        angle = constrain(angle, -10, 10);
        s.rotate(angle);

        this.numBranch = 0;
        this.totLen = this.leafSpacing;
        this.currentLen = this.leafSpacing;

        this.branch(s, this.plantHeight * 100);

        s.pop();
    }

    getOlder() {
        if (this.age < this.ageDeath) {
            this.age += this.ageInc;
        } else {
            if (this.respawns)
                this.respawn();
            else if (this.dies)
                this.alive = false;
        }
    }

    grow() {
        this.getOlder();
        if (this.age > this.bloomAge) {
            this.isFlowering = true;
        }
        if (this.age < this.ageGrowthStops) {
            this.plantHeight += this.growthRate;
        }
    }

    respawn() {
        this.age = 0;
        this.plantHeight = 0;
        this.isFlowering = false;
    }


    branch(s, len) {
        s.fill(this.plantColor);
        s.stroke(this.stemStroke);
        // Each branch will be 2/3rds the size of the previous one
        let sw = map(len, 2, 120, 1, 10);
        // s.beginShape(QUADS);
        // //s.fill(constrain(numBranch*40, 0, 255), 255, 0);
        // s.vertex(0, 0);
        // s.vertex(sw, 0);
        // s.vertex(sw, -len);
        // s.vertex(0, -len);
        // s.endShape(CLOSE);
        s.rect(-sw / 2, 0, sw, -len);


        //Move to the end of that line
        s.translate(0, -len);

        len *= 0.66;
        // All recursive functions must have an exit condition!!!!
        // Here, ours is when the length of the branch is 2 pixels or less
        if (len > 2) {
            s.push();    // Save the current state of transformation (i.e. where are we now)
            let angle = this.curveAngle + windAngle;
            angle = constrain(angle, -PI / 7, PI / 7);
            s.rotate(angle);
            this.branch(s, len);       // Ok, now call myself to draw two new branches!!
            s.pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state
        }
    }

    stem(s, plantH, ang, stemAge, stCol = this.plantColor) {
        s.push();

        let len = this.growthFactor* 1.0 * plantH / this.numSegments;
        s.translate(0, len, 0);
        for (let i = 0; i < this.numSegments; i++) {
            this.numBranch++;

            //s.push();  
            s.translate(0, -len);
            //len *= 0.66;
            let angle = this.curveAngle + windAngle + ang;
            angle = constrain(angle, -PI / 7, PI / 7);
            s.rotate(angle / 2);
            let sw = map(i, 0, this.numSegments, 10, 1) * this.plantHeight*this.growthFactor;
            sw = constrain(sw, 1, 10*this.growthFactor);
            //s.noStroke();
            // s.stroke(this.plantColor);
            s.stroke(0);
            s.strokeWeight(1);
            let per = map(this.numBranch, 0, this.numSegments, 0, .5);
            per = constrain(per, 0, 1);
            s.fill(lerpColor(this.col, color(255, 255, 0), per));
            // s.fill(this.col);
            // s.beginShape();
            // //s.fill(constrain(numBranch*40, 0, 255), 255, 0);
            // //s.stroke(0);
            // s.vertex(-sw / 2, 0);
            // s.vertex(sw / 2, 0);
            // s.vertex(sw / 2, -len);
            // s.vertex(-sw / 2, -len);
            // s.endShape(CLOSE);
            s.rect(-sw / 2, 0, sw, -len);

            if (this.branching) {
                this.branchOut(s, stemAge);
            }
            if (this.hasLeaves) {
                s.push();
                // s.translate(0, -len, 0.2);
                s.translate(0, -len, 0);
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



    leaf(segment, s) {
        s.fill(0);
        s.text(segment, 0, 0);
    }

    flower(s, stemAge) {
        s.fill(255, 0, 0);
        s.ellipse(0, 0, 50 * stemAge, 50 * stemAge);
    }

    branchOut(s, stemAge) {
        //if (numBranch == 2) {
        //  stem(s, plantHeight*growthScaler/2, radians(15), stemAge*.8);
        //}
        //else if (numBranch == 3) {
        //  stem(s, plantHeight*growthScaler/4, radians(-15), stemAge*.5);
        //}
    }

    getFlowerIndex(stemAge) {
        let num = floor(map(stemAge, this.bloomAge, 1, 0, this.flowers.length));
        num = constrain(num, 0, this.flowers.length - 1);
        return num;
    }
}