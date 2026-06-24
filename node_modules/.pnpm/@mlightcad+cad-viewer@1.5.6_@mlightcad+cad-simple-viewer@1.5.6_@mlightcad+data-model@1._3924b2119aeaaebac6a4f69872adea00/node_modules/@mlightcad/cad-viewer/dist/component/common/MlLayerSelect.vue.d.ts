/**
 * Render-ready layer entry shown by the select control.
 */
interface LayerSelectOption {
    value: string;
    name: string;
    cssColor: string;
    isOn: boolean;
    isLocked: boolean;
    isFrozen: boolean;
    lineType?: string;
}
type LayerStateKey = 'on' | 'frozen' | 'locked';
interface LayerSelectProps {
    modelValue?: string;
    options: LayerSelectOption[];
    disabled?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LayerSelectProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    change: (value: string) => void;
    "layer-state-toggle": (payload: {
        layerName: string;
        state: LayerStateKey;
    }) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LayerSelectProps>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    "onLayer-state-toggle"?: ((payload: {
        layerName: string;
        state: LayerStateKey;
    }) => any) | undefined;
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
//# sourceMappingURL=MlLayerSelect.vue.d.ts.map