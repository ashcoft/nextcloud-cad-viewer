import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
import { AcDbObjectId } from '@mlightcad/data-model';
export interface LayoutInfo {
    name: string;
    tabOrder: number;
    blockTableRecordId: AcDbObjectId;
    isActive: boolean;
}
export declare function useLayouts(editor: AcApDocManager): import('vue').Reactive<LayoutInfo[]>;
//# sourceMappingURL=useLayouts.d.ts.map