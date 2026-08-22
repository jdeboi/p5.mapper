import Draggable, { Point } from "../Draggable";
type P5 = any;
type P5Vec = {
    x: number;
    y: number;
    set: (x: number, y: number) => void;
    add: (x: number, y: number) => void;
};
export type PathMode = "AUTOMATIC" | "ALIGNED" | "MIRRORED" | "FREE";
export interface ParentPath {
    x: number;
    y: number;
    points: BezierPoint[];
    mode: PathMode;
    auto?: boolean;
    controlPointColor: any;
    loopIndex(i: number): number;
    autoSetAllControlPoints(): void;
    setDimensions(): void;
}
export default class BezierPoint extends Draggable {
    readonly pInst: P5;
    readonly parentPath: ParentPath;
    type: string;
    r: number;
    /** Index in parentPath.points — kept current by BezierMap._updatePointIndices(). */
    index: number;
    /** Local position (mirrors Draggable.x/y) */
    pos: P5Vec;
    constructor(x: number, y: number, parentPath: ParentPath, pInst: P5);
    add(x: number, y: number): void;
    set(pos: Partial<Point>): this;
    isMouseOver(): boolean;
    moveTo(): void;
    isAnchor(): boolean;
    displayControlCircle(anchorCol: any, lighterCol: any): void;
    displayCircle(col: any, r: number): void;
}
export {};
