import { AcApDocManager } from '@mlightcad/cad-simple-viewer';
import { AcDbColorTheme, AcDbDatabase } from '@mlightcad/data-model';
export declare const COLOR_THEME_SYSVAR_NAME: "COLORTHEME";
export declare const DYNAMIC_MODE_SYSVAR_NAME: "DYNMODE";
export declare const LINEWIDTH_DISPLAY_SYSVAR_NAME: "LWDISPLAY";
export declare const ORTHO_MODE_SYSVAR_NAME: "ORTHOMODE";
export declare const POLAR_MODE_SYSVAR_NAME: "POLARMODE";
export declare const POLAR_ANGLE_SYSVAR_NAME: "POLARANG";
export declare const POLAR_ADD_ANGLE_SYSVAR_NAME: "POLARADDANG";
export interface SystemVariables {
    pdmode?: number;
    pdsize?: number;
    colortheme?: AcDbColorTheme;
    dynmode?: number;
    lwdisplay?: number;
    orthomode?: number;
    polarmode?: number;
    polarang?: number;
    polaraddang?: string;
}
export declare function normalizeColorTheme(value: unknown): AcDbColorTheme;
export declare function getColorThemeFromDatabase(database: AcDbDatabase): AcDbColorTheme;
export declare function normalizeDynamicInput(value: unknown): number;
export declare function normalizeLineWidthDisplay(value: unknown): number;
export declare function normalizeOrthoMode(value: unknown): number;
export declare function normalizePolarmode(value: unknown): number;
export declare function normalizePolarang(value: unknown): number;
export declare function normalizePolaraddang(value: unknown): string;
export declare function setColorThemeForDatabase(database: AcDbDatabase, theme: AcDbColorTheme): void;
export declare function useSystemVars(editor: AcApDocManager): {
    pdmode?: number | undefined;
    pdsize?: number | undefined;
    colortheme?: AcDbColorTheme | undefined;
    dynmode?: number | undefined;
    lwdisplay?: number | undefined;
    orthomode?: number | undefined;
    polarmode?: number | undefined;
    polarang?: number | undefined;
    polaraddang?: string | undefined;
};
//# sourceMappingURL=useSystemVars.d.ts.map