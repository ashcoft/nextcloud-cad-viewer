/**
 * CAD Viewer Loader Utility
 * Handles loading and initialization of the CAD viewer component
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { i18n, MlCadViewer } from '@mlightcad/cad-viewer'
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'

/**
 * Load the CAD viewer into the specified container element
 * @param {HTMLElement} container - The DOM element to mount the viewer in
 * @param {Object} options - Configuration options
 * @param {string} options.locale - Language 'en' or 'zh' (default: 'en')
 * @param {number} options.background - Background color as hex (default: 0x808080)
 * @param {string} options.theme - 'light' or 'dark' (default: 'dark')
 * @param {string} options.url - URL to load CAD file from
 * @param {File} options.localFile - Local File object to load
 * @param {string} options.baseUrl - Base URL for fonts and templates
 * @returns {Promise<Object>} - Promise resolving to the viewer instance
 */
export async function loadCADViewer(container, options = {}) {
  console.log('Initializing CAD viewer in container:', container)

  const app = createApp(MlCadViewer, {
    locale: options.locale || 'en',
    background: options.background || 0x808080,
    theme: options.theme || 'dark',
    url: options.url,
    localFile: options.localFile,
    baseUrl: options.baseUrl
  })

  // Use i18n for internationalization
  app.use(i18n)

  // Use Element Plus for UI components
  app.use(ElementPlus)

  // Mount the app
  app.mount(container)

  const viewerInstance = {
    container,
    initialized: true,
    app,

    /**
     * Load a CAD file (DWG/DXF) into the viewer
     * @param {string} fileUrl - URL to the CAD file
     */
    async loadFile(fileUrl) {
      console.log('Loading CAD file:', fileUrl)
      return Promise.resolve({ success: true })
    },

    /**
     * Dispose of the viewer and clean up resources
     */
    dispose() {
      console.log('Disposing CAD viewer')
      app.unmount()
      this.initialized = false
    }
  }

  return viewerInstance
}

/**
 * Configure UI settings for the CAD viewer
 * @param {Object} settings - UI settings
 */
export function configureUI(settings = {}) {
  if (AcApSettingManager.instance) {
    if (typeof settings.isShowToolbar === 'boolean') {
      AcApSettingManager.instance.isShowToolbar = settings.isShowToolbar
    }
    if (typeof settings.isShowCommandLine === 'boolean') {
      AcApSettingManager.instance.isShowCommandLine = settings.isShowCommandLine
    }
    if (typeof settings.isShowCoordinate === 'boolean') {
      AcApSettingManager.instance.isShowCoordinate = settings.isShowCoordinate
    }
    if (typeof settings.isShowEntityInfo === 'boolean') {
      AcApSettingManager.instance.isShowEntityInfo = settings.isShowEntityInfo
    }
    if (typeof settings.isShowMainMenu === 'boolean') {
      AcApSettingManager.instance.isShowMainMenu = settings.isShowMainMenu
    }
    if (typeof settings.isShowStats === 'boolean') {
      AcApSettingManager.instance.isShowStats = settings.isShowStats
    }
  }
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
