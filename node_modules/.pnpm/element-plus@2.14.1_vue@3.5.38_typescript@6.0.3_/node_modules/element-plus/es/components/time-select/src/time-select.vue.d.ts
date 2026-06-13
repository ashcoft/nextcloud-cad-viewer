import { IconPropType } from "../../../utils/vue/icon.js";
import { PopperEffect } from "../../popper/src/popper.js";
import { TimeSelectProps } from "./time-select.js";
import * as _$vue from "vue";

//#region ../../packages/components/time-select/src/time-select.vue.d.ts
declare const __VLS_export: _$vue.DefineComponent<TimeSelectProps, {
  /**
   * @description blur the Input component
   */
  blur: () => void;
  /**
   * @description focus the Input component
   */
  focus: () => void;
}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
  "update:modelValue": (...args: any[]) => void;
  change: (...args: any[]) => void;
  focus: (...args: any[]) => void;
  blur: (...args: any[]) => void;
  clear: (...args: any[]) => void;
}, string, _$vue.PublicProps, Readonly<TimeSelectProps> & Readonly<{
  "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
  onChange?: ((...args: any[]) => any) | undefined;
  onFocus?: ((...args: any[]) => any) | undefined;
  onBlur?: ((...args: any[]) => any) | undefined;
  onClear?: ((...args: any[]) => any) | undefined;
}>, {
  disabled: boolean;
  clearable: boolean;
  clearIcon: IconPropType;
  prefixIcon: IconPropType;
  end: string;
  start: string;
  valueOnClear: string | number | boolean | Function | null;
  effect: PopperEffect;
  popperClass: string;
  popperStyle: string | _$vue.CSSProperties;
  editable: boolean;
  format: string;
  step: string;
}, {}, {}, {}, string, _$vue.ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
//#endregion
export { _default as default };