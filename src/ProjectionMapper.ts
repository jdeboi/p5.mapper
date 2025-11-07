// ProjectionMapper.ts
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

  /** Creates and registers a new quad surface. */
  createQuadMap(w: number, h: number, res = 20) {
    if (!this.pInst || !this.buffer)
      throw new Error("ProjectionMapper not initialized");
    const s = new QuadMap(
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
        `json has ${jSurfaces.length} surfaces but memory has ${this.surfaces.length} surfaces`
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
  }

  private loadLines(jLines: LineJson[]) {
    if (jLines.length !== this.lines.length) {
      console.warn(
        `json has ${jLines.length} lines but memory has ${this.lines.length} lines`
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

declare global {
  interface Window {
    p5: any;
  }
}

declare global {
  interface p5 {
    createProjectionMapper(pInst: P5, w?: number, h?: number): ProjectionMapper;
    isCalibratingMapper(): boolean;
    isMovingPoints(): boolean;
    isDragging(surface: Selectable): boolean;
    initPMapperShader(): void;
  }
}

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

// Use a single 'post' hook to avoid overriding each other
p5.prototype.registerMethod("post", () => {
  pMapper.displayControlPoints();
  pMapper.updateEvents();
});

export default pMapper;
