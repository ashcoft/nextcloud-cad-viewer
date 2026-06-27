import { AcEdOpenMode } from '@mlightcad/cad-simple-viewer';
export interface CommandInfo {
    globalName: string;
    commandName: string;
    groupName: string;
    mode: AcEdOpenMode;
}
export declare function useCommands(): import('vue').Reactive<CommandInfo[]>;
//# sourceMappingURL=useCommands.d.ts.map