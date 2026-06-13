import { Component } from 'vue';
/**
 * Visual variants supported by the shared ribbon property field shell.
 */
type RibbonPropertyFieldVariant = 'color' | 'line-type' | 'line-weight';
/**
 * Props shared by ribbon property field wrappers.
 */
interface RibbonPropertyFieldProps {
    /** Icon rendered beside the embedded control. */
    icon: string | Component;
    /** Disables the field while preserving its current value display. */
    disabled?: boolean;
    /** Variant-specific styling hook used by the ribbon layout. */
    variant?: RibbonPropertyFieldVariant;
    /** Optional fixed width for the embedded control area. */
    controlWidth?: string;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyFieldProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyFieldProps>>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
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
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=MlRibbonPropertyField.vue.d.ts.map