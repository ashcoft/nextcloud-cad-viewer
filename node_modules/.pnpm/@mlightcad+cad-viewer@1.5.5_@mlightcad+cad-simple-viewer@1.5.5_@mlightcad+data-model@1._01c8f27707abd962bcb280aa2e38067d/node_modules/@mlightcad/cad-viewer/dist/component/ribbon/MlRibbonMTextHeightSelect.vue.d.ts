interface RibbonMTextHeightSelectProps {
    modelValue?: number;
    options?: number[];
    disabled?: boolean;
    placeholder?: string;
    controlWidth?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<RibbonMTextHeightSelectProps>, {
    modelValue: undefined;
    options: () => number[];
    disabled: boolean;
    placeholder: string;
    controlWidth: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: number) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<RibbonMTextHeightSelectProps>, {
    modelValue: undefined;
    options: () => number[];
    disabled: boolean;
    placeholder: string;
    controlWidth: string;
}>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {
    options: number[];
    placeholder: string;
    modelValue: number;
    disabled: boolean;
    controlWidth: string;
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
//# sourceMappingURL=MlRibbonMTextHeightSelect.vue.d.ts.map