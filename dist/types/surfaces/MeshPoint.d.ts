import { Point } from "./Draggable";
import MovePoint from "./MovePoint";
export default class MeshPoint extends MovePoint {
    u: number;
    v: number;
    constructor(parent: any, x: number, y: number, u: number, v: number, pInst: any);
    set(point: Point): this;
    moveTo(): void;
    /**
     * This creates a new MeshPoint with (u,v) = (0,0) and does
     * not modify the current MeshPoint. Its used to generate
     * temporary points for the interpolation.
     */
    interpolateTo(p: {
        x: number;
        y: number;
    }, f: number): MeshPoint;
}
