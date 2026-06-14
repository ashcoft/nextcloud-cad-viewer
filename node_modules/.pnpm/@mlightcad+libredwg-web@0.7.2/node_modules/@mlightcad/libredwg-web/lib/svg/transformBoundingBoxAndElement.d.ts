import { Box2D } from './box2d';
type Transform = {
    type: 'translate';
    x: number;
    y: number;
} | {
    type: 'rotate';
    angle: number;
} | {
    type: 'scale';
    x: number;
    y: number;
};
export interface BBoxAndElement {
    bbox: Box2D;
    element: string;
}
export declare const transformBoundingBoxAndElement: (bbox: Box2D, element: string, transforms?: Transform[] | undefined) => BBoxAndElement;
export {};
//# sourceMappingURL=transformBoundingBoxAndElement.d.ts.map