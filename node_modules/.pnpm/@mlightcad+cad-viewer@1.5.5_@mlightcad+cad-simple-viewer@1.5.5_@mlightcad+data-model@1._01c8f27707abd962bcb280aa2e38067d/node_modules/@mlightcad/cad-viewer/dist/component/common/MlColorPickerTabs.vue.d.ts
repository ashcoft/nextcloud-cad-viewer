import { AcCmColor } from '@mlightcad/data-model';
type TabPosition = 'top' | 'right' | 'bottom' | 'left';
type __VLS_Props = {
    modelValue?: AcCmColor;
    tabPosition?: TabPosition;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_Props>, {
    modelValue: undefined;
    tabPosition: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: AcCmColor | undefined) => void;
    change: (value: AcCmColor | undefined) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_Props>, {
    modelValue: undefined;
    tabPosition: string;
}>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: AcCmColor | undefined) => any) | undefined;
    onChange?: ((value: AcCmColor | undefined) => any) | undefined;
}>, {
    modelValue: AcCmColor;
    tabPosition: TabPosition;
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
//# sourceMappingURL=MlColorPickerTabs.vue.d.ts.map