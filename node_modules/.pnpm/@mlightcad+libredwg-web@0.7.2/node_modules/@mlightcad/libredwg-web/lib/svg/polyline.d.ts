import { DwgLWPolylineEntity, DwgPoint2D } from '../database';
export declare function createPolylineArcPoints(from: DwgPoint2D, to: DwgPoint2D, bulge: number, resolution?: number): DwgPoint2D[];
export declare function interpolatePolyline(entity: DwgLWPolylineEntity, closed?: boolean): DwgPoint2D[];
//# sourceMappingURL=polyline.d.ts.map