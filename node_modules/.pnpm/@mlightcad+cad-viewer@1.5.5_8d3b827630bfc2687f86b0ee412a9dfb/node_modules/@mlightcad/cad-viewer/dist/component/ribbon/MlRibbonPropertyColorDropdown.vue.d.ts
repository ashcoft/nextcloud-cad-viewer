import { AcCmColor } from '@mlightcad/data-model';
/**
 * Props accepted by the ribbon color property field.
 */
interface RibbonPropertyColorDropdownProps {
    /** Active entity color mirrored from the current document state. */
    modelValue?: AcCmColor;
    /** Disables edits when the ribbon or current document is unavailable. */
    disabled?: boolean;
    /** Resolved swatch color used when symbolic CAD colors need a concrete preview. */
    displayColor?: string;
    /** Fallback label shown when no explicit color can be displayed. */
    placeholder?: string;
    /** Optional fixed width for the embedded color dropdown. */
    controlWidth?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyColorDropdownProps>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: AcCmColor | undefined) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<RibbonPropertyColorDropdownProps>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: AcCmColor | undefined) => any) | undefined;
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
//# sourceMappingURL=MlRibbonPropertyColorDropdown.vue.d.ts.map