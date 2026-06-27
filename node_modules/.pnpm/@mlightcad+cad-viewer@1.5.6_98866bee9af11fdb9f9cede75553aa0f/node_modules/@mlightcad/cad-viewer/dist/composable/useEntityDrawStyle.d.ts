import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
import { AcCmColor, AcGiLineWeight } from '@mlightcad/data-model';
import { Ref } from 'vue';
/**
 * =============================================================
 * useEntityDrawStyle
 * =============================================================
 *
 * Composable for managing draw style of newly created entities.
 *
 * - Source of truth: editor.curDocument.database
 * - Does NOT mutate layers
 * - Explicit setters for color & line weight
 * - Safe with async editor initialization
 * - Reactive & UI-friendly
 */
/**
 * =============================================================
 * Composable
 * =============================================================
 */
export declare function useEntityDrawStyle(editorRef: Ref<AcApDocManager | null>): {
    color: Ref<string, string>;
    lineWeight: Ref<AcGiLineWeight, AcGiLineWeight>;
    cssColor: import('vue').ComputedRef<string>;
    isShowToolbar: Ref<boolean, boolean>;
    setColor: (nextColor: AcCmColor) => void;
    setLineWeight: (v: AcGiLineWeight) => void;
    syncFromDatabase: () => void;
    syncToDatabase: () => void;
};
//# sourceMappingURL=useEntityDrawStyle.d.ts.map