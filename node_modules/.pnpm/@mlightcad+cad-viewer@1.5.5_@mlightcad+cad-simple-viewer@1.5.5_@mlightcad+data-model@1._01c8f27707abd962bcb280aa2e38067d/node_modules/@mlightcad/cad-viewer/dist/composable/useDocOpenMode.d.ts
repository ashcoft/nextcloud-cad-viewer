import { AcEdOpenMode } from '@mlightcad/cad-simple-viewer';
/**
 * Tracks the current document open mode exposed by {@link AcApDocManager}.
 *
 * This composable is designed for UI state that needs to react as soon as a
 * new document starts opening, rather than waiting until activation finishes.
 * To achieve that it listens to `documentToBeOpened` and uses the event
 * payload's `mode` field as the source of truth during the open lifecycle.
 *
 * Behavior:
 * - Initializes from the currently active document when the viewer instance is already available
 * - Retries binding after mount when the viewer has not been created yet
 * - Keeps the returned ref synchronized with the next requested document mode
 * - Automatically removes listeners and timers when the component unmounts
 *
 * @returns A reactive ref containing the current or pending document open mode
 */
export declare function useDocOpenMode(): import('vue').Ref<AcEdOpenMode, AcEdOpenMode>;
//# sourceMappingURL=useDocOpenMode.d.ts.map