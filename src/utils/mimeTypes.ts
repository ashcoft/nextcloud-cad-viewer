/**
 * Canonical MIME type the app uses for DWG drawings.
 *
 * Nextcloud resolves the many DWG aliases below (application/acad,
 * image/vnd.dwg, ...) to this type through the app's mimetypealiases.json.
 */
export const CANONICAL_DWG_MIME = 'application/dwg'

/**
 * Canonical MIME type the app uses for DXF drawings.
 */
export const CANONICAL_DXF_MIME = 'image/vnd.dxf'

/**
 * Every MIME type the CAD viewer is able to open.
 *
 * Includes the aliases so a file is recognised even before Nextcloud has
 * resolved it to the canonical type.
 */
export const SUPPORTED_MIMES = [
  'application/acad',
  'application/autocad_dwg',
  CANONICAL_DWG_MIME,
  'application/x-autocad',
  'application/x-dwg',
  'image/vnd.dwg',
  'application/dxf',
  'application/x-dxf',
  CANONICAL_DXF_MIME,
  'image/x-dxf',
] as const

export type CadMime = (typeof SUPPORTED_MIMES)[number]

/**
 * Whether a MIME type is one the CAD viewer can open.
 */
export function isSupportedCadMime(mime: string): boolean {
  return (SUPPORTED_MIMES as readonly string[]).includes(mime)
}

/**
 * Whether a file name carries a DWG or DXF extension.
 *
 * Used as a fallback for files whose MIME type is still the generic
 * `application/octet-stream` because the Nextcloud MIME mapping has not been
 * refreshed yet.
 */
export function hasCadExtension(name: string): boolean {
  return /\.(dwg|dxf)$/i.test(name)
}
