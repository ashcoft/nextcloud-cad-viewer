import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { captureCadThumbnail } from './cadThumbnail'

/**
 * Render and upload a thumbnail for a CAD file so the Files app can show it.
 *
 * Failures are swallowed: thumbnails are a progressive enhancement and must
 * never surface an error to the user.
 */
export async function uploadCadThumbnail(fileId: number | string): Promise<void> {
  try {
    const dataUrl = await captureCadThumbnail()
    if (!dataUrl) {
      return
    }

    await axios.post(
      generateUrl('/apps/cad_viewer/api/thumbnail/{fileId}', { fileId: String(fileId) }),
      { image: dataUrl },
    )
  } catch {
    // Ignore: the generic file icon stays until a thumbnail is available.
  }
}
