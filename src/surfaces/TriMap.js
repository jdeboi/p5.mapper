import CornerPinSurface from './CornerPinSurface';

class TriMap extends CornerPinSurface {


	constructor(id, w, h, res, pInst) {
		super(id, w, h, res, "TRI", pInst);

		this.setTriMesh();
	}


	/**
	 * Returns true if the mouse is over this surface, false otherwise.
	 */
	isMouseOver() {
		let mx = mouseX - width / 2;
		let my = mouseY - height / 2;
		if (this.isPointInTriangle(mx - this.x, my - this.y, this.mesh[this.TP],
			this.mesh[this.BL], this.mesh[this.BR]))
			return true;
		return false;
	}

	// Compute barycentric coordinates (u, v, w) for
	// point p with respect to triangle (a, b, c)
	Barycentric(p, a, b, c, u, v, w) {
		let v0 = b.sub(a), v1 = c.sub(a), v2 = p.sub(a);
		let d00 = v0.dot(v0);
		let d01 = v0.dot(v1);
		let d11 = v1.dot(v1);
		let d20 = v2.dot(v0);
		let d21 = v2.dot(v1);
		let denom = d00 * d11 - d01 * d01;
		v = (d11 * d20 - d01 * d21) / denom;
		w = (d00 * d21 - d01 * d20) / denom;
		u = 1.0 - v - w;
	}

	setTriMesh() {
		this.TP = Math.floor(this.res / 2) - 1;
		this.mesh[this.TP].setControlPoint(true);
		this.mesh[this.TL].setControlPoint(false);
		this.mesh[this.TR].setControlPoint(false);

		this.controlPoints = [];
		this.controlPoints.push(this.mesh[this.TP], this.mesh[this.BL], this.mesh[this.BR]);
	}


	render() {
		push();
		translate(this.x, this.y);

		noStroke();
		fill(0);
		texture(this);
		beginShape();
		let u = 0;
		let v = this.height;
		vertex(this.mesh[this.BL].x, this.mesh[this.BL].y, u, v);

		u = this.width / 2;
		v = 0;
		vertex(this.mesh[this.TP].x, this.mesh[this.TP].y, u, v);

		u = this.width;
		v = this.height;
		vertex(this.mesh[this.BR].x, this.mesh[this.BR].y, u, v);
		endShape(CLOSE);

		if (isCalibratingMapper()) {
			// translate(0, 0, 1);
			this.displayOutline();
		}

		pop();
	}


}

export default TriMap;