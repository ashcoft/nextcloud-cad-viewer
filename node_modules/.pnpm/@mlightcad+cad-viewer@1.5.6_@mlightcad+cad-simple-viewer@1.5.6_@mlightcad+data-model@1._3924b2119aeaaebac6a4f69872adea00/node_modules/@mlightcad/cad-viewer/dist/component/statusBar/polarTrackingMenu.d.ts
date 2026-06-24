/** Common POLARANG values shown in the status bar polar tracking menu. */
export declare const POLAR_TRACKING_INCREMENTS: readonly [90, 45, 30, 22.5, 18, 15, 10, 5];
export type PolarTrackingIncrement = (typeof POLAR_TRACKING_INCREMENTS)[number];
/**
 * Formats the preview label for a polar angle increment (e.g. `45, 90, 135, 180...`).
 * Matches AutoCAD status bar polar tracking menu text.
 */
export declare function formatPolarIncrementMenuLabel(increment: number): string;
export declare function isSamePolarIncrement(current: number, increment: number): boolean;
//# sourceMappingURL=polarTrackingMenu.d.ts.map