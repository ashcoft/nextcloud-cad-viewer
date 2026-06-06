/**
 * Copied and ported to code standard as the b-spline library is not maintained any longer.
 * Source:
 * https://github.com/thibauts/b-spline
 * Copyright (c) 2015 Thibaut Séguy <thibaut.seguy@gmail.com>
 *
 * B-spline evaluator with optional weights and knot vector.
 * Returns a point on the curve given parameter t ∈ [0,1].
 */
export declare function evaluateBSpline(t: number, degree: number, points: number[][], knots?: number[], weights?: number[]): number[];
//# sourceMappingURL=bspline.d.ts.map