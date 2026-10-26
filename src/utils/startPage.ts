/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

/**
 * Create a blank DXF drawing on the server and return its file id.
 *
 * @param name Requested file name; the server sanitises it and adds `.dxf`.
 * @throws When the request fails or the response carries no file id.
 */
export async function createBlankDrawing(name: string): Promise<number> {
  // A type assertion is used instead of a generic call argument: Babel's
  // TypeScript transform leaves call type arguments in place under some
  // dependency layouts, which then makes Jest fail to parse the module.
  const response = (await axios.post(
    generateUrl('/apps/cad_viewer/api/blank'),
    { name },
  )) as { data?: { fileId?: unknown } }

  const fileId = response.data?.fileId
  if (typeof fileId !== 'number') {
    throw new TypeError('The server did not return a file id')
  }

  return fileId
}

/**
 * Pick a human readable message for a failed request.
 *
 * Nextcloud returns `{ error: "..." }` for application errors; anything else
 * (network failure, HTML error page) falls back to the caller's translated
 * message.
 */
export function requestErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { error?: unknown } } } | null)
    ?.response?.data?.error

  return typeof message === 'string' && message !== '' ? message : fallback
}
