import { describe, it, expect } from '@jest/globals';
import { isSupportedCADFormat, getFileExtension } from '../../src/utils/cadLoader';

describe('CAD Loader Utilities', () => {
  describe('isSupportedCADFormat', () => {
    it('should return true for DWG MIME types', () => {
      expect(isSupportedCADFormat('application/acad')).toBe(true);
      expect(isSupportedCADFormat('image/vnd.dwg')).toBe(true);
      expect(isSupportedCADFormat('application/dwg')).toBe(true);
      expect(isSupportedCADFormat('application/x-autocad')).toBe(true);
      expect(isSupportedCADFormat('application/autocad_dwg')).toBe(true);
    });

    it('should return true for DXF MIME types', () => {
      expect(isSupportedCADFormat('image/vnd.dxf')).toBe(true);
      expect(isSupportedCADFormat('application/dxf')).toBe(true);
      expect(isSupportedCADFormat('application/x-dxf')).toBe(true);
    });

    it('should return false for unsupported MIME types', () => {
      expect(isSupportedCADFormat('image/png')).toBe(false);
      expect(isSupportedCADFormat('application/pdf')).toBe(false);
      expect(isSupportedCADFormat('text/plain')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should return lowercase extension', () => {
      expect(getFileExtension('file.DWG')).toBe('dwg');
      expect(getFileExtension('drawing.DXF')).toBe('dxf');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('noextension')).toBe('');
    });

    it('should handle multiple dots in filename', () => {
      expect(getFileExtension('my.file.name.dwg')).toBe('dwg');
    });
  });
});

describe('base64ToFile conversion', () => {
  // Test helper to simulate base64ToFile behavior
  // Note: The actual function is internal to cadLoader module
  // These tests verify the expected conversion logic
  function base64ToFile(base64: string, fileName: string): File {
    const binary = atob(base64)
    // Safe: convert base64 string to Uint8Array using from() method
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const ext = fileName.split('.').pop()?.toLowerCase()
    const mimeType = ext === 'dxf' ? 'application/dxf' : 'application/dwg'
    return new File([bytes], fileName, { type: mimeType })
  }

  it('should convert base64 to File object for DWG files', () => {
    // Simple test data: "test" in base64
    const testBase64 = 'dGVzdA=='
    const file = base64ToFile(testBase64, 'test.dwg')

    expect(file).toBeInstanceOf(File)
    expect(file.name).toBe('test.dwg')
    expect(file.type).toBe('application/dwg')
  })

  it('should convert base64 to File object for DXF files', () => {
    const testBase64 = 'dGVzdA=='
    const file = base64ToFile(testBase64, 'drawing.dxf')

    expect(file).toBeInstanceOf(File)
    expect(file.name).toBe('drawing.dxf')
    expect(file.type).toBe('application/dxf')
  })

  it('should create File with correct size for binary data', () => {
    // Create test binary data (null bytes, etc.)
    const binaryData = new Uint8Array([0x00, 0x01, 0x02, 0xff, 0xfe])
    const base64 = btoa(String.fromCharCode(...binaryData))
    const file = base64ToFile(base64, 'binary.dwg')

    // Verify the File object was created with correct size
    expect(file.size).toBe(binaryData.length)
    expect(file).toBeInstanceOf(File)
  })
})
