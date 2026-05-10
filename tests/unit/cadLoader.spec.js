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
