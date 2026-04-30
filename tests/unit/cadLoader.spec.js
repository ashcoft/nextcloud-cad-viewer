import { describe, it, expect } from '@jest/globals';
import { isSupportedCADFormat, getFileExtension } from '../../src/utils/cadLoader';

describe('CAD Loader Utilities', () => {
  describe('isSupportedCADFormat', () => {
    it('should return true for DWG MIME type', () => {
      expect(isSupportedCADFormat('application/acad')).toBe(true);
    });

    it('should return true for DXF MIME type', () => {
      expect(isSupportedCADFormat('image/vnd.dxf')).toBe(true);
    });

    it('should return false for unsupported MIME types', () => {
      expect(isSupportedCADFormat('image/png')).toBe(false);
      expect(isSupportedCADFormat('application/pdf')).toBe(false);
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
