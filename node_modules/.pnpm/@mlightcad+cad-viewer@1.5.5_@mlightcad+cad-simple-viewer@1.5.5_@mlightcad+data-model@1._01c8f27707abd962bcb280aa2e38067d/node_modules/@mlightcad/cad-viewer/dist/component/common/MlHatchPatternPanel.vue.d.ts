import { HatchPatternOption } from './hatchPatternPreview';
/**
 * Props accepted by the hatch pattern panel.
 */
interface HatchPatternPanelProps {
    /** Currently selected hatch pattern name. */
    modelValue?: string;
    /** Patterns displayed inside the grid panel. */
    options?: HatchPatternOption[];
    /** Disables selection interactions. */
    disabled?: boolean;
    /** Accessibility label announced for the picker listbox. */
    ariaLabel?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<HatchPatternPanelProps>, {
    modelValue: string;
    options: () => HatchPatternOption[];
    disabled: boolean;
    ariaLabel: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    select: (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<HatchPatternPanelProps>, {
    modelValue: string;
    options: () => HatchPatternOption[];
    disabled: boolean;
    ariaLabel: string;
}>>> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    options: HatchPatternOption[];
    modelValue: string;
    disabled: boolean;
    ariaLabel: string;
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
//# sourceMappingURL=MlHatchPatternPanel.vue.d.ts.map