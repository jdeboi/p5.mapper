import { P5 } from "../helpers/helpers";
import Draggable, { DraggableJSON } from "./Draggable";
import MovePoint from "./MovePoint";
export type LineJson = {
    id: string | number;
    x: number;
    y: number;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
};
type Vec = {
    x: number;
    y: number;
};
export default class LineMap extends Draggable {
    id: string | number;
    type: string;
    lineW: number;
    endCapsOn: boolean;
    p0: MovePoint;
    p1: MovePoint;
    lineC: any;
    highlightColor: any;
    controlPointColor: any;
    private lastChecked;
    private ang;
    private _calibrationColor;
    /** Cached line length; recomputed lazily when endpoints change */
    private _lineLen;
    private _cachedP0x;
    private _cachedP0y;
    private _cachedP1x;
    private _cachedP1y;
    constructor(x0: number, y0: number, x1: number, y1: number, id: string | number, pInst: P5);
    load(json: DraggableJSON): void;
    toJSON(): DraggableJSON;
    display(col?: any, sw?: number): void;
    /** Pulses from the center toward endpoints */
    displayCenterPulse(per: number, col?: any, sw?: number): void;
    /** Draws the line from p0 to a percent along toward p1 */
    displayPercent(per: number, col?: any, sw?: number): void;
    /** Keeps the whole line but varies stroke width by percent */
    displayPercentWidth(per: number, col?: any): void;
    displayNone(): void;
    /** HSB hue cycle */
    displayRainbowCycle(): void;
    /** Swept gradient segments along the line */
    displayGradientLine(c1: any, c2: any, per: number, phase?: number, flip?: boolean): void;
    getCalibrationColor(): any;
    private getLinearIdColor;
    displayCalibration(): void;
    displayControlPoints(): void;
    setEndCapsOn(): void;
    setEndCapsOff(): void;
    private drawEndCaps;
    /** Draws a segment between t in [startPer, startPer+sizePer] */
    displaySegment(startPer: number, sizePer: number, col?: any, sw?: number): void;
    get2CycleColor(c1: any, c2: any, per: number): any;
    get3CycleColor(c1: any, c2: any, per: number): any;
    getPointHighlight(_p: Vec): void;
    /** Local-space hit test against the line (distance-to-segment) */
    isMouseOver(): boolean;
    isMouseOverCallback(callback: (self: LineMap) => void): void;
    selectPoints(): MovePoint | null;
    leftToRight(): void;
    rightToLeft(): void;
    displayNumber(): void;
    private projectParam;
    private clamp;
    private hashString;
}
export {};
