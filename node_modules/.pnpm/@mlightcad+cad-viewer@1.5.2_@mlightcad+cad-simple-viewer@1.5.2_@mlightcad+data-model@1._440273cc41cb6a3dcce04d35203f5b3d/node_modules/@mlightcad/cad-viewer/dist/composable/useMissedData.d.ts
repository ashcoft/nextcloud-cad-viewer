import { AcDbObjectId } from '@mlightcad/data-model';
/**
 * Missed Data Composable
 *
 * Tracks fonts and raster images that the current drawing references but that are
 * missing on disk or unavailable to the renderer. State is shared module-wide so
 * every caller sees the same reactive maps (for example the status-bar warning
 * button and the replacement dialog).
 *
 * Data is synchronized from {@link AcApDocManager.instance.curView.missedData}
 * and persisted font substitutions from
 * {@link AcApSettingManager.instance.fontMapping}. Consumers may mutate the
 * returned maps (choose replacement fonts, attach image files) before applying
 * changes through the replacement dialog.
 *
 * @example
 * ```typescript
 * import { useMissedData } from '@mlightcad/cad-viewer'
 *
 * const { fonts, images } = useMissedData()
 *
 * if (fonts.size > 0) {
 *   console.log('Missing fonts:', [...fonts.keys()])
 * }
 *
 * images.forEach((row, fileName) => {
 *   console.log(fileName, 'affects', row.ids.size, 'entities')
 * })
 * ```
 */
/**
 * One row in the missed-image replacement table.
 *
 * Multiple drawing entities can reference the same missing image file; they are
 * grouped under a single row keyed by {@link fileName}.
 */
export interface ImageMappingData {
    /** File name reported by the viewer for the missing image resource. */
    fileName: string;
    /**
     * User-selected replacement file, set by the replacement dialog before confirm.
     * Undefined until the user picks a file.
     */
    file?: File;
    /** Entity object IDs whose raster image reference resolves to {@link fileName}. */
    ids: Set<AcDbObjectId>;
}
/**
 * Reactive state returned by {@link useMissedData}.
 */
export interface UseMissedDataReturn {
    /**
     * Missed font name → replacement font name.
     *
     * Keys come from the active view's missed-font list. Values are initialized from
     * application settings; an empty string means no replacement has been chosen yet.
     */
    fonts: Map<string, string>;
    /**
     * Missed image file name → grouped mapping row.
     *
     * Keys are image resource names from the drawing. Values aggregate all entities
     * that reference that resource.
     */
    images: Map<string, ImageMappingData>;
}
/**
 * Access shared reactive state for missing fonts and images in the current drawing.
 *
 * Safe to call from multiple components; initialization and event wiring run once.
 *
 * @returns Reactive maps for the replacement dialog and warning affordances.
 */
export declare function useMissedData(): UseMissedDataReturn;
//# sourceMappingURL=useMissedData.d.ts.map