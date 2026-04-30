/**
 * CAD Viewer Loader Utility
 * Handles loading and initialization of the CAD viewer component
 */

/**
 * Load the CAD viewer into the specified container element
 * @param {HTMLElement} container - The DOM element to mount the viewer in
 * @returns {Promise<Object>} - Promise resolving to the viewer instance
 */
export async function loadCADViewer(container) {
  // Simulate CAD viewer initialization
  // In production, this would integrate with mlightcad/cad-viewer or similar library
  
  console.log('Initializing CAD viewer in container:', container);
  
  // Placeholder for actual CAD viewer integration
  const viewerInstance = {
    container,
    initialized: true,
    
    /**
     * Load a CAD file (DWG/DXF) into the viewer
     * @param {string} fileUrl - URL to the CAD file
     */
    async loadFile(fileUrl) {
      console.log('Loading CAD file:', fileUrl);
      // Implementation would use actual CAD viewer library
      return Promise.resolve({ success: true });
    },
    
    /**
     * Dispose of the viewer and clean up resources
     */
    dispose() {
      console.log('Disposing CAD viewer');
      this.initialized = false;
    }
  };
  
  return viewerInstance;
}

/**
 * Check if a file is a supported CAD format
 * @param {string} mimeType - The MIME type of the file
 * @returns {boolean}
 */
export function isSupportedCADFormat(mimeType) {
  const supportedTypes = [
    'application/acad',
    'image/vnd.dwg',
    'image/vnd.dxf',
    'application/dwg',
    'application/dxf'
  ];
  
  return supportedTypes.includes(mimeType);
}

/**
 * Get file extension from filename
 * @param {string} filename 
 * @returns {string}
 */
export function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}
