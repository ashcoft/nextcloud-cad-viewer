import { HatchPatternOption } from '../common/hatchPatternPreview';
/**
 * Props accepted by the ribbon large hatch pattern dropdown button.
 */
interface RibbonHatchPatternLargeDropdownProps {
    /** Full ribbon item model injected by the ribbon host for custom items. */
    item?: {
        id?: string;
        label?: string;
    } | null;
    /** Current hatch pattern name stored in ribbon state. */
    modelValue?: string;
    /** Candidate hatch patterns available in the picker panel. */
    options?: HatchPatternOption[];
    /** Optional item id prefix emitted back to the ribbon host. */
    itemIdPrefix?: string;
    /** Optional label shown below the swatch icon. */
    label?: string;
    /** Disables trigger button and panel interactions. */
    disabled?: boolean;
    /** Callback injected by `@mlightcad/ribbon` custom item bindings. */
    emitItemClick?: (payload?: string | number | boolean) => void;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<RibbonHatchPatternLargeDropdownProps>, {
    item: null;
    modelValue: string;
    options: () => HatchPatternOption[];
    itemIdPrefix: string;
    label: undefined;
    disabled: boolean;
    emitItemClick: undefined;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    select: (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<RibbonHatchPatternLargeDropdownProps>, {
    item: null;
    modelValue: string;
    options: () => HatchPatternOption[];
    itemIdPrefix: string;
    label: undefined;
    disabled: boolean;
    emitItemClick: undefined;
}>>> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    options: HatchPatternOption[];
    modelValue: string;
    label: string;
    disabled: boolean;
    item: {
        id?: string;
        label?: string;
    } | null;
    itemIdPrefix: string;
    emitItemClick: (payload?: string | number | boolean) => void;
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
//# sourceMappingURL=MlRibbonHatchPatternButton.vue.d.ts.map