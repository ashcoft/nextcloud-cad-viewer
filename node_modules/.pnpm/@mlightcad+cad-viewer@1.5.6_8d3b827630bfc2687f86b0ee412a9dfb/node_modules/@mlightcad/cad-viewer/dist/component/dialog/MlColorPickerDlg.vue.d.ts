import { AcCmColor } from '@mlightcad/data-model';
/**
 * Props
 */
type __VLS_Props = {
    modelValue: boolean;
    color?: string;
    title: string;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (v: boolean) => void;
    ok: (v: AcCmColor) => void;
    cancel: (v: undefined) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    onOk?: ((v: AcCmColor) => any) | undefined;
    onCancel?: ((v: undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((v: boolean) => any) | undefined;
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
//# sourceMappingURL=MlColorPickerDlg.vue.d.ts.map