export declare const registerCmds: () => void;
export declare const registerDialogs: () => void;
export declare const registerMTextColorPicker: () => void;
/**
 * Registers lazy plugins that load on first use of their trigger commands.
 *
 * Currently registers the PDF plugin (`cpdf`, `ipdf`), the HTML export
 * plugin (`chtml`), and the SVG export plugin (`csvg`), which are fetched
 * only when one of those commands runs.
 * Safe to call multiple times; registration runs once per application lifetime.
 */
export declare const registerLazyPlugins: () => void;
//# sourceMappingURL=register.d.ts.map