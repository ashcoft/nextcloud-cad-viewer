import { Ref } from 'vue';
/**
 * Viewport-relative rectangle of the current viewer host element.
 *
 * The values come from `getBoundingClientRect()`, so they are expressed in
 * CSS pixels relative to the browser viewport rather than the document.
 */
export interface ViewerRect {
    top: number;
    left: number;
    width: number;
    height: number;
}
/**
 * Creates and provides a reactive viewport rectangle for a viewer host element.
 *
 * This function is meant to be called once near the root of a viewer subtree,
 * typically from the main viewer component that owns the container element.
 * It measures the target element with `getBoundingClientRect()`, keeps the
 * result synchronized as layout changes, and exposes that state to descendants
 * through Vue's dependency injection.
 *
 * Synchronization happens in three situations:
 * 1. When the target element starts existing.
 * 2. When the target element is resized.
 * 3. When the browser window is resized.
 *
 * Descendants can then consume the provided state with {@link useViewerRect}
 * without prop drilling through intermediate components.
 *
 * @param targetRef - Ref pointing at the viewer host element to observe.
 * @returns A readonly reactive ref containing the latest viewer rectangle.
 */
export declare function provideViewerRect(targetRef: Ref<HTMLElement | undefined>): Readonly<Ref<{
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}, {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}>>;
/**
 * Returns the reactive rectangle of the current viewer subtree.
 *
 * This function reads the rectangle previously registered by
 * {@link provideViewerRect}. It is intended for floating panels, overlays, and
 * other layout-aware descendants that need to align themselves to the current
 * viewer host element.
 *
 * When no provider exists in the current component tree, the function returns
 * a shared readonly zero rectangle as a safe fallback. That behavior keeps the
 * API easy to consume in optional or test-only contexts without forcing every
 * caller to guard for `undefined`.
 *
 * @returns A readonly reactive ref containing the current viewer rectangle, or
 * a zero rectangle when no provider is available.
 */
export declare function useViewerRect(): Readonly<Ref<{
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}, {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}>>;
//# sourceMappingURL=useViewerRect.d.ts.map