/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

/**
 * Minimal view of the document the viewer currently has open.
 *
 * Declared structurally so this module does not depend on the viewer's
 * declaration files (which pull in `three`, whose types are not installed).
 */
interface CadDatabaseLike {
  /** Serialise the drawing to ASCII DXF. */
  dxfOut(fileName?: string, precision?: number): string | Uint8Array
}

interface CadDocumentLike {
  fileName?: string
  database?: CadDatabaseLike
}

interface CadDocManagerLike {
  curDocument?: CadDocumentLike
}

export interface SaveResult {
  ok: boolean
  /** New file version, to use for the next save. */
  etag?: string
  /** Server-provided reason when the save failed. */
  error?: string
}

async function getDocManager(): Promise<CadDocManagerLike | null> {
  try {
    const module = await import(
      /* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/cad-simple-viewer'
    )
    const manager = module.AcApDocManager as unknown as {
      tryGetInstance?: () => CadDocManagerLike | undefined
      instance?: CadDocManagerLike
    }
    return manager.tryGetInstance?.() ?? manager.instance ?? null
  } catch {
    return null
  }
}

/**
 * Serialise the drawing currently open in the viewer to ASCII DXF.
 *
 * When `fileName` is given, the open document must match it. The viewer keeps
 * one document manager for the page, so without this check a save could
 * serialise the start-up placeholder (or a drawing left over from an earlier
 * session) and post it under the requested file's name.
 *
 * Returns null when no matching drawing is open or it cannot be serialised.
 */
export async function serializeCadDrawing(fileName?: string): Promise<string | null> {
  const manager = await getDocManager()
  const document = manager?.curDocument
  const database = document?.database
  if (!database) {
    return null
  }

  if (fileName !== undefined && fileName !== '' && document?.fileName !== fileName) {
    return null
  }

  try {
    const dxf = database.dxfOut(undefined, 6)
    return typeof dxf === 'string' ? dxf : null
  } catch {
    return null
  }
}

/**
 * Save the drawing currently open in the viewer back to its file.
 *
 * `etag` is the version the drawing was loaded from; the server refuses the
 * save when the file has changed since, so a stale editor cannot overwrite
 * someone else's work.
 *
 * The viewer can only serialise to DXF, so the server rejects a save for any
 * other format.
 */
export async function saveCadFile(
  fileId: number | string,
  etag: string,
  fileName?: string,
): Promise<SaveResult> {
  const content = await serializeCadDrawing(fileName)
  if (content === null) {
    return { ok: false, error: 'Could not read the drawing to save.' }
  }

  try {
    const response = await axios.post(
      generateUrl('/apps/cad_viewer/api/save/{fileId}', { fileId: String(fileId) }),
      { content, etag },
    ) as { data: { etag?: string } }

    return { ok: true, etag: response.data?.etag }
  } catch (err) {
    return { ok: false, error: await extractErrorMessage(err) }
  }
}

/**
 * Read the `error` field Nextcloud's DataResponse carries on a failed request.
 */
async function extractErrorMessage(err: unknown): Promise<string | undefined> {
  const data = (err as { response?: { data?: unknown } } | null)?.response?.data

  let parsed: unknown = data
  if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data)
    } catch {
      parsed = undefined
    }
  }

  const message = (parsed as { error?: unknown } | undefined)?.error
  return typeof message === 'string' && message !== '' ? message : undefined
}
