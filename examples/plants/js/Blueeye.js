

class Blueeye extends Plant {

  constructor(surfaceH, growthFactor) {
    super(surfaceH, growthFactor*.85);
    // this.growthScaler = 200 * .55;
    this.branching = false;
    this.hasLeaves = true;

  }


  getParams() {
    const params = {
      name: "blueeye",
      flowers: {
        scales: [.18, .2, .22, .22, .26],
        flipped: [false, false, false, false, false],
        rot: [0, 0, 0, 0, 0],
        snaps: [createVector(120, 180), createVector(180, 200), createVector(310, 180), createVector(150, 380), createVector(300, 250)]
      },
      leaves: {
        scales: []
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
    // s.rotate(angle);

    this.numBranch = 0;
    this.totLen = this.leafSpacing;
    this.currentLen = this.leafSpacing;

    // flowering
    this.stem(s, this.plantHeight * this.growthScaler, 0, this.age, false, this.pID % 2 == 0);
    // possibly flowering
    let neg = this.pID % 3 == 0 ? 1 : -1;
    let isLeaf = (this.pID + 1) % 4 != 0;
    this.stem(s, this.plantHeight * this.growthScaler * .7, radians(10 * neg), this.age, isLeaf, neg == 1 ? true : false);


    // pure leaves
    neg = this.pID % 2 == 0 ? 1 : -1;
    this.stem(s, this.plantHeight * this.growthScaler * .9, radians(-8), this.age, this.pID % 4 != 0, true);
    this.stem(s, this.plantHeight * this.growthScaler * .85, radians(-4), this.age, true, false);
    this.stem(s, this.plantHeight * this.growthScaler * .3, radians(-24 * this.neg), this.age, true, true);
    this.stem(s, this.plantHeight * this.growthScaler * .4, radians(23 * neg), this.age, true, false);

    s.pop();
  }

  flower(s, stemAge, isLeft) {
    this.isFlowering = true;
    let num = this.getFlowerIndex(stemAge);
    if (this.isFlowering) {
      if (num > 2) this.flowers[2].display(0, 0, 0, this.plantHeight, isLeft, s);
      let r = 0;
      if (num == 3)
        r = radians(-65);
      this.flowers[num].display(0, 0, r, this.plantHeight, isLeft, s); //pID%2 ==0
    }
  }

  leaf(segment, s) {
  }




  stem(s, plantH, ang, stemAge, isLeaf, isLeft) {
    s.push();
    //while (len > 2) {

    let len = this.growthFactor* 1.3 * plantH / this.numSegments;
    s.translate(0, len);
    for (let i = 0; i < this.numSegments; i++) {

      //s.push();  
      s.translate(0, -len);
      //len *= 0.66;
      let angle = this.curveAngle + windAngle + ang;
      angle = constrain(angle, -PI / 7, PI / 7);
      s.rotate(angle);
      let sw = map(i, 0, this.numSegments, 10, 1) * this.plantHeight*this.growthFactor;
      sw = constrain(sw, 1, 10*this.growthFactor);
      let c = lerpColor(color(0, 120, 0), color(0, 80, 0), map(i, 0, this.numSegments, 0, 1));
      s.stroke(0, 80, 0);
      s.strokeWeight(1);
      // s.beginShape(QUADS);
      s.fill(c);
      s.rect(-sw / 2, 0, sw, -len);
      //s.stroke(0);
      // s.vertex(-sw / 2, 0);
      // s.vertex(sw / 2, 0);
      // s.vertex(sw / 2, -len);
      // s.vertex(-sw / 2, -len);
      // s.endShape(CLOSE);
    }
    if (this.isFlowering && !isLeaf) {
      s.translate(0, -len);
      s.push();
      s.translate(0, 0, 3);
      this.flower(s, stemAge, !isLeft);
      s.pop();
    }
    s.pop();
  }
}