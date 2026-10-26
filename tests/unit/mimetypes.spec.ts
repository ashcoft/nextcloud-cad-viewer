import { CAD_MIMETYPE_NAME, registerCadMimetypeNames } from '../../src/mimetypes'
import { SUPPORTED_MIMES } from '../../src/fileActions'

describe('registerCadMimetypeNames', () => {
  afterEach(() => {
    delete (globalThis as { OC?: unknown }).OC
  })

  it('labels every supported CAD mimetype as a CAD Drawing', () => {
    ;(globalThis as unknown as { OC: { MimeTypeList: { names: Record<string, string> } } }).OC = {
      MimeTypeList: { names: {} },
    }

    registerCadMimetypeNames()

    const names = (globalThis as unknown as { OC: { MimeTypeList: { names: Record<string, string> } } }).OC.MimeTypeList.names
    for (const mime of SUPPORTED_MIMES) {
      expect(names[mime]).toBe(CAD_MIMETYPE_NAME)
    }
  })

  it('preserves existing entries and creates names when missing', () => {
    ;(globalThis as unknown as { OC: { MimeTypeList: Record<string, unknown> } }).OC = {
      MimeTypeList: {},
    }

    registerCadMimetypeNames()

    const names = (globalThis as unknown as { OC: { MimeTypeList: { names: Record<string, string> } } }).OC.MimeTypeList.names
    expect(names['application/dwg']).toBe('CAD Drawing')
  })

  it('is a no-op before mimetypelist.js has loaded', () => {
    ;(globalThis as unknown as { OC: Record<string, unknown> }).OC = {}

    expect(() => registerCadMimetypeNames()).not.toThrow()
  })

  it('does nothing when OC is undefined', () => {
    expect(() => registerCadMimetypeNames()).not.toThrow()
  })
})
