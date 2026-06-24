import { AcEdCommandEventArgs } from '@mlightcad/cad-simple-viewer';
import { RibbonTabModel } from '@mlightcad/ribbon';
import { Ref } from 'vue';
/**
 * Minimal translation callback used while constructing ribbon model labels.
 *
 * @param key Locale message key.
 * @returns Localized string for the active locale.
 */
type Translate = (key: string) => string;
/**
 * Options required to coordinate the MText contextual ribbon with the shared
 * ribbon tab state.
 */
interface UseMTextContextualRibbonOptions {
    /** Currently active ribbon tab id shared by the main ribbon shell. */
    activeTabId: Ref<string>;
}
/**
 * Creates the contextual ribbon controller for inline MTEXT editing.
 *
 * The controller observes the active MText input box, mirrors its current
 * character/paragraph state into ribbon controls, translates ribbon item ids
 * back into editor operations, and builds the contextual tab model used by the
 * ribbon renderer.
 *
 * @param options Shared ribbon tab state.
 * @returns Handlers and state consumed by the ribbon command host.
 */
export declare function useMTextContextualRibbon({ activeTabId }: UseMTextContextualRibbonOptions): {
    isVisible: Ref<boolean, boolean>;
    isCommandActive: Ref<boolean, boolean>;
    handleCommandWillStart: (args: AcEdCommandEventArgs) => void;
    handleCommandEnded: (args: AcEdCommandEventArgs) => void;
    handleItem: (itemId: string) => boolean;
    buildContextualTab: (t: Translate) => RibbonTabModel;
    characterMapVisible: Ref<boolean, boolean>;
    characterMapFontOptions: import('vue').ComputedRef<string[]>;
    characterMapInitialFont: import('vue').ComputedRef<string>;
    handleCharacterMapInsert: (payload: {
        fontFamily: string;
        text: string;
    }) => Promise<void>;
};
export {};
//# sourceMappingURL=useMTextContextualRibbon.d.ts.map