import { SUPPORTED_MIMES } from './fileActions'

export const CAD_MIMETYPE_NAME = 'CAD Drawing'

interface MimeTypeList {
  names?: Record<string, string>
}

/**
 * Give CAD mimetypes a human-readable name in the Files app.
 *
 * The Files app reads the file type from `OC.MimeTypeList.names`, which is
 * generated server-side from `mimetypenames.dist.json` plus the admin's
 * `config/mimetypenames.json`. Nextcloud does not let apps register names, so
 * patch the runtime list instead. This must run after `mimetypelist.js` has
 * executed (the caller retries on DOMContentLoaded), otherwise it is a no-op.
 */
export function registerCadMimetypeNames(): void {
  const globalScope = globalThis as unknown as { OC?: { MimeTypeList?: MimeTypeList } }
  const mimeTypeList = globalScope.OC?.MimeTypeList
  if (!mimeTypeList) {
    return
  }

  mimeTypeList.names ??= {}
  for (const mime of SUPPORTED_MIMES) {
    mimeTypeList.names[mime] = CAD_MIMETYPE_NAME
  }
}
