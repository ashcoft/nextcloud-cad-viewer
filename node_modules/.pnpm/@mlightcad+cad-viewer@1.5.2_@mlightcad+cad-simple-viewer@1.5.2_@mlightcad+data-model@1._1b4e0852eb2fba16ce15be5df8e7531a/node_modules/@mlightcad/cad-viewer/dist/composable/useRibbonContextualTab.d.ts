import { AcEdCommandEventArgs } from '@mlightcad/cad-simple-viewer';
import { Ref } from 'vue';
export interface UseRibbonContextualTabOptions {
    activeTabId: Ref<string>;
    tabId: string;
    commandGlobalNames: string | readonly string[];
    fallbackTabId?: string;
}
export declare function useRibbonContextualTab({ activeTabId, tabId, commandGlobalNames, fallbackTabId }: UseRibbonContextualTabOptions): {
    isVisible: Ref<boolean, boolean>;
    isCommandActive: Ref<boolean, boolean>;
    previousTabId: Ref<string, string>;
    isContextCommand: (args: AcEdCommandEventArgs) => boolean;
    showContextTab: () => void;
    hideContextTab: () => void;
    handleCommandWillStart: (args: AcEdCommandEventArgs) => void;
    handleCommandEnded: (args: AcEdCommandEventArgs) => void;
};
//# sourceMappingURL=useRibbonContextualTab.d.ts.map