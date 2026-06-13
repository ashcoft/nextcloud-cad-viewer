import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
/**
 * =============================================================
 * MlLayerDrawStyleToolbar
 * =============================================================
 *
 * Layer-driven draw style toolbar.
 *
 * - Layer is the source of truth
 * - Color & line width edits update the CURRENT layer
 * - Actual layer mutation is delegated to external logic
 */
/**
 * =============================================================
 * Props
 * =============================================================
 */
type __VLS_Props = {
    editor: AcApDocManager;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "layer-change": (v: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    "onLayer-change"?: ((v: string) => any) | undefined;
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
//# sourceMappingURL=MlLayerDrawStyleToolbar.vue.d.ts.map