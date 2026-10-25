/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import type { LoadResponse } from '../types/loadResponse'

/**
 * A CAD file ready to hand to the viewer, or the reason it could not be read.
 *
 * `error` is the server-provided message when there is one; the caller falls
 * back to its own translated message when it is absent.
 */
export type CadFileResult =
  | { ok: true; meta: LoadResponse; file: File }
  | { ok: false; error?: string }

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
    // Log only a safe description: the axios error carries
    // config.headers.requesttoken, so it must never be logged whole.
    const status = (err as { response?: { status?: number } } | null)?.response?.status
    console.error('CAD Viewer: failed to fetch file content', status ?? 'request failed')
    return { ok: false, error: await extractErrorMessage(err) }
  }
}

/**
 * Read the `error` field Nextcloud's DataResponse carries on a failed request.
 *
 * The download request uses `responseType: 'blob'`, so its error body arrives
 * as a Blob rather than parsed JSON and has to be decoded first.
 */
async function extractErrorMessage(err: unknown): Promise<string | undefined> {
  const data = (err as { response?: { data?: unknown } } | null)?.response?.data

  let parsed: unknown = data
  if (isBlobLike(data)) {
    try {
      parsed = JSON.parse(await data.text())
    } catch {
      parsed = undefined
    }
  }

  const message = (parsed as { error?: unknown } | undefined)?.error
  return typeof message === 'string' && message !== '' ? message : undefined
}

function isBlobLike(value: unknown): value is { text: () => Promise<string> } {
  return (
    typeof value === 'object'
    && value !== null
    && typeof (value as { text?: unknown }).text === 'function'
  )
}
