import { Component, DefineComponent } from 'vue';
export type MlIconType = (() => DefineComponent) | Component;
/**
 * Data to descibe toggle button
 */
export interface MlToggleButtonData {
    /**
     * Icon used when button is 'on'
     */
    onIcon: MlIconType;
    /**
     * Icon used when button is 'off'.
     */
    offIcon: MlIconType;
    /**
     * Tooltip when button is 'on'
     */
    onTooltip: string;
    /**
     * Tooltip when button is 'off'
     */
    offTooltip: string;
    /**
     * Icon color when button is 'on'
     */
    onColor?: string;
    /**
     * Icon color when button is 'off'
     */
    offColor?: string;
}
/**
 * Properties of MlToggleButton component
 */
interface Props {
    /**
     * Button size
     */
    size?: number | string;
    /**
     * Data to descibe toggle button
     */
    data: MlToggleButtonData;
}
type __VLS_Props = Props;
declare const __VLS_defaults: {
    modelValue: boolean;
};
type __VLS_PublicProps = {
    modelValue?: typeof __VLS_defaults['modelValue'];
} & __VLS_Props;
declare const _default: DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_PublicProps>, {
    size: number;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    click: (state: boolean) => void;
    "update:modelValue": (value: boolean) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_PublicProps>, {
    size: number;
}>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onClick?: ((state: boolean) => any) | undefined;
}>, {
    size: number | string;
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
//# sourceMappingURL=MlToggleButton.vue.d.ts.map