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
  private _mutedColor: any | null = null;

  /**
   * Optional parent surface. When set, this surface's own x/y is pinned to
   * (0,0) and its calibration is expressed relative to the parent's local
   * pre-warp space instead of absolute screen coordinates — see
   * resolveToScreen/resolveToLocal and setParent(). Nesting is one level
   * only: a parent cannot itself have a parent, and a surface with children
   * cannot be given a parent (enforced in setParent()).
   */
  public parentSurface: Surface | null = null;
  protected children: Surface[] = [];

  /**
   * @param id        Identifier for the surface
   * @param w         width in px
   * @param h         height in px
   * @param res       grid resolution per axis (>= 2). Meaningful for QuadMap, where it
   *                  sets the density of the mesh used to tessellate the perspective
   *                  warp — see `CornerPinSurface` and the resolution notes in
   *                  reference/README.md. TriMap accepts the same param but always
   *                  renders as a single flat (untessellated) triangle, so there `res`
   *                  only affects where the apex control point is placed at construction.
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

  /** Muted version of a p5 color (alpha default 50). Cached for the common default call. */
  public getMutedControlColor(
    col: any = this.controlPointColor,
    alpha = 50
  ): any {
    if (col === this.controlPointColor && alpha === 50) {
      if (!this._mutedColor) {
        const p = this.pInst;
        this._mutedColor = p.color(p.red(col), p.green(col), p.blue(col), alpha);
      }
      return this._mutedColor;
    }
    const p = this.pInst;
    return p.color(p.red(col), p.green(col), p.blue(col), alpha);
  }

  /** Fill the surface's mesh directly with a solid color (no offscreen buffer/texture needed) */
  public display(col: any = this.pInst.color("black")): void {
    const p = this.pInst;
    p.push();
    p.noStroke();
    p.fill(col);
    p.translate(this.x, this.y);
    this.displaySurface(false);
    if (p.isCalibratingMapper()) this.displayCalibration();
    p.pop();
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

    // The buffer handed to `sketch` here may be a larger, shared buffer
    // (ProjectionMapper gives every surface the same canvas-sized 2D
    // buffer, not one sized to this surface) - so the crop must default to
    // *this surface's own* footprint, not the buffer's. Without this,
    // displayTexture()'s texW<=0/texH<=0 fallback uses tex.width/tex.height
    // (the shared buffer's full canvas size) as the source rect, stretching
    // whatever `sketch` drew (authored in this surface's own 0..width,
    // 0..height space) across a UV range sized for the whole canvas -
    // non-uniformly squashing it toward this surface's origin by roughly
    // (this.width / canvasWidth, this.height / canvasHeight).
    if (texW <= 0) texW = this.width;
    if (texH <= 0) texH = this.height;

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
    const json: DraggableJSON = {
      id: this.id,
      type: this.type,
      res: this.res,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
    if (this.parentSurface) json.parentId = this.parentSurface.id;
    return json;
  }

  // --------------------------- Parenting ---------------------------

  /**
   * Resolve a point local to this surface into absolute screen coordinates.
   * Default (no perspective warp): plain translate by this.x/this.y — this
   * is exactly today's implicit behavior for every unparented surface, and
   * remains correct for PolyMap (no warp) without needing an override.
   * CornerPinSurface overrides this to route through its homography.
   */
  public resolveToScreen(lx: number, ly: number): PointXY {
    return { x: lx + this.x, y: ly + this.y };
  }

  /** Inverse of resolveToScreen — absolute screen coords -> this surface's local space. */
  public resolveToLocal(ax: number, ay: number): PointXY {
    return { x: ax - this.x, y: ay - this.y };
  }

  /**
   * Re-derive this surface's render-facing geometry from its stored
   * parent-relative calibration, using the parent's *current* transform.
   * No-op when there's no parent. Overridden by CornerPinSurface
   * (-> calculateMesh()) and PolyMap (-> re-resolve each point).
   */
  public recalcFromParent(): void {}

  /**
   * Subclass hook: fold this surface's own point storage by (dx,dy) — the
   * absolute offset this surface's x/y held right before being parented —
   * and convert those points into parent-relative local coordinates via
   * `this.parentSurface!.resolveToLocal()`. Called once, from setParent(),
   * after this.parentSurface is set and this.x/this.y have been zeroed.
   */
  protected onParentAttached(dx: number, dy: number): void {}

  /**
   * Subclass hook: freeze this surface's current resolved absolute position
   * into its own point storage and clear any parent-relative local shadow
   * state, so a future re-parent starts clean. Called once, from
   * setParent(null), while this.parentSurface still points at the old parent.
   */
  protected onParentDetached(): void {}

  /**
   * Attach (or clear, via null) this surface's parent. Nesting is one level
   * only: rejects making a surface its own parent, rejects a target that
   * already has a parent (would create depth > 1, and structurally rules
   * out an A<->B swap cycle since if `this` is already `target`'s parent,
   * `target.parentSurface` is non-null), and rejects giving a parent to a
   * surface that already has children (would make it a grandchild-producing
   * middle node from the other direction).
   *
   * `opts.fromLoad` is for ProjectionMapper's loader only: load() (see
   * CornerPinSurface/PolyMap) already reads this surface's parent-relative
   * calibration straight out of the saved file into the local shadow
   * fields, *before* setParent() runs (parent/child relationships are
   * reattached in a second pass, after every surface has loaded its own
   * saved position). The normal (interactive) attach path instead *derives*
   * those local values by folding this surface's current absolute position
   * through the parent's transform (onParentAttached) — which, at load
   * time, would clobber the just-loaded real values with junk computed
   * from this surface's stale pre-load default-seed position. fromLoad
   * skips that fold and only resolves the (already-correct) local values
   * into real x/y.
   */
  public setParent(
    parent: Surface | null,
    opts: { fromLoad?: boolean } = {}
  ): this {
    if (parent === this.parentSurface) return this;

    if (parent) {
      if (parent === (this as unknown as Surface)) {
        console.warn("setParent: a surface cannot be its own parent");
        return this;
      }
      if (parent.parentSurface != null) {
        console.warn(
          "setParent: nesting is limited to one level — the target already has a parent"
        );
        return this;
      }
      if (this.children.length > 0) {
        console.warn(
          "setParent: this surface already has children — nesting is limited to one level"
        );
        return this;
      }
    }

    if (this.parentSurface) {
      const oldParent = this.parentSurface;
      const idx = oldParent.children.indexOf(this);
      if (idx >= 0) oldParent.children.splice(idx, 1);
      this.parentSurface = null;
      this.onParentDetached();
    }

    if (parent) {
      const dx = this.x;
      const dy = this.y;
      this.x = 0;
      this.y = 0;
      this.parentSurface = parent;
      parent.children.push(this);
      if (!opts.fromLoad) this.onParentAttached(dx, dy);
      this.recalcFromParent();
    }

    return this;
  }

  public getParent(): Surface | null {
    return this.parentSurface;
  }

  /**
   * Whole-surface rigid dragging is disabled once parented: a raw
   * screen-space mouse delta applied to this.x/this.y is only approximately
   * correct once the parent has any keystone (exact at its center, worse
   * toward its edges), unlike per-point dragging (which goes through
   * resolveToLocal and stays exact). Per-point dragging remains the only
   * way to position/adjust a parented child.
   */
  public selectDraggable(): this | null {
    if (this.parentSurface) return null;
    return super.selectDraggable() as this | null;
  }

  /** Fan a position change out to any children so they re-derive their own geometry. */
  protected onPositionChanged(): void {
    this.children.forEach((c) => c.recalcFromParent());
  }
}
