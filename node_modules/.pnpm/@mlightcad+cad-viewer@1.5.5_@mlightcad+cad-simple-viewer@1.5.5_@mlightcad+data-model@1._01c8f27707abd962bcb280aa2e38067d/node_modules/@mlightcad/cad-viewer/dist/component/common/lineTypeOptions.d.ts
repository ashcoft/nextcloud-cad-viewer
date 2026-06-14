import { AcDbDatabase, AcGiBaseLineStyle } from '@mlightcad/data-model';
/**
 * Normalized line type metadata consumed by ribbon property controls and
 * standalone selectors.
 */
export interface LineTypeOption {
    /** Stable value written back to the database `CELTYPE` system variable. */
    value: string;
    /** User-facing label rendered in the dropdown list. */
    label: string;
    /** Optional inline SVG preview generated from the backing line type record. */
    previewSvgString?: string;
    /** Optional fallback pattern hint used when a live line type record is absent. */
    pattern?: 'solid' | 'dashed' | 'hidden' | 'center';
    /** Backing CAD line type record used to derive a preview from dash segments. */
    lineType?: AcGiBaseLineStyle;
}
/**
 * Resolves the optional inline SVG preview from explicit option metadata or the
 * backing CAD line type object.
 *
 * @param option Option to visualize.
 * @returns Inline SVG markup string when available.
 */
export declare function resolveLineTypePreviewSvg(option?: LineTypeOption): string | undefined;
/**
 * Resolves the CSS background used to preview a line type option.
 *
 * @param option Option to visualize. When omitted, a solid fallback is used.
 * @returns A CSS background value that can be bound directly to the preview swatch.
 */
export declare function resolveLineTypeBackground(option?: LineTypeOption): string;
/**
 * Builds a deduplicated and sorted set of selectable line type options from the
 * active drawing database.
 *
 * @param db Active CAD database that owns the line type table.
 * @returns Dropdown-ready options, with `Continuous` promoted to the top when present.
 */
export declare function buildLineTypeOptions(db?: AcDbDatabase): LineTypeOption[];
//# sourceMappingURL=lineTypeOptions.d.ts.map