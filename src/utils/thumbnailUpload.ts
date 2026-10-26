import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { captureCadThumbnail, type PreviousCadDocument } from './cadThumbnail'

/**
 * Render and upload a thumbnail for a CAD file so the Files app can show it.
 *
 * `etag` is the version of the drawing the viewer rendered. The server stores
 * the image under it and rejects uploads for a version the file has already
 * moved past, so an edit made while the drawing was open cannot end up as the
 * preview of the newer version.
 *
 * `fileName` pins the capture to the drawing that was just opened, and
 * `signal` lets the caller cancel it when the viewer unmounts.
 *
 * Failures are swallowed: thumbnails are a progressive enhancement and must
 * never surface an error to the user.
 */
export async function uploadCadThumbnail(
  fileId: number | string,
  etag?: string,
  options: { fileName?: string; signal?: AbortSignal; previousDocument?: PreviousCadDocument } = {},
): Promise<void> {
  try {
    const dataUrl = await captureCadThumbnail({
      fileName: options.fileName,
      signal: options.signal,
      previousDocument: options.previousDocument,
    })
    if (!dataUrl || options.signal?.aborted) {
      return
    }

    await axios.post(
      generateUrl('/apps/cad_viewer/api/thumbnail/{fileId}', { fileId: String(fileId) }),
      { image: dataUrl, etag: etag ?? '' },
      { signal: options.signal },
    )
  } catch {
    // Ignore: the generic file icon stays until a thumbnail is available.
  }
}
