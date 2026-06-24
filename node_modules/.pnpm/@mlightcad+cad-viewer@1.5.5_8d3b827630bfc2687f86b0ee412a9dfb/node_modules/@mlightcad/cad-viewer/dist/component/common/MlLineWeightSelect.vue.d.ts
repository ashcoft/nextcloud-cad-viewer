import { AcGiLineWeight } from '@mlightcad/data-model';
/**
 * Props accepted by the line weight select component.
 */
interface LineWeightSelectProps {
    /** Currently selected line weight value. */
    modelValue?: AcGiLineWeight;
    /** Disables selection while the surrounding ribbon is unavailable. */
    disabled?: boolean;
    /** Placeholder shown when no line weight can be resolved. */
    placeholder?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LineWeightSelectProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: AcGiLineWeight) => void;
    change: (value: AcGiLineWeight) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LineWeightSelectProps>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: AcGiLineWeight) => any) | undefined;
    onChange?: ((value: AcGiLineWeight) => any) | undefined;
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
//# sourceMappingURL=MlLineWeightSelect.vue.d.ts.map