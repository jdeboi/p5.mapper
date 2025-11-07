// Surface.ts
import Draggable, { DraggableJSON } from "./Draggable";
import { getRandomizedColor, P5 } from "../helpers/helpers";

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PointXY {
  x: number;
  y: number;
}

/**
 * Base surface: owns dimensions, a p5 buffer, and rendering hooks.
 * Subclasses should override `displaySurface`.
 */
export default class Surface extends Draggable {
  public id: string | number;
  public type: string;
  public res: number;

  public width: number;
  public height: number;

  public controlPointColor: any; // usually p5.Color
  public buffer: any; // p5.Graphics

  protected pInst: P5;
  private rafHandle: number | null = null;

  /**
   * @param id        Identifier for the surface
   * @param w         width in px
   * @param h         height in px
   * @param res       grid resolution per axis (>= 2)
   * @param type      e.g. "QUAD" | "TRI"
   * @param buffer    optional p5.Graphics to draw into
   * @param pInst     p5 instance
   */
  constructor(
    id: string | number,
    w: number,
    h: number,
    res: number,
    type: string,
    buffer: any | null,
    pInst: P5
  ) {
    super(pInst, 0, 0);
    this.pInst = pInst;

    if (!Number.isInteger(res) || res < 2) {
      throw new Error(`Surface: res must be an integer >= 2 (got ${res})`);
    }

    this.id = id;
    this.type = type;
    this.res = res;

    // constrain to canvas, but allow 0 (if canvas not sized yet)
    this.width = this.pInst.constrain(w, 0, Math.max(0, this.pInst.width));
    this.height = this.pInst.constrain(h, 0, Math.max(0, this.pInst.height));

    // randomized per id/type so all control points match
    this.controlPointColor = getRandomizedColor(
      this.id as number,
      this.type,
      this.pInst
    );

    // Offscreen buffer (2D). Create lazily if not provided.
    this.buffer = buffer ?? this.createBuffer(this.width, this.height);
  }

  /** internal: create a 2D buffer and clear it */
  private createBuffer(w: number, h: number): any {
    const g = this.pInst.createGraphics(
      Math.max(1, Math.floor(w)),
      Math.max(1, Math.floor(h))
    );
    g.clear();
    return g;
  }

  /** Muted version of a p5 color (alpha default 50) */
  public getMutedControlColor(
    col: any = this.controlPointColor,
    alpha = 50
  ): any {
    const p = this.pInst;
    return p.color(p.red(col), p.green(col), p.blue(col), alpha);
  }

  /** Clear buffer to a color and then draw the textured surface using that buffer */
  public display(col: any = this.pInst.color("black")): void {
    if (!this.buffer || this.buffer.width <= 0 || this.buffer.height <= 0)
      return;

    this.buffer.push();
    this.buffer.clear();
    this.buffer.background(col);
    this.buffer.pop();

    this.displayTexture(this.buffer);
  }

  /**
   * Override in subclasses to issue the actual geometry draw calls, e.g.:
   * - with texture:    isUV=true, arguments are [u0, v0, u1, v1]
   * - without texture: isUV=false, arguments are ignored
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected displaySurface(isUV = true, u0 = 0, v0 = 0, u1 = 1, v1 = 1): void {
    // Subclasses must implement drawing (triangles/quads) using current transform + UVs
    // Example: draw a textured quad with these UVs.
    // Left as a warning to catch accidental use without overriding.
    // (Use console.warn sparingly in prod.)
    console.warn("Surface.displaySurface() should be overridden by subclass.");
  }

  /**
   * Draw a sketch into this.surface's buffer, then render that buffer as texture.
   * @param sketch draws into provided p5.Graphics
   * @param tX     source crop x (pixels) OR u0 if texW <= 0
   * @param tY     source crop y (pixels) OR v0 if texH <= 0
   * @param texW   source crop width (pixels). If <=0, treat tX,tY as u0,v0.
   * @param texH   source crop height (pixels). If <=0, treat as full [u1,v1]=[1,1].
   */
  public displaySketch(
    sketch: (g: any) => void,
    tX = 0,
    tY = 0,
    texW = 0,
    texH = 0
  ): void {
    if (!this.buffer) this.buffer = this.createBuffer(this.width, this.height);
    const g = this.buffer;
    g.push();
    g.clear();
    sketch(g);
    g.pop();

    this.displayTexture(g, tX, tY, texW, texH);
  }

  /**
   * Render a texture onto the surface.
   * Two modes:
   *  1) Crop mode (texW>0 && texH>0): (tX,tY,texW,texH) in source pixels → mapped to UV [u0,v0,u1,v1]
   *  2) UV mode   (texW<=0 || texH<=0): (tX,tY) are u0,v0; u1=v1=1 by default
   */
  // Surface.ts
  displayTexture(tex: any, tX = 0, tY = 0, texW = 0, texH = 0) {
    if (!tex || tex.width <= 0 || tex.height <= 0) return;

    if (texW <= 0) texW = tex.width;
    if (texH <= 0) texH = tex.height;

    // convert pixel rect → normalized rect
    const u0 = tX / tex.width;
    const v0 = tY / tex.height;
    const u1 = (tX + texW) / tex.width;
    const v1 = (tY + texH) / tex.height;

    const p = this.pInst;
    p.push();
    p.noStroke();
    p.translate(this.x, this.y);

    // IMPORTANT: normalized UVs
    p.textureMode(p.NORMAL);
    p.texture(tex);

    // displaySurface expects (isUV, u0, v0, u1, v1)
    this.displaySurface(true, u0, v0, u1, v1);

    if (p.isCalibratingMapper()) this.displayCalibration();
    p.pop();
  }

  /** Outline + fill overlay used in calibration mode */
  public displayCalibration(): void {
    const p = this.pInst;
    p.push();
    this.displayOutline();
    p.pop();
  }

  /** Draws the outline (no texture). Subclass displaySurface(false) should render the shape edges. */
  public displayOutline(col: any = this.controlPointColor): void {
    const p = this.pInst;
    p.push();
    p.strokeWeight(3);
    p.stroke(col);
    p.fill(this.getMutedControlColor());
    p.translate(this.x, this.y);
    this.displaySurface(false);
    p.pop();
  }

  /** Compare lightweight identity (id+type) */
  public isEqual(json: { id: string | number; type: string }): boolean {
    return (
      json &&
      json.id.toString() === this.id.toString() &&
      json.type === this.type
    );
  }

  /** Compute tight bounds of an array of {x,y} points */
  public getBounds(points: ReadonlyArray<PointXY>): Bounds {
    if (!points || points.length === 0) return { x: 0, y: 0, w: 0, h: 0 };

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const pt of points) {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    }

    // floor mins; ceil maxs to ensure coverage
    minX = Math.floor(minX);
    minY = Math.floor(minY);
    maxX = Math.ceil(maxX);
    maxY = Math.ceil(maxY);

    return {
      x: minX,
      y: minY,
      w: Math.max(0, maxX - minX),
      h: Math.max(0, maxY - minY),
    };
  }

  /**
   * Set width/height from points’ bounds (does not move the surface position).
   * If buffer size changes, we recreate it.
   */
  public setDimensions(points: ReadonlyArray<PointXY>): void {
    const { w, h } = this.getBounds(points);
    this.setSize(w, h);
  }

  /** Explicitly resize surface; recreates buffer if dimensions changed. */
  public setSize(w: number, h: number): void {
    const newW = Math.max(0, Math.floor(w));
    const newH = Math.max(0, Math.floor(h));
    if (newW === this.width && newH === this.height) return;

    this.width = newW;
    this.height = newH;

    // Recreate buffer to match new size (2D)
    this.buffer = this.createBuffer(this.width, this.height);

    this.scheduleCalculateMesh();
  }

  /** rAF-based debounce for heavy recomputes in subclasses */
  public scheduleCalculateMesh(): void {
    if (this.rafHandle != null) return;

    // Prefer browser rAF if present
    const raf = typeof window !== "undefined" && window.requestAnimationFrame;
    if (raf) {
      this.rafHandle = raf(() => {
        this.rafHandle = null;
        if (typeof (this as any).calculateMesh === "function") {
          (this as any).calculateMesh();
        }
      });
    } else {
      // Fallback (tests / non-DOM)
      this.rafHandle = setTimeout(() => {
        this.rafHandle = null;
        if (typeof (this as any).calculateMesh === "function") {
          (this as any).calculateMesh();
        }
      }, 0) as unknown as number;
    }
  }

  //   override if it needs this
  public displayControlPoints() {}

  /** Basic JSON snapshot (dimensions + identity) */
  public toJSON(): DraggableJSON {
    return {
      id: this.id,
      type: this.type,
      res: this.res,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
