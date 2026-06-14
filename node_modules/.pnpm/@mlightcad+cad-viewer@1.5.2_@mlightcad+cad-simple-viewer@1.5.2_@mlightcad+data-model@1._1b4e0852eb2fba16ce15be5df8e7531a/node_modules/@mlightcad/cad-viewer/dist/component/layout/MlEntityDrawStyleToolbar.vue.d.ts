import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
import { AcCmColor, AcGiLineWeight } from '@mlightcad/data-model';
/**
 * =============================================================
 * EntityDrawStyleToolbar
 * =============================================================
 *
 * Draw style toolbar for newly created entities.
 *
 * - Does NOT mutate layers
 * - Maintains local draw style state
 * - Uses current layer only as context / label
 */
/**
 * =============================================================
 * Props
 * =============================================================
 */
type __VLS_Props = {
    editor: AcApDocManager | null;
};
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "style-change": (v: {
        color: AcCmColor;
        lineWeight: AcGiLineWeight;
    }) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_Props>>> & Readonly<{
    "onStyle-change"?: ((v: {
        color: AcCmColor;
        lineWeight: AcGiLineWeight;
    }) => any) | undefined;
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
//# sourceMappingURL=MlEntityDrawStyleToolbar.vue.d.ts.map