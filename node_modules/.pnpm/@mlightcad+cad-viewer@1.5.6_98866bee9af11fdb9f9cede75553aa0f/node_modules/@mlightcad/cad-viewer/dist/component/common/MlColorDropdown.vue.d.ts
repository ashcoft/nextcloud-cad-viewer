import { AcCmColor } from '@mlightcad/data-model';
import { Component } from 'vue';
type __VLS_Props = {
    modelValue: AcCmColor | undefined;
    disabled?: boolean;
    displayColor?: string;
    leadingIcon?: string | Component;
    placeholder?: string;
    onCustomColorSelected?: (oldColor: AcCmColor | undefined) => AcCmColor | undefined | Promise<AcCmColor | undefined>;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (v: AcCmColor | undefined) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    "onUpdate:modelValue"?: ((v: AcCmColor | undefined) => any) | undefined;
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
//# sourceMappingURL=MlColorDropdown.vue.d.ts.map