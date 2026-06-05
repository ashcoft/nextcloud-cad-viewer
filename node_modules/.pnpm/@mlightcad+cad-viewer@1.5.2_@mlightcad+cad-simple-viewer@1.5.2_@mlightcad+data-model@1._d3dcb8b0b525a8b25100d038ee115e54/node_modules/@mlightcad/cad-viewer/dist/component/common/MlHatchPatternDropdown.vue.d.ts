import { HatchPatternOption } from './hatchPatternPreview';
/**
 * Props accepted by the hatch pattern dropdown button.
 */
interface HatchPatternDropdownProps {
    /** Optional stable id applied to the ribbon button. */
    id?: string;
    /** Current hatch pattern name. */
    modelValue?: string;
    /** Candidate hatch patterns available in the picker panel. */
    options?: HatchPatternOption[];
    /** Optional value prefix applied before callback emission. */
    itemIdPrefix?: string;
    /** Disables both trigger button and panel interactions. */
    disabled?: boolean;
    /** Optional callback when the selected value changes. */
    emitItemClick?: (payload?: string | number | boolean) => void;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<HatchPatternDropdownProps>, {
    id: string;
    modelValue: string;
    options: () => HatchPatternOption[];
    itemIdPrefix: string;
    disabled: boolean;
    emitItemClick: undefined;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    select: (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<HatchPatternDropdownProps>, {
    id: string;
    modelValue: string;
    options: () => HatchPatternOption[];
    itemIdPrefix: string;
    disabled: boolean;
    emitItemClick: undefined;
}>>> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    options: HatchPatternOption[];
    modelValue: string;
    disabled: boolean;
    id: string;
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
//# sourceMappingURL=MlHatchPatternDropdown.vue.d.ts.map