import { CSSProperties } from 'vue';
/**
 * Hatch pattern option rendered by hatch preview controls.
 */
export interface HatchPatternOption {
    /** Stable hatch pattern name written to the hatch command inputs. */
    value: string;
    /** Optional UI label. Falls back to `value` when omitted. */
    label?: string;
}
/**
 * Encodes an SVG snippet as a data URI that can be used in CSS background-image.
 *
 * @param svg Raw SVG markup.
 * @returns CSS `url(...)` wrapper containing encoded SVG data URI.
 */
export declare function toSvgDataUri(svg: string): string;
/**
 * Returns a cached SVG data URI preview for a hatch pattern.
 *
 * @param name Hatch pattern name.
 * @returns Data URI suitable for image-based preview controls.
 */
export declare function resolveHatchPatternPreviewSvg(name: string): string | undefined;
/**
 * Returns a CSS background preview style for a hatch pattern name.
 *
 * @param name Hatch pattern name selected by the user.
 * @returns Inline style object consumed by swatch elements.
 */
export declare function resolveHatchPatternSwatchStyle(name: string): CSSProperties;
/**
 * Canonical hatch pattern list used by the contextual ribbon picker.
 */
export declare const DEFAULT_HATCH_PATTERN_OPTIONS: HatchPatternOption[];
//# sourceMappingURL=hatchPatternPreview.d.ts.map