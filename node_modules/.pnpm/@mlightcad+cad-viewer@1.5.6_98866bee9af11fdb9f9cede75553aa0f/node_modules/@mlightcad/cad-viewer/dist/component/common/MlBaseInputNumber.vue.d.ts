/**
 * -----------------------------------------------------------------------------
 * PROPS & EMITS
 * -----------------------------------------------------------------------------
 */
type __VLS_Props = {
    /**
     * The bound numeric value (in decimal).
     */
    modelValue: number;
    /**
     * Optional input placeholder text.
     */
    placeholder?: string;
    /**
     * When false, input is readonly but user can still switch base modes.
     */
    editable?: boolean;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: number) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    onChange?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
//# sourceMappingURL=MlBaseInputNumber.vue.d.ts.map