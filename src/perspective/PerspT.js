import numeric from './numeric';

function round(num){
    return Math.round(num*10000000000)/10000000000;
}

function getNormalizationCoefficients(srcPts, dstPts, isInverse){
    if(isInverse){
        var tmp = dstPts;
        dstPts = srcPts;
        srcPts = tmp;
    }
    var r1 = [srcPts[0], srcPts[1], 1, 0, 0, 0, -1*dstPts[0]*srcPts[0], -1*dstPts[0]*srcPts[1]];
    var r2 = [0, 0, 0, srcPts[0], srcPts[1], 1, -1*dstPts[1]*srcPts[0], -1*dstPts[1]*srcPts[1]];
    var r3 = [srcPts[2], srcPts[3], 1, 0, 0, 0, -1*dstPts[2]*srcPts[2], -1*dstPts[2]*srcPts[3]];
    var r4 = [0, 0, 0, srcPts[2], srcPts[3], 1, -1*dstPts[3]*srcPts[2], -1*dstPts[3]*srcPts[3]];
    var r5 = [srcPts[4], srcPts[5], 1, 0, 0, 0, -1*dstPts[4]*srcPts[4], -1*dstPts[4]*srcPts[5]];
    var r6 = [0, 0, 0, srcPts[4], srcPts[5], 1, -1*dstPts[5]*srcPts[4], -1*dstPts[5]*srcPts[5]];
    var r7 = [srcPts[6], srcPts[7], 1, 0, 0, 0, -1*dstPts[6]*srcPts[6], -1*dstPts[6]*srcPts[7]];
    var r8 = [0, 0, 0, srcPts[6], srcPts[7], 1, -1*dstPts[7]*srcPts[6], -1*dstPts[7]*srcPts[7]];

    var matA = [r1, r2, r3, r4, r5, r6, r7, r8];
    var matB = dstPts;
    var matC;

    try{
        matC = numeric.inv(numeric.dotMMsmall(numeric.transpose(matA), matA));
    }catch(e){
        console.log(e);
        return [1,0,0,0,1,0,0,0];
    }

    var matD = numeric.dotMMsmall(matC, numeric.transpose(matA));
    var matX = numeric.dotMV(matD, matB);
    for(var i = 0; i < matX.length; i++) {
        matX[i] = round(matX[i]);
    }
    matX[8] = 1;

    return matX;
}

function PerspT(srcPts, dstPts){
    if( (typeof window !== 'undefined' && window === this) || this === undefined) {
        return new PerspT(srcPts, dstPts);
    }

    this.srcPts = srcPts;
    this.dstPts = dstPts;
    this.coeffs = getNormalizationCoefficients(this.srcPts, this.dstPts, false);
    this.coeffsInv = getNormalizationCoefficients(this.srcPts, this.dstPts, true);

    return this;
}

PerspT.prototype = {
    transform: function(x,y) {
        var coordinates = [];
        coordinates[0] = (this.coeffs[0]*x + this.coeffs[1]*y + this.coeffs[2]) / (this.coeffs[6]*x + this.coeffs[7]*y + 1);
        coordinates[1] = (this.coeffs[3]*x + this.coeffs[4]*y + this.coeffs[5]) / (this.coeffs[6]*x + this.coeffs[7]*y + 1);
        return coordinates;
    },

    transformInverse: function(x,y) {
        var coordinates = [];
        coordinates[0] = (this.coeffsInv[0]*x + this.coeffsInv[1]*y + this.coeffsInv[2]) / (this.coeffsInv[6]*x + this.coeffsInv[7]*y + 1);
        coordinates[1] = (this.coeffsInv[3]*x + this.coeffsInv[4]*y + this.coeffsInv[5]) / (this.coeffsInv[6]*x + this.coeffsInv[7]*y + 1);
        return coordinates;
    }
};

export default PerspT;