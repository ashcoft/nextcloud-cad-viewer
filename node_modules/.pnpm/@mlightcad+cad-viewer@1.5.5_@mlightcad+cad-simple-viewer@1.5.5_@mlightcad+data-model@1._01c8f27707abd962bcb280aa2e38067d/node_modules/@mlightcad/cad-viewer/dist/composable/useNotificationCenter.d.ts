/**
 * Identifies the subsystem or feature that produced a notification.
 *
 * Used to group related notifications and remove them selectively (for example,
 * when the underlying issue is resolved) without clearing unrelated entries.
 *
 * @remarks
 * Currently only `font-missed` is defined. Additional sources may be added as
 * new notification producers are integrated.
 */
export type NotificationSource = 'font-missed';
/**
 * A single notification entry displayed in the notification center panel.
 *
 * Notifications are ordered by insertion time (newest first) and may include
 * optional action buttons and auto-dismiss behavior.
 */
export interface Notification {
    /** Unique identifier assigned automatically when the notification is created. */
    id: string;
    /** Visual severity and icon category (`info`, `warning`, `error`, or `success`). */
    type: 'info' | 'warning' | 'error' | 'success';
    /** Short headline shown in the notification header. */
    title: string;
    /** Optional longer description body; omitted for title-only toasts. */
    message?: string;
    /** Time the notification was created. */
    timestamp: Date;
    /** Optional buttons that invoke callbacks when clicked. */
    actions?: NotificationAction[];
    /**
     * When `true`, the notification is not auto-dismissed and must be closed
     * manually or via {@link NotificationCenter.remove}.
     */
    persistent?: boolean;
    /**
     * Auto-dismiss delay in milliseconds.
     * Ignored when {@link Notification.persistent | persistent} is `true`.
     */
    timeout?: number;
    /**
     * Groups related notifications for selective removal
     * (e.g. resolved missed-font alerts).
     */
    source?: NotificationSource;
    /**
     * Font names referenced by this notification; used by
     * {@link NotificationCenter.removeResolvedFontMissedNotifications} to clear
     * entries when those fonts are no longer missing.
     */
    fontNames?: string[];
}
/**
 * A clickable action rendered as a button on a notification.
 */
export interface NotificationAction {
    /** Button label text displayed to the user. */
    label: string;
    /** Callback invoked when the user clicks the button. */
    action: () => void;
    /** When `true`, renders the button with primary (emphasized) styling. */
    primary?: boolean;
}
/**
 * Composable that exposes the global notification center.
 *
 * Provides a centralized notification system similar to Visual Studio Code.
 * All returned state is reactive; multiple callers share the same underlying list.
 *
 * @returns Notification management functions and reactive state.
 *
 * @example
 * ```typescript
 * import { useNotificationCenter } from '@mlightcad/cad-viewer'
 *
 * const { info, warning, error, success, notifications, unreadCount } = useNotificationCenter()
 *
 * // Add different types of notifications
 * info('Information', 'This is an info message')
 * warning('Warning', 'This is a warning message')
 * error('Error', 'This is an error message')
 * success('Success', 'This is a success message')
 *
 * // Add notification with actions
 * error('File Error', 'Failed to load file', {
 *   actions: [
 *     { label: 'Retry', action: () => retryLoad(), primary: true },
 *     { label: 'Cancel', action: () => cancel() }
 *   ],
 *   persistent: true
 * })
 *
 * // Check notification count
 * console.log(`You have ${unreadCount.value} notifications`)
 * ```
 */
export declare function useNotificationCenter(): {
    /** Reactive list of all notifications, ordered newest first. */
    notifications: import('vue').ComputedRef<{
        id: string;
        type: "info" | "warning" | "error" | "success";
        title: string;
        message?: string
        /** Time the notification was created. */
         | undefined;
        timestamp: Date;
        actions?: {
            label: string;
            action: () => void;
            primary?: boolean | undefined;
        }[] | undefined;
        persistent?: boolean
        /**
         * Auto-dismiss delay in milliseconds.
         * Ignored when {@link Notification.persistent | persistent} is `true`.
         */
         | undefined;
        timeout?: number
        /**
         * Groups related notifications for selective removal
         * (e.g. resolved missed-font alerts).
         */
         | undefined;
        source?: NotificationSource
        /**
         * Font names referenced by this notification; used by
         * {@link NotificationCenter.removeResolvedFontMissedNotifications} to clear
         * entries when those fonts are no longer missing.
         */
         | undefined;
        fontNames?: string[] | undefined;
    }[]>;
    /** Reactive count of active notifications. */
    unreadCount: import('vue').ComputedRef<number>;
    /** Reactive boolean; `true` when at least one notification exists. */
    hasNotifications: import('vue').ComputedRef<boolean>;
    /** Creates and prepends a custom notification. Returns the new notification ID. */
    add: (notification: Omit<Notification, "id" | "timestamp">) => string;
    /** Removes a notification by ID. No-op if the ID is not found. */
    remove: (id: string) => void;
    /** Removes all notifications from the center. */
    clear: () => void;
    /** Alias for {@link NotificationCenter.clear}. */
    clearAll: () => void;
    /** Removes notifications for which the predicate returns `true`. */
    removeWhere: (predicate: (notification: Notification) => boolean) => void;
    /** Removes all notifications tagged with the given {@link NotificationSource}. */
    removeBySource: (source: NotificationSource) => void;
    /** Removes resolved `font-missed` notifications based on the current missed-font set. */
    removeResolvedFontMissedNotifications: (missedFontNames: Iterable<string>) => void;
    /** Adds an informational notification. Returns the new notification ID. */
    info: (title: string, message?: string, options?: Partial<Notification>) => string;
    /** Adds a warning notification. Returns the new notification ID. */
    warning: (title: string, message?: string, options?: Partial<Notification>) => string;
    /** Adds an error notification (persistent by default). Returns the new notification ID. */
    error: (title: string, message?: string, options?: Partial<Notification>) => string;
    /** Adds a success notification. Returns the new notification ID. */
    success: (title: string, message?: string, options?: Partial<Notification>) => string;
};
//# sourceMappingURL=useNotificationCenter.d.ts.map