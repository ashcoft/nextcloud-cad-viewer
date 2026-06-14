export interface Dialog {
    name: string;
    component: any;
    props?: Record<string, any>;
    visible: boolean;
}
declare function registerDialog(dialog: Omit<Dialog, 'visible'>): void;
declare function toggleDialog(key: string, visible: boolean): void;
declare function getDialogByName(key: string): {
    name: string;
    component: any;
    props?: Record<string, any> | undefined;
    visible: boolean;
} | undefined;
export declare function useDialogManager(): {
    dialogs: import('vue').ComputedRef<import('vue').Reactive<Dialog[]>>;
    registerDialog: typeof registerDialog;
    toggleDialog: typeof toggleDialog;
    getDialogByName: typeof getDialogByName;
};
export {};
//# sourceMappingURL=useDialogManager.d.ts.map