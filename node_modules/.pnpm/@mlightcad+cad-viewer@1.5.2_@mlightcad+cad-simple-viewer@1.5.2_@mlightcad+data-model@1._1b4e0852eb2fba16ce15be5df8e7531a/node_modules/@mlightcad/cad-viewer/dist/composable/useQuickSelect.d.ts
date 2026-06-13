import { AcDbObjectId } from '@mlightcad/data-model';
/**
 * Input scope for Quick Select:
 * - entireDrawing: use all entities in model space as filter source
 * - currentSelection: use only currently selected entities as filter source
 */
export type MlQuickSelectApplyTo = 'entireDrawing' | 'currentSelection';
/**
 * Properties supported by Quick Select filtering.
 * All values are read directly from AcDbEntity fields.
 */
export type MlQuickSelectProperty = 'objectType' | 'layer' | 'color' | 'lineType' | 'lineWeight';
/**
 * Operators supported by Quick Select.
 * - String properties: equals / notEquals
 * - Numeric properties (currently lineWeight): full comparison operators
 */
export type MlQuickSelectOperator = 'equals' | 'notEquals' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual';
/**
 * How Quick Select applies results to the active selection set.
 * - set: replace current selection with matched results
 * - add: append matched results to current selection
 * - remove: remove matched results from current selection
 */
export type MlQuickSelectSelectionMode = 'set' | 'add' | 'remove';
/** Full criteria payload for Quick Select. */
export interface MlQuickSelectCriteria {
    /** Source scope (entire drawing or current selection) */
    applyTo: MlQuickSelectApplyTo;
    /** Optional object type constraint; undefined means no type filter */
    objectType?: string;
    /** Target property used for comparison */
    property: MlQuickSelectProperty;
    /** Comparison operator */
    operator: MlQuickSelectOperator;
    /** Target value (UI sends string; numeric properties are parsed internally) */
    value: string;
    /** How matched results are applied to selection set */
    selectionMode: MlQuickSelectSelectionMode;
}
/** Result of a Quick Select execution. */
export interface MlQuickSelectResult {
    /** Number of source objects used for filtering */
    sourceCount: number;
    /** Number of objects that satisfy criteria */
    matchedCount: number;
    /** Object IDs that satisfy criteria */
    matchedIds: AcDbObjectId[];
}
/**
 * Returns deduplicated, sorted object types for UI dropdown.
 */
export declare function getQuickSelectObjectTypes(applyTo: MlQuickSelectApplyTo): string[];
/**
 * Returns candidate values for a property (used by UI Value dropdown).
 *
 * @param applyTo - source scope (entire drawing / current selection)
 * @param property - target property
 * @param objectType - optional type filter
 * @returns deduplicated string values; numeric values sorted numerically
 */
export declare function getQuickSelectPropertyValues(applyTo: MlQuickSelectApplyTo, property: MlQuickSelectProperty, objectType?: string): string[];
/**
 * Counts matched objects without mutating selection set.
 * Typically used for live preview in the dialog.
 */
export declare function getQuickSelectMatchedCount(criteria: MlQuickSelectCriteria): number;
/**
 * Returns source count (optionally pre-filtered by object type).
 * Used to show total candidate objects in UI.
 */
export declare function getQuickSelectSourceCount(applyTo: MlQuickSelectApplyTo, objectType?: string): number;
/**
 * Executes Quick Select and applies results to active selection set.
 *
 * Modes:
 * - set: clear current selection, then add all matches
 * - add: add only matches not already selected
 * - remove: remove only matches that are currently selected
 *
 * @returns source count, matched count, and matched object IDs
 */
export declare function applyQuickSelect(criteria: MlQuickSelectCriteria): MlQuickSelectResult;
//# sourceMappingURL=useQuickSelect.d.ts.map