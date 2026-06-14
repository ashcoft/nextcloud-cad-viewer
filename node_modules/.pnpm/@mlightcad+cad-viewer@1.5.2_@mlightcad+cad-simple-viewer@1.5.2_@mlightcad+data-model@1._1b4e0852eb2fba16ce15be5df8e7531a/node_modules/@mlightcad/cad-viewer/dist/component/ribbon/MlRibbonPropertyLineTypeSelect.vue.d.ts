import { LineTypeOption } from '../common/lineTypeOptions';
/**
 * Props accepted by the ribbon line type property field.
 */
interface RibbonPropertyLineTypeSelectProps {
    /** Active `CELTYPE` value mirrored from the current drawing. */
    modelValue?: string;
    /** Optional custom options used instead of querying the active database. */
    options?: LineTypeOption[];
    /** Disables interaction while document state cannot be edited. */
    disabled?: boolean;
    /** Placeholder shown when no line type can be resolved. */
    placeholder?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyLineTypeSelectProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyLineTypeSelectProps>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
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
//# sourceMappingURL=MlRibbonPropertyLineTypeSelect.vue.d.ts.map