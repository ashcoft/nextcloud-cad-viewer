import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
import { AcDbFontInfo } from '@mlightcad/data-model';
/**
 * Editable fields of a text style as shown in the Text Style dialog (STYLE / ST).
 * Mirrors {@link AcDbTextStyleTableRecord} properties in a UI-friendly shape.
 */
export interface TextStyleFormState {
    /** Primary font file name or mesh font identifier (`fileName` / `textStyle.font`). */
    font: string;
    /** Selected mesh font variant; equals {@link font} for SHX fonts. */
    fontStyle: string;
    /** Whether a companion SHX big font is enabled for double-byte character support. */
    useBigFont: boolean;
    /** Big font file name when {@link useBigFont} is true (`bigFontFileName`). */
    bigFont: string;
    /** Default text height for new text entities (`textSize`). */
    textHeight: number;
    /** Mirror text upside down (text generation flag bit 2; ignored when {@link vertical} is true). */
    upsideDown: boolean;
    /** Mirror text backwards / right-to-left (text generation flag bit 1). */
    backwards: boolean;
    /** Stack characters vertically (`isVertical`). */
    vertical: boolean;
    /** Horizontal scale factor (`xScale`); minimum clamped to 0.01. */
    widthFactor: number;
    /** Oblique angle in degrees (`obliquingAngle`). */
    obliqueAngle: number;
}
/**
 * Select-option entry for font dropdowns in the Text Style dialog.
 */
export interface FontOption {
    /** Font identifier stored in the form (primary name from {@link AcDbFontInfo.name}). */
    value: string;
    /** Display label, preferring the source file path when available. */
    label: string;
    /** Font backend type: SHX vector font or mesh (TrueType) font. */
    type: 'shx' | 'mesh';
}
/**
 * Sample string used to preview the active text style in the dialog UI.
 */
export declare const TEXT_STYLE_PREVIEW = "AaBbYyZz123";
/**
 * Composable for the Text Style dialog (STYLE / ST command).
 *
 * Manages the text style list, current drawing text style, reactive edit form,
 * font option derivation, and CRUD operations against `textStyleTable`.
 *
 * @param editor - Document manager providing the active database and font catalog.
 * Defaults to {@link AcApDocManager.instance}.
 *
 * @returns Reactive state, computed UI helpers, and mutation handlers for the dialog.
 */
export declare function useTextStyle(editor?: AcApDocManager): {
    /** Preview sample string constant for the dialog. */
    TEXT_STYLE_PREVIEW: string;
    /** All text style names in the active drawing. */
    styleNames: import('vue').Ref<string[], string[]>;
    /** Name of the style selected in the dialog list. */
    selectedName: import('vue').Ref<string, string>;
    /** Name of the drawing's current TEXTSTYLE. */
    currentStyleName: import('vue').Ref<string, string>;
    /** Available fonts from the editor. */
    fontInfos: import('vue').Ref<{
        name: string[];
        file: string;
        type: "mesh" | "shx";
        url: string;
    }[], AcDbFontInfo[] | {
        name: string[];
        file: string;
        type: "mesh" | "shx";
        url: string;
    }[]>;
    /** Reactive form bound to the selected style's properties. */
    form: {
        font: string;
        fontStyle: string;
        useBigFont: boolean;
        bigFont: string;
        textHeight: number;
        upsideDown: boolean;
        backwards: boolean;
        vertical: boolean;
        widthFactor: number;
        obliqueAngle: number;
    };
    /** Primary font dropdown options. */
    fontOptions: import('vue').ComputedRef<FontOption[]>;
    /** Big-font dropdown options (SHX only). */
    bigFontOptions: import('vue').ComputedRef<FontOption[]>;
    /** Whether the mesh font-style sub-selector is visible. */
    fontStyleEnabled: import('vue').ComputedRef<boolean>;
    /** Mesh font face names for the selected font. */
    fontStyleOptions: import('vue').ComputedRef<string[]>;
    /** Whether big-font controls are enabled. */
    bigFontSupported: import('vue').ComputedRef<boolean>;
    /** Whether the selected style may be deleted. */
    canDelete: import('vue').ComputedRef<boolean>;
    /** Whether "Set Current" is enabled. */
    canSetCurrent: import('vue').ComputedRef<boolean>;
    /** Inline CSS for the style preview line. */
    previewStyle: import('vue').ComputedRef<Record<string, string>>;
    /** Initializes state when the dialog opens. */
    openDialog: () => void;
    /** Reloads the form from the database, discarding edits. */
    revertForm: () => void;
    /** Selects a style and loads it into the form. */
    selectStyle: (name: string) => void;
    /** Handles primary font selection changes. */
    handleFontChange: (font: string) => void;
    /** Handles mesh font face selection changes. */
    handleFontStyleChange: (style: string) => void;
    /** Saves form edits to the selected style record. */
    saveSelectedStyle: () => boolean;
    /** Sets the selected style as the drawing TEXTSTYLE. */
    setCurrentStyle: () => boolean;
    /** Creates a new text style with the given name. */
    addStyle: (name: string) => boolean;
    /** Deletes the selected text style. */
    deleteSelectedStyle: () => boolean;
    /**
     * Validates a proposed new style name against current drawing styles.
     *
     * @param name - Proposed style name.
     */
    isValidNewTextStyleName: (name: string) => boolean;
};
//# sourceMappingURL=useTextStyle.d.ts.map