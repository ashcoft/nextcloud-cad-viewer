import { DwgPoint2D } from '../database';
/**
 * Represents a 2D axis-aligned bounding box.
 */
export declare class Box2D {
    min: DwgPoint2D;
    max: DwgPoint2D;
    valid: boolean;
    constructor();
    /**
     * Expands the bounding box to include a given point.
     *
     * @param point - The point to include in the bounding box.
     * @returns This bounding box after expansion.
     */
    expandByPoint(point: DwgPoint2D): Box2D;
    /**
     * Applies a scaling and translation transformation to this bounding box.
     *
     * @param scale - The scaling factors in x and y directions.
     * @param translation - The translation offsets in x and y directions.
     * @returns This bounding box after transformation.
     */
    transform(scale: DwgPoint2D, translation: DwgPoint2D): Box2D;
    /**
     * Applies a rotation around a specific point to this bounding box.
     *
     * @param angleInRad - The angle of rotation in radians.
     * @param point - The center of rotation.
     * @returns This bounding box after rotation.
     */
    rotate(angleInRad: number, point: DwgPoint2D): Box2D;
    /**
     * Creates a deep copy of this bounding box.
     *
     * @returns A new instance of Box2D with the same properties.
     */
    clone(): Box2D;
    /**
     * Resets this bounding box to its initial unbounded state.
     */
    private reset;
    /**
     * Retrieves the four corner points of the bounding box.
     *
     * @returns An array of corner points in the order:
     * bottom-left, top-left, bottom-right, top-right.
     */
    private getCorners;
}
//# sourceMappingURL=box2d.d.ts.map