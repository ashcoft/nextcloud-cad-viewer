declare function t(app: string, text: string, vars?: Record<string, string | number>, count?: number): string
declare function n(app: string, singular: string, plural: string, count: number, vars?: Record<string, string | number>): string

declare const OC: {
  PERMISSION_READ: number
  PERMISSION_UPDATE: number
  PERMISSION_CREATE: number
  PERMISSION_DELETE: number
  PERMISSION_SHARE: number
  generateUrl(path: string, params?: Record<string, string | number>): string
  imagePath(app: string, image: string): string
}

declare const OCA: {
  Viewer?: {
    registerHandler?: (handler: {
      id: string
      group?: string
      mimes: string[]
      component: unknown
    }) => void
  }
}
