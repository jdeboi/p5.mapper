// helpers.ts

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
export function inside(
  point: Point,
  polygon: ReadonlyArray<Point>,
  offset: Point = { x: 0, y: 0 }
): boolean {
  const { x, y } = point;

  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x + offset.x;
    const yi = polygon[i].y + offset.y;
    const xj = polygon[j].x + offset.x;
    const yj = polygon[j].y + offset.y;

    // edges that straddle the horizontal ray at y
    const straddles = yi > y !== yj > y;
    if (straddles) {
      // x coordinate where the edge crosses the ray
      const xCross = ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (x < xCross) isInside = !isInside;
    }
  }
  return isInside;
}

/**
 * Deterministic-ish color based on id/type.
 * Returns whatever your p5.color(...) returns (usually a p5.Color).
 */
export function getRandomizedColor(
  id: number,
  type: string | undefined,
  p5: any
): any {
  const shapeOffset = type ? type.charCodeAt(0) : 2;
  const offset = (1 + id) * 88 + shapeOffset * 80;

  // flip to HSB, pick a hue, then restore RGB
  p5.colorMode(p5.HSB, 255);
  const col = p5.color(offset % 255, 255, 255);
  p5.colorMode(p5.RGB, 255);
  return col;
}

/** Linear 0..1 progress loop over `seconds` (clamped to 0.1..100). */
export function getPercent(p5: P5, seconds = 1): number {
  const s = p5.constrain(seconds, 0.1, 100);
  return (p5.frameCount / (60 * s)) % 1;
}

/** Sinusoidal 0..1 wave over `seconds`, with optional phase `offset` (radians). */
export function getPercentWave(p5: P5, seconds = 1, offset = 0): number {
  const s = p5.constrain(seconds, 0.01, 100);
  return 0.5 + 0.5 * p5.sin((p5.frameCount / (60 * s)) * 2 * p5.PI + offset);
}
