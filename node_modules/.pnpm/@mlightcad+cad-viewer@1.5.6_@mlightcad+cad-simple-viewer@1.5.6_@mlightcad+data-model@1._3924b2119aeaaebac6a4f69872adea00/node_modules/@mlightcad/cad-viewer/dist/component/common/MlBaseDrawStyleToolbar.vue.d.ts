import { AcCmColor, AcGiLineWeight } from '@mlightcad/data-model';
/**
 * =============================================================
 * MlBaseDrawStyleToolbar
 * =============================================================
 *
 * Stateless, UI-only draw style toolbar.
 *
 * - No knowledge of layers or entities
 * - Emits pure style change events
 * - Can be composed by layer/entity toolbars
 */
/**
 * =============================================================
 * Props
 * =============================================================
 */
type __VLS_Props = {
    /** Current draw color */
    color?: AcCmColor;
    /** CSS color string for preview */
    cssColor?: string;
    /** Current line weight */
    lineWeight: AcGiLineWeight;
    /** Disable entire toolbar */
    disabled?: boolean;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        prefix?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "color-change": (v: AcCmColor | undefined) => void;
    "lineweight-change": (v: AcGiLineWeight) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    "onColor-change"?: ((v: AcCmColor | undefined) => any) | undefined;
    "onLineweight-change"?: ((v: AcGiLineWeight) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
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
//# sourceMappingURL=MlBaseDrawStyleToolbar.vue.d.ts.map