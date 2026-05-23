import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

// Mock heavy dependencies so importing src/main.ts doesn't fail in jsdom
jest.mock('vue', () => ({
  createApp: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    mount: jest.fn(),
  })),
}))

jest.mock('../../src/App.vue', () => ({}))
jest.mock('../../src/router', () => ({ default: {} }))

// The MIME types that main.ts registers actions for
const SUPPORTED_MIMES = [
  'application/acad',
  'application/autocad_dwg',
  'application/dwg',
  'application/x-autocad',
  'application/x-dwg',
  'image/vnd.dwg',
  'image/vnd.dxf',
  'application/dxf',
  'application/x-dxf',
  'image/x-dxf',
]

describe('registerFileAction guard in main.ts', () => {
  let registerFileActionMock: jest.Mock

  function setupValidGlobals() {
    registerFileActionMock = jest.fn()
    ;(global as any).OC = {
      PERMISSION_READ: 1,
      imagePath: jest.fn().mockReturnValue('/core/actions/screen'),
      generateUrl: jest.fn((url: string) => url),
    }
    ;(global as any).OCA = {
      Files: {
        registerFileAction: registerFileActionMock,
      },
    }
    ;(global as any).t = jest.fn((app: string, text: string) => text)
  }

  function loadMainAndFire() {
    // Re-import main.ts after module registry reset
    jest.resetModules()
    // Re-apply mocks after reset (jest.mock calls above are static/hoisted but
    // resetModules clears registry; the jest.mock stubs remain for the next require)
    require('../../src/main')
    document.dispatchEvent(new Event('DOMContentLoaded'))
  }

  beforeEach(() => {
    setupValidGlobals()
  })

  afterEach(() => {
    jest.clearAllMocks()
    // Restore original globals (set by jest.config.js defaults)
    ;(global as any).t = (app: string, text: string) => text
    ;(global as any).OC = {}
    ;(global as any).OCA = {}
  })

  describe('when all required globals are properly defined', () => {
    it('registers a file action for each supported MIME type', () => {
      loadMainAndFire()

      expect(registerFileActionMock).toHaveBeenCalledTimes(SUPPORTED_MIMES.length)
    })

    it('registers the action with the correct name', () => {
      loadMainAndFire()

      const calls = registerFileActionMock.mock.calls
      calls.forEach((call: any[]) => {
        expect(call[0].name).toBe('cad-viewer-open')
      })
    })

    it('registers an action for every supported MIME type', () => {
      loadMainAndFire()

      const registeredMimes = registerFileActionMock.mock.calls.map(
        (call: any[]) => call[0].mime
      )
      SUPPORTED_MIMES.forEach((mime) => {
        expect(registeredMimes).toContain(mime)
      })
    })

    it('calls the translation function t when registering display names', () => {
      loadMainAndFire()

      expect((global as any).t).toHaveBeenCalledWith('cad_viewer', 'Open with CAD Viewer')
    })
  })

  describe('typeof t !== "function" guard (new check added in this PR)', () => {
    it('does NOT register any file actions when t is undefined', () => {
      ;(global as any).t = undefined
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does NOT register any file actions when t is a string', () => {
      ;(global as any).t = 'not-a-function'
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does NOT register any file actions when t is null', () => {
      ;(global as any).t = null
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does NOT register any file actions when t is a number', () => {
      ;(global as any).t = 42
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does NOT register any file actions when t is a plain object', () => {
      ;(global as any).t = { translate: () => '' }
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does NOT register any file actions when t is a boolean', () => {
      ;(global as any).t = true
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })
  })

  describe('OC undefined guard (pre-existing check, should not regress)', () => {
    it('does NOT register any file actions when OC is undefined', () => {
      ;(global as any).OC = undefined
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })
  })

  describe('OCA undefined guard (pre-existing check, should not regress)', () => {
    it('does NOT register any file actions when OCA is undefined', () => {
      ;(global as any).OCA = undefined
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })
  })

  describe('combined guard conditions', () => {
    it('returns early when both OC is undefined and t is not a function', () => {
      ;(global as any).OC = undefined
      ;(global as any).t = undefined
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('returns early when OCA is undefined and t is not a function', () => {
      ;(global as any).OCA = undefined
      ;(global as any).t = 'string'
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('only OC and OCA defined but t is not a function → returns early', () => {
      // This is the specific new guard scenario: OC and OCA are present but t is missing
      ;(global as any).t = undefined
      loadMainAndFire()

      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('all three guards pass when t is a function → actions are registered', () => {
      ;(global as any).t = (app: string, text: string) => `[${app}] ${text}`
      loadMainAndFire()

      expect(registerFileActionMock).toHaveBeenCalledTimes(SUPPORTED_MIMES.length)
    })
  })

  describe('OCA.Files.registerFileAction availability', () => {
    it('does not throw when OCA.Files is undefined', () => {
      ;(global as any).OCA = {}
      expect(() => loadMainAndFire()).not.toThrow()
      expect(registerFileActionMock).not.toHaveBeenCalled()
    })

    it('does not throw when OCA.Files.registerFileAction is not a function', () => {
      ;(global as any).OCA = { Files: { registerFileAction: 'not-a-function' } }
      expect(() => loadMainAndFire()).not.toThrow()
      expect(registerFileActionMock).not.toHaveBeenCalled()
    })
  })
})
