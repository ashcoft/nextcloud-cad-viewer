import { AcCmColor } from '@mlightcad/data-model';
type __VLS_Props = {
    modelValue?: AcCmColor;
    displayColor?: string;
    disabled?: boolean;
    teleported?: boolean;
    popperClass?: string;
    closeOnChange?: boolean;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        reference?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_Props>, {
    modelValue: undefined;
    displayColor: undefined;
    disabled: boolean;
    teleported: boolean;
    popperClass: undefined;
    closeOnChange: boolean;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => void;
    "update:modelValue": (value: AcCmColor | undefined) => void;
    change: (value: AcCmColor | undefined) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_Props>, {
    modelValue: undefined;
    displayColor: undefined;
    disabled: boolean;
    teleported: boolean;
    popperClass: undefined;
    closeOnChange: boolean;
}>>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: AcCmColor | undefined) => any) | undefined;
    onChange?: ((value: AcCmColor | undefined) => any) | undefined;
}>, {
    modelValue: AcCmColor;
    disabled: boolean;
    displayColor: string;
    teleported: boolean;
    popperClass: string;
    closeOnChange: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
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
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
//# sourceMappingURL=MlColorPickerDropdown.vue.d.ts.map