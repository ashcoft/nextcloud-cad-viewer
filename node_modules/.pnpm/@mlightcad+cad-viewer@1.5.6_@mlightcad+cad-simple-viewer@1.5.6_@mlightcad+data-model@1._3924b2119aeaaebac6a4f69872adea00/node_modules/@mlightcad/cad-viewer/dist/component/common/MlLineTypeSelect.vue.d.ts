import { Component } from 'vue';
import { LineTypeOption } from './lineTypeOptions';
/**
 * Props accepted by the line type select component.
 */
interface LineTypeSelectProps {
    /** Currently selected line type name. */
    modelValue?: string;
    /** Optional caller-provided options. Falls back to the active drawing database. */
    options?: LineTypeOption[];
    /** Disables interaction when the owning command context is read-only. */
    disabled?: boolean;
    /** Optional leading icon rendered inside the selected-value slot. */
    leadingIcon?: string | Component;
    /** Placeholder shown when no option can be resolved. */
    placeholder?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LineTypeSelectProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    change: (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LineTypeSelectProps>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
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
//# sourceMappingURL=MlLineTypeSelect.vue.d.ts.map