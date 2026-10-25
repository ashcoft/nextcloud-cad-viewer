/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import type { LoadResponse } from '../types/loadResponse'

/**
 * A CAD file ready to hand to the viewer, or the reason it could not be read.
 */
export type CadFileResult =
  | { ok: true; meta: LoadResponse; file: File }
  | { ok: false; error: string }

/**
 * Fetch a CAD file's metadata and bytes.
 *
 * Both requests go through @nextcloud/axios so they carry the requesttoken
 * header Nextcloud requires for CSRF protection; a bare fetch() (or letting
 * the viewer fetch the URL itself) is rejected with HTTP 412.
 *
 * Server error responses (413 too large, 415 unsupported type, 404, 403, ...)
 * are returned as `error` so the caller can show the real reason instead of a
 * generic message.
 *
 * @param fileId The Nextcloud file id to load.
 */
export async function fetchCadFile(
  fileId: number | string,
): Promise<CadFileResult> {
  try {
    const url = generateUrl('/apps/cad_viewer/api/load/{fileId}', { fileId: String(fileId) })
    const metaResponse = (await axios.get(url)) as { data: LoadResponse }
    const meta = metaResponse.data

    if (meta.error) {
      return { ok: false, error: meta.error }
    }

    const blobResponse = (await axios.get(meta.url, { responseType: 'blob' })) as { data: Blob }
    const file = new File([blobResponse.data], meta.name, {
      type: meta.mimeType || 'application/octet-stream',
    })

    return { ok: true, meta, file }
  } catch (err) {
    console.error('CAD Viewer: Failed to fetch file content', err)
    return { ok: false, error: extractErrorMessage(err) }
  }
}

/**
 * Read the `error` field Nextcloud's DataResponse carries on a failed request.
 */
function extractErrorMessage(err: unknown): string {
  const response = (err as { response?: { data?: { error?: string } } } | null)?.response
  const message = response?.data?.error
  return typeof message === 'string' && message !== ''
    ? message
    : 'Failed to load file content. Please try again.'
}
