/** Basic 2D point */
export interface Point {
    x: number;
    y: number;
}
export type P5 = any;
/**
 * Ray-casting point-in-polygon test.
 * `offset` shifts the polygon (useful when polygon points are local to a parent).
 */
export declare function inside(point: Point, polygon: ReadonlyArray<Point>, offset?: Point): boolean;
/**
 * Deterministic-ish color based on id/type.
 * Returns whatever your p5.color(...) returns (usually a p5.Color).
 */
export declare function getRandomizedColor(id: number, type: string | undefined, p5: any): any;
/** Linear 0..1 progress loop over `seconds` (clamped to 0.1..100). */
export declare function getPercent(p5: P5, seconds?: number): number;
/** Sinusoidal 0..1 wave over `seconds`, with optional phase `offset` (radians). */
export declare function getPercentWave(p5: P5, seconds?: number, offset?: number): number;
