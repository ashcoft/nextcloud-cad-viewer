/**
 * Public props for {@link MlCharacterMapDialog} (character map modal).
 *
 * @remarks
 * Parents typically bind `v-model` to `modelValue` and pass the same font name
 * list used by MTEXT so the dropdown stays consistent with the editor.
 */
export interface MlCharacterMapDialogProps {
    /**
     * Controls dialog visibility; use with `v-model` / `update:modelValue`.
     */
    modelValue: boolean;
    /**
     * Display names for the font selector (drawing-resolved font families).
     */
    fontOptions: string[];
    /**
     * Font to pre-select when the dialog opens. When empty after trim, the first
     * entry in {@link MlCharacterMapDialogProps.fontOptions} is used.
     */
    initialFont?: string;
}
/**
 * Payload for the `insert` event: text to place in the document and the font
 * family that should apply to that insertion.
 *
 * @remarks
 * `text` may contain multiple scalar characters if the user built a string in
 * the copy buffer; callers should apply `fontFamily` consistently with MTEXT
 * formatting rules.
 */
export interface MlCharacterMapInsertPayload {
    /**
     * Trimmed drawing font family name matching the user’s selection in the map.
     */
    fontFamily: string;
    /**
     * UTF-16 string to insert (from grid selection, buffer, or combined picks).
     */
    text: string;
}
/**
 * Emits supported by {@link MlCharacterMapDialog}.
 *
 * @remarks
 * - `update:modelValue` — standard dialog visibility sync.
 * - `insert` — user confirmed; parent should insert `payload.text` with `payload.fontFamily`.
 */
export type MlCharacterMapDialogEmits = {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'insert', payload: MlCharacterMapInsertPayload): void;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<MlCharacterMapDialogProps>, {
    initialFont: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => void;
    insert: (payload: MlCharacterMapInsertPayload) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<MlCharacterMapDialogProps>, {
    initialFont: string;
}>>> & Readonly<{
    onInsert?: ((payload: MlCharacterMapInsertPayload) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    initialFont: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_PrettifyLocal<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
//# sourceMappingURL=MlCharacterMapDialog.vue.d.ts.map