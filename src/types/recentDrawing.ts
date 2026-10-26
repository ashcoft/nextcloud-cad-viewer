/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

/**
 * A drawing listed on the CAD Viewer start page.
 *
 * Produced by `RecentDrawingsService` on the server and embedded into the page
 * as JSON, so the shape must stay in sync with that service.
 */
export interface RecentDrawing {
  id: number
  name: string
  /** Path relative to the user's files root, e.g. `/Projects/plan.dwg`. */
  path: string
  /** Lower-case file extension, `dwg` or `dxf`. */
  extension: string
  /** Modification time as a Unix timestamp in seconds. */
  mtime: number
}
