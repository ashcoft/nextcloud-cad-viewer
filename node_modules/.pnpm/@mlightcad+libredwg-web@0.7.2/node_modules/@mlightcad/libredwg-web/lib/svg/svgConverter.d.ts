import { DwgDatabase } from '../database';
export declare class SvgConverter {
    private blockMap;
    private rotate;
    /**
     * Interpolates a B-spline curve and returns the resulting polyline.
     *
     * @param controlPoints The control points of the B-spline.
     * @param degree The degree of the B-spline.
     * @param knots The knot vector.
     * @param interpolationsPerSplineSegment Number of interpolated points per spline segment.
     * @param weights Optional weight vector for rational B-splines.
     * @returns An array of interpolated 2D points representing the polyline.
     */
    private interpolateBSpline;
    private addFlipXIfApplicable;
    private line;
    private ray;
    private xline;
    private extractMTextLines;
    private lines;
    private mtext;
    private table;
    private text;
    private vertices;
    private circle;
    private ellipseOrArc;
    private bboxEllipseOrArc;
    private ellipse;
    private arc;
    private dimension;
    private insert;
    private block;
    private entityToBoundsAndElement;
    private getEntityColor;
    convert(dwg: DwgDatabase): string;
}
//# sourceMappingURL=svgConverter.d.ts.map