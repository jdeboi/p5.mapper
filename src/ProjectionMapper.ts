// ProjectionMapper.ts
// The real p5 instance type, used only to build the P5WithMapper export below;
// everything else in this file keeps using the relaxed `P5 = any` alias.
import type RealP5 from "p5";
import QuadMap from "./surfaces/QuadMap";
import TriMap from "./surfaces/TriMap";
import PolyMap from "./surfaces/PolyMap";
import BezierMap from "./surfaces/Bezier/BezierMap";
import LineMap, { LineJson } from "./surfaces/LineMap";
import { getPercentWave } from "./helpers/helpers";
import Surface from "./surfaces/Surface";
import Draggable from "./surfaces/Draggable";

// ---- Minimal p5 typings (relaxed) ----
type P5 = any;

// ---- Surface/Shape interfaces used here ----
export interface JsonSurface {
  id: number | string;
  type: "TRI" | "QUAD" | "BEZ" | "POLY";
  x: number;
  y: number;
  /** Present when this surface is parented to another (one level only). */
  parentId?: number | string;
  [k: string]: any;
}

type Selectable = Surface | LineMap;

type MoveMode = "ALL" | "SURFACES" | "POINTS";

class ProjectionMapper {
  // drawing buffers
  public buffer!: P5; // 2D for composing textures
  public bufferWEBGL!: P5; // WEBGL output for shader comp
  public bezBuffer!: P5; // mask for Bezier

  // shapes
  public surfaces: Draggable[] = [];
  public lines: LineMap[] = [];

  // interaction
  private dragged: Draggable | null = null;
  private selected: Draggable | null = null;
  private pMousePressed = false;
  private moveMode: MoveMode = "ALL";

  // state & env
  public calibrate = false;
  public pInst: P5 | null = null;

  // shaders
  private bezShader: any = null;
  public bezierShaderLoaded = false;

  constructor() {}

  // --------------------------- Lifecycle ---------------------------

  preload(shader: any) {
    this.bezShader = shader;
    this.bezierShaderLoaded = true;
  }

  init(w: number, h: number) {
    if (!this.pInst) throw new Error("ProjectionMapper.init: pInst not set");
    if (this.buffer && this.bezBuffer && this.bufferWEBGL) return; // idempotent

    this.bufferWEBGL = this.pInst.createGraphics(w, h, this.pInst.WEBGL);
    this.buffer = this.pInst.createGraphics(w, h);
    this.bezBuffer = this.pInst.createGraphics(w, h);

    // if no external shader was preloaded, make one locally
    if (!this.bezierShaderLoaded) this.initPMapperShaderStr();
  }

  // build shader from strings (fallback)
  private initPMapperShaderStr() {
    const frag = `
      #ifdef GL_ES
      precision mediump float;
      #endif
      varying vec2 vTexCoord;
      uniform sampler2D texMask;
      uniform sampler2D texImg;
      void main() {
        vec2 uv = vTexCoord;
        uv.y = 1.0 - uv.y;
        vec4 maskT = texture2D(texMask, uv);
        vec4 imgT = texture2D(texImg, uv);
        float gray = (maskT.r + maskT.g + maskT.b) / 3.0;
        vec3 thresh = imgT.rgb * gray;
        gl_FragColor = vec4(thresh, gray);
      }`;

    const vert = `
      #ifdef GL_ES
      precision mediump float;
      #endif
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      void main() {
        vTexCoord = aTexCoord;
        vec4 p = vec4(aPosition, 1.0);
        p.xy = p.xy * 2.0 - 1.0;
        gl_Position = p;
      }`;

    this.bezShader = this.bufferWEBGL.createShader(vert, frag);
    this.bezierShaderLoaded = true;
  }

  // --------------------------- Factories ---------------------------

  /**
   * Creates and registers a new quad surface.
   * @param res   target pixel spacing between adjacent mesh vertices
   *              (default 40px). Divisions per axis are derived from this
   *              quad's own width/height — round(dimension / res), each
   *              clamped to [2, 200] — so mesh density stays visually
   *              consistent across differently-sized/-shaped quads instead
   *              of a fixed `res x res` grid needing to be hand-tuned per
   *              surface. Smaller res = finer mesh (more vertices);
   *              larger res = coarser.
   * @param resY  optional explicit second value, bypassing the pixel-
   *              spacing calculation above entirely and setting literal
   *              division counts on both axes manually (`res` = resX,
   *              `resY` = resY, used as-is). E.g. `createQuadMap(w, h, 2, 2)`
   *              for the cheapest possible flat quad — a solid-color fill
   *              looks identical at any resolution, so there's no reason
   *              to pay for interior vertices.
   */
  createQuadMap(w: number, h: number, res = 40, resY?: number) {
    if (!this.pInst || !this.buffer)
      throw new Error("ProjectionMapper not initialized");
    const s = new QuadMap(
      this.surfaces.length,
      w,
      h,
      res,
      this.buffer,
      this.pInst,
      resY
    );
    this.surfaces.push(s);
    return s;
  }

  /** Creates and registers a new triangle surface. */
  createTriMap(w: number, h: number, res = 20) {
    if (!this.pInst || !this.buffer)
      throw new Error("ProjectionMapper not initialized");
    const s = new TriMap(
      this.surfaces.length,
      w,
      h,
      res,
      this.buffer,
      this.pInst
    );
    this.surfaces.push(s);
    return s;
  }

  /** Creates and registers a new poly surface. */
  createPolyMap(numPoints = 3) {
    if (!this.pInst || !this.buffer)
      throw new Error("ProjectionMapper not initialized");
    const n = Math.max(3, Math.floor(numPoints));
    const s = new PolyMap(this.surfaces.length, n, this.buffer, this.pInst);
    this.surfaces.push(s);
    return s;
  }

  /** Creates and registers a new Bezier surface. */
  createBezierMap(numPoints = 5) {
    if (!this.pInst) throw new Error("ProjectionMapper not initialized");
    const bez = new BezierMap(
      this.surfaces.length,
      numPoints,
      this,
      this.pInst
    );
    this.surfaces.push(bez);
    return bez;
  }

  /** Creates and registers a new line. */
  createLineMap(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
    if (!this.pInst) throw new Error("ProjectionMapper not initialized");
    // default stagger
    if (x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
      x1 = 200;
      y0 = 30 * this.lines.length;
      y1 = 30 * this.lines.length;
    }
    const l = new LineMap(x0, y0, x1, y1, this.lines.length, this.pInst);
    this.lines.push(l);
    return l;
  }

  // --------------------------- Interaction ---------------------------

  onClick() {
    if (!this.calibrate) return;

    if (this.moveMode === "SURFACES") {
      this.checkSurfacesClick();
    } else if (this.moveMode === "POINTS") {
      this.checkPointsClick();
    } else {
      if (!this.checkPointsClick()) this.checkSurfacesClick();
    }
  }

  moveSurfaces() {
    this.moveMode = "SURFACES";
  }
  moveControlPoints() {
    this.moveMode = "POINTS";
  }
  moveAll() {
    this.moveMode = "ALL";
  }

  isMovingPoints(): boolean {
    return this.moveMode === "ALL" || this.moveMode === "POINTS";
  }

  private checkSurfacesClick(): boolean {
    // lines (topmost-first)
    for (let i = this.lines.length - 1; i >= 0; i--) {
      const s = this.lines[i];
      this.dragged = s.selectDraggable();
      if (this.dragged) return true;
    }
    // surfaces
    for (let i = this.surfaces.length - 1; i >= 0; i--) {
      const s = this.surfaces[i];
      this.dragged = s.selectDraggable();
      if (this.dragged) {
        this.selected = s;
        return true;
      }
    }
    this.selected = null;
    return false;
  }

  private checkPointsClick(): boolean {
    // lines
    for (let i = this.lines.length - 1; i >= 0; i--) {
      const s = this.lines[i];
      this.dragged = s.selectPoints();
      if (this.dragged) return true;
    }
    // surfaces
    for (let i = this.surfaces.length - 1; i >= 0; i--) {
      const s = this.surfaces[i];
      this.dragged = s.selectPoints();
      if (this.dragged) {
        this.selected = s;
        return true;
      }
    }
    this.selected = null;
    return false;
  }

  onDrag() {
    if (this.dragged && this.dragged.moveTo) this.dragged.moveTo();
  }

  onRelease() {
    this.dragged = null;
  }

  isDragging(surface: Selectable): boolean {
    return this.dragged === surface;
  }

  updateEvents() {
    if (!this.pInst) return;
    if (this.pInst.mouseIsPressed) {
      if (!this.pMousePressed) this.onClick();
      else this.onDrag();
    } else {
      if (this.pMousePressed) this.onRelease();
    }
    this.pMousePressed = this.pInst.mouseIsPressed;
  }

  // --------------------------- Loading/Saving ---------------------------

  load(filepath = "maps/map.json", callback?: () => void) {
    if (!this.pInst) throw new Error("ProjectionMapper not initialized");
    this.pInst.loadJSON(
      filepath,
      (json: { surfaces?: JsonSurface[]; lines?: LineJson[] }) => {
        this.loadedJson(json);
        if (callback) callback();
      },
      (err: any) => console.warn(`error loading ${filepath}`, err)
    );
  }

  private loadedJson(json: { surfaces?: JsonSurface[]; lines?: LineJson[] }) {
    if (json.surfaces) this.loadSurfaces(json.surfaces);
    if (json.lines) this.loadLines(json.lines);
  }

  private loadSurfaces(jSurfaces: JsonSurface[]) {
    if (jSurfaces.length !== this.surfaces.length) {
      console.warn(
        `p5.mapper: map.json has ${jSurfaces.length} surface(s) but only ${this.surfaces.length} exist in memory, so the saved calibration can't be fully applied. ` +
          `Make sure every createQuadMap/createTriMap/createBezierMap/createPolyMap call finishes before pMapper.load() runs ` +
          `(e.g. if a surface is created inside an async callback like createVideo or loadImage, call load() from inside that same callback).`
      );
    }

    const filterBy = (t: JsonSurface["type"]) =>
      jSurfaces.filter((s) => s.type === t);
    const mapBy = (t: JsonSurface["type"]) =>
      this.surfaces.filter((s) => (s as any).type === t);

    const loadTyped = (t: JsonSurface["type"]) => {
      const js = filterBy(t);
      const ms = mapBy(t);
      let i = 0;
      while (i < js.length && i < ms.length) {
        const surface = ms[i];
        const j = js[i];
        if (surface.isEqual({ id: j.id, type: j.type })) {
          surface.load(j);
        } else console.warn("mismatch between calibration surface types/ids");

        i++;
      }
    };

    loadTyped("TRI");
    loadTyped("QUAD");
    loadTyped("BEZ");
    loadTyped("POLY");

    this.reattachParents(jSurfaces);
  }

  /**
   * Second pass, run after every surface above has loaded its own saved
   * position: resolve each surface's parentId (if any) to a live setParent()
   * call. This has to be a separate pass because parentId can reference any
   * surface regardless of creation-order/type bucket, so every surface's id
   * needs to already exist and be loaded before any of them can be
   * reattached. Matches by each live surface's own id (assigned uniquely
   * across the whole surfaces array at creation time), not by the
   * type-bucketed positional matching loadTyped() uses above.
   */
  private reattachParents(jSurfaces: JsonSurface[]) {
    const byId = new Map<string, Surface>();
    for (const s of this.surfaces) {
      if (s instanceof Surface) byId.set(String((s as any).id), s);
    }

    for (const j of jSurfaces) {
      if (j.parentId == null) continue;
      const child = byId.get(String(j.id));
      const parent = byId.get(String(j.parentId));
      if (!child || !parent) {
        console.warn(
          `p5.mapper: couldn't resolve parentId "${j.parentId}" for surface "${j.id}" while loading calibration — it will stay unparented.`
        );
        continue;
      }
      child.setParent(parent, { fromLoad: true });
    }
  }

  private loadLines(jLines: LineJson[]) {
    if (jLines.length !== this.lines.length) {
      console.warn(
        `p5.mapper: map.json has ${jLines.length} line(s) but only ${this.lines.length} exist in memory, so the saved calibration can't be fully applied. ` +
          `Make sure every createLineMap call finishes before pMapper.load() runs.`
      );
    }
    for (let i = 0; i < Math.min(jLines.length, this.lines.length); i++) {
      this.lines[i].load(jLines[i]);
    }
  }

  save(filename = "map.json") {
    if (!this.pInst) return;
    const json = {
      surfaces: this.surfaces.map((s) => s.toJSON()).filter(Boolean),
      lines: this.lines.map((l) => l.toJSON()),
    };
    this.pInst.saveJSON(json, filename);
  }

  // --------------------------- Calibration ---------------------------

  startCalibration() {
    this.calibrate = true;
  }
  stopCalibration() {
    this.calibrate = false;
  }
  toggleCalibration() {
    this.calibrate = !this.calibrate;
  }

  // --------------------------- Rendering hooks ---------------------------

  displayControlPoints() {
    if (!this.calibrate) return;

    for (const s of this.surfaces) {
      if (s instanceof Surface) s.displayControlPoints();
    }

    for (const l of this.lines) {
      l.displayCalibration();
      l.displayControlPoints();
    }
  }

  // --------------------- Shared calibration overlay ---------------------
  //
  // Every QuadMap-type surface's calibration grid draws into this ONE
  // canvas-sized buffer (instead of each allocating its own) - see
  // QuadMap.displayCalibration(). Surfaces are allowed to visually overlap
  // on the actual wall (a painting sits *within* the wall quad's own
  // boundary), so their calibration grids overlap in this shared buffer
  // too - a per-surface "clear only my own sub-region, skip redraw if I
  // haven't changed" optimization is unsafe here: whenever an overlapping
  // surface redraws, it would clear and erase another surface's
  // already-drawn content, which then never gets redrawn (that surface has
  // no way to know its region was just wiped out from under it) - this was
  // shipped once and visibly broke (surfaces disappearing while a sibling
  // was dragged) before being caught and reverted to the simpler, correct
  // version here: a full clear + full redraw of every surface, every
  // frame, while calibrating. That's cheap 2D immediate-mode triangle
  // drawing (a handful of small grids), not the createGraphics()/GPU-buffer
  // churn this consolidation exists to avoid, so there's no real cost to
  // giving up the partial-redraw optimization. The clear happens once, in
  // predraw below, strictly before any surface's own draw() call this frame
  // - i.e. before any surface has had a chance to draw into it - and the
  // single blit of the combined result happens once, in postdraw, strictly
  // after every surface's draw() call this frame has run.

  private calibSharedGfx: any | null = null;
  private calibSharedGfxW = 0;
  private calibSharedGfxH = 0;

  /** Lazily creates (or resizes, on canvas resize) the shared calibration buffer. */
  getCalibSharedGfx(): any {
    if (!this.pInst) return null;
    const w = this.pInst.width;
    const h = this.pInst.height;
    if (
      !this.calibSharedGfx ||
      this.calibSharedGfxW !== w ||
      this.calibSharedGfxH !== h
    ) {
      if (this.calibSharedGfx) this.calibSharedGfx.remove();
      this.calibSharedGfx = this.pInst.createGraphics(
        Math.max(1, w),
        Math.max(1, h)
      );
      this.calibSharedGfxW = w;
      this.calibSharedGfxH = h;
    }
    return this.calibSharedGfx;
  }

  /**
   * Clears the shared buffer once at the start of each frame, before any
   * surface's displayCalibration() runs this frame. See the section comment
   * above for why this has to be a full clear, not a per-surface partial one.
   */
  beginCalibFrame(): void {
    if (!this.calibrate) return;
    const g = this.getCalibSharedGfx();
    if (g) g.clear();
  }

  /**
   * Blit the shared calibration buffer once, after every surface has had a
   * chance to draw into it this frame; free it the moment calibration mode
   * turns off, so the far more common non-calibrating steady state (and
   * every later re-entry into calibration mode) holds zero calibration-only
   * GPU resources rather than carrying a stale buffer over indefinitely.
   */
  blitCalibSharedGfx() {
    if (!this.pInst) return;
    if (!this.calibrate) {
      if (this.calibSharedGfx) {
        this.calibSharedGfx.remove();
        this.calibSharedGfx = null;
        this.calibSharedGfxW = 0;
        this.calibSharedGfxH = 0;
      }
      return;
    }
    if (this.calibSharedGfx) {
      this.pInst.image(
        this.calibSharedGfx,
        -this.pInst.width / 2,
        -this.pInst.height / 2
      );
    }
  }

  // small util exposed
  getOscillator(seconds: number, offset = 0) {
    if (!this.pInst) return 0;
    return getPercentWave(this.pInst, seconds, offset);
  }

  // shader access for BezierMap
  getBezierShader() {
    return this.bezShader;
  }
}

const pMapper = new ProjectionMapper();

// --------------------------- p5 Integration ---------------------------

declare const p5: any;

// Shared method list for both augmentation styles below.
interface PMapperInstanceMethods {
  createProjectionMapper(pInst: P5, w?: number, h?: number): ProjectionMapper;
  isCalibratingMapper(): boolean;
  isMovingPoints(): boolean;
  isDragging(surface: Selectable): boolean;
  initPMapperShader(): void;
}

// Legacy global augmentation, for consumers using p5 as a global (script tag)
// or the older @types/p5 (DefinitelyTyped) declarations.
declare global {
  interface p5 extends PMapperInstanceMethods {}
}

// p5 v2's own bundled types use `export default class p5 {}`, which can't be
// declaration-merged into from outside — so `declare module "p5"` /
// `declare global` augmentation above is invisible to `import p5 from "p5"`
// consumers. This intersection type is the real fix for that case: annotate
// your sketch's p5 instance with it to get p5.mapper's methods typed.
export type P5WithMapper = RealP5 & PMapperInstanceMethods;

p5.prototype.createProjectionMapper = function (
  pInst: P5,
  w?: number,
  h?: number
) {
  const W = w ?? pInst.width;
  const H = h ?? pInst.height;
  pMapper.pInst = pInst;
  pMapper.init(W, H);
  return pMapper;
};

p5.prototype.isCalibratingMapper = function () {
  return pMapper.calibrate;
};

p5.prototype.isMovingPoints = function () {
  return pMapper.isMovingPoints();
};

p5.prototype.isDragging = function (surface: Selectable) {
  return pMapper.isDragging(surface);
};

p5.prototype.initPMapperShader = function () {
  const filePath =
    "https://cdn.statically.io/gh/jdeboi/p5.mapper/main/src/surfaces/Bezier/shader";
  this.loadShader(filePath + ".vert", filePath + ".frag", (bezShader: any) =>
    pMapper.preload(bezShader)
  );
};

// Use a single 'postdraw' lifecycle hook to avoid overriding each other.
// p5.js 2.x replaced the old registerMethod("post", ...) API with registerAddon.
p5.registerAddon((_p5: any, _fn: any, lifecycles: any) => {
  lifecycles.predraw = () => {
    // Must run before any surface's own draw() call this frame - see
    // ProjectionMapper's "Shared calibration overlay" section.
    pMapper.beginCalibFrame();
  };
  lifecycles.postdraw = () => {
    pMapper.displayControlPoints();
    pMapper.updateEvents();
    // Every QuadMap-type surface's own draw() call this frame has already
    // run by this point (postdraw fires once, after the whole sketch draw()
    // completes) and had its chance to update its own region of the shared
    // calibration buffer - this is the single, once-per-frame blit of the
    // combined result. See ProjectionMapper's "Shared calibration overlay"
    // section for why this can't just happen per-surface.
    pMapper.blitCalibSharedGfx();
  };
});

export default pMapper;
