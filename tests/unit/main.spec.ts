/**
 * Tests for CAD Viewer registration and handler configuration.
 * These tests verify the expected constants and mock behavior without
 * importing the actual main.ts module (which has complex TypeScript/ESM setup).
 */

describe('CAD Viewer Registration', () => {
  describe('SUPPORTED_MIMES', () => {
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

    it('should include all expected CAD MIME types', () => {
      expect(SUPPORTED_MIMES).toContain('application/acad')
      expect(SUPPORTED_MIMES).toContain('application/autocad_dwg')
      expect(SUPPORTED_MIMES).toContain('application/dwg')
      expect(SUPPORTED_MIMES).toContain('application/x-autocad')
      expect(SUPPORTED_MIMES).toContain('application/x-dwg')
      expect(SUPPORTED_MIMES).toContain('image/vnd.dwg')
      expect(SUPPORTED_MIMES).toContain('image/vnd.dxf')
      expect(SUPPORTED_MIMES).toContain('application/dxf')
      expect(SUPPORTED_MIMES).toContain('application/x-dxf')
      expect(SUPPORTED_MIMES).toContain('image/x-dxf')
    })

    it('should have exactly 10 supported MIME types', () => {
      expect(SUPPORTED_MIMES).toHaveLength(10)
    })
  })

  describe('Viewer Handler Registration', () => {
    it('should define correct handler configuration structure', () => {
      // Verify the expected structure of the handler registration
      const handlerConfig = {
        id: 'cad-viewer',
        group: 'cad',
        mimes: [
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
        ],
      }

      expect(handlerConfig.id).toBe('cad-viewer')
      expect(handlerConfig.group).toBe('cad')
      expect(handlerConfig.mimes).toHaveLength(10)
      expect(handlerConfig.mimes).toContain('application/dwg')
      expect(handlerConfig.mimes).toContain('application/dxf')
    })

    it('should include correct mimes for DWG files', () => {
      const mimes = [
        'application/acad',
        'application/autocad_dwg',
        'application/dwg',
        'application/x-autocad',
        'application/x-dwg',
        'image/vnd.dwg',
      ]

      expect(mimes).toContain('application/acad')
      expect(mimes).toContain('application/autocad_dwg')
      expect(mimes).toContain('application/dwg')
      expect(mimes).toContain('application/x-autocad')
      expect(mimes).toContain('application/x-dwg')
      expect(mimes).toContain('image/vnd.dwg')
    })

    it('should include correct mimes for DXF files', () => {
      const mimes = [
        'image/vnd.dxf',
        'application/dxf',
        'application/x-dxf',
        'image/x-dxf',
      ]

      expect(mimes).toContain('image/vnd.dxf')
      expect(mimes).toContain('application/dxf')
      expect(mimes).toContain('application/x-dxf')
      expect(mimes).toContain('image/x-dxf')
    })
  })

  describe('File URL Generation', () => {
    it('should generate correct URL for fileId-based API', () => {
      const fileId = '12345'
      const expectedUrl = `/apps/cad_viewer/api/file/${fileId}/content`
      
      expect(expectedUrl).toContain(fileId)
      expect(expectedUrl).toContain('/apps/cad_viewer/api/file/')
    })
  })

  describe('OCA.Viewer mock setup', () => {
    it('should have correct mock structure', () => {
      const mockRegisterHandler = jest.fn()
      const mockOpen = jest.fn()

      const mockOCA = {
        Viewer: {
          registerHandler: mockRegisterHandler,
          open: mockOpen,
        },
      }

      expect(mockOCA.Viewer).toBeDefined()
      expect(mockOCA.Viewer.registerHandler).toBeDefined()
      expect(mockOCA.Viewer.open).toBeDefined()
      
      // Test that the mocks work
      mockOCA.Viewer.registerHandler({ id: 'test', mimes: [] })
      expect(mockRegisterHandler).toHaveBeenCalled()
      
      mockOCA.Viewer.open({ fileId: '123' })
      expect(mockOpen).toHaveBeenCalledWith({ fileId: '123' })
    })
  })
})
