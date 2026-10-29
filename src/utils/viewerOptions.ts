/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

import type { CADViewerOptions } from './cadLoader'
import type { LoadResponse } from '../types/loadResponse'

/**
 * Options the viewer is mounted with for a loaded drawing.
 *
 * Centralised because App.vue mounts the viewer twice (first load and retry)
 * and both call sites must apply the same admin-configured theme.
 */
export function viewerOptionsFor(
  meta: LoadResponse,
  file: File,
): Pick<CADViewerOptions, 'localFile' | 'fileName' | 'theme'> {
  return {
    localFile: file,
    fileName: meta.name,
    theme: meta.theme,
  }
}
