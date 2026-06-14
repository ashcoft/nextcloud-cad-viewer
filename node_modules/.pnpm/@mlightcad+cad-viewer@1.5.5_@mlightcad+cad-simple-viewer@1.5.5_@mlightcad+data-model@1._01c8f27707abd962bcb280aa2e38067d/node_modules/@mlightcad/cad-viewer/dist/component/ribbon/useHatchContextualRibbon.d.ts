import { AcEdCommandEventArgs } from '@mlightcad/cad-simple-viewer';
import { RibbonTabModel } from '@mlightcad/ribbon';
import { Ref } from 'vue';
/**
 * Options required to coordinate the hatch contextual ribbon with the shared
 * ribbon tab state.
 */
interface UseHatchContextualRibbonOptions {
    /** Currently active ribbon tab id shared by the main ribbon shell. */
    activeTabId: Ref<string>;
    /**
     * Optional callback used when the close button exits a selection-driven hatch
     * context instead of an active HATCH command.
     */
    clearSelection?: () => void;
}
/**
 * Minimal translation callback used while constructing ribbon model labels.
 *
 * @param key Locale message key.
 * @returns Localized string for the active locale.
 */
type Translate = (key: string) => string;
/**
 * Creates the contextual ribbon controller for the HATCH workflow.
 *
 * The controller keeps the hatch contextual tab visible while either the HATCH
 * command is running or the current selection consists of hatch entities. It
 * also translates ribbon item ids into hatch command mutations and rebuilds the
 * tab model from the latest command state.
 *
 * @param options Shared tab state and optional selection clearing hook.
 * @returns Handlers and state consumed by the ribbon command host.
 */
export declare function useHatchContextualRibbon({ activeTabId, clearSelection }: UseHatchContextualRibbonOptions): {
    isVisible: Ref<boolean, boolean>;
    isCommandActive: Ref<boolean, boolean>;
    handleCommandWillStart: (args: AcEdCommandEventArgs) => void;
    handleCommandEnded: (args: AcEdCommandEventArgs) => void;
    handleSelectionContextChanged: (active: boolean) => void;
    handleItem: (itemId: string) => boolean;
    buildContextualTab: (t: Translate) => RibbonTabModel;
};
export {};
//# sourceMappingURL=useHatchContextualRibbon.d.ts.map