/**
 * CAD Viewer Loader Utility
 * Handles loading and initialization of the mlightcad/cad-viewer component
 * for Nextcloud integration.
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
 * @param {string} [options.locale='en'] - Language code ('en' or 'zh')
 * @param {string} [options.url] - URL to load CAD file from (Nextcloud API endpoint)
 * @param {File} [options.localFile] - Local File object to load
 * @param {string} [options.theme='dark'] - Theme: 'light' or 'dark'
 * @param {string} [options.baseUrl] - Base URL for fonts and templates
 * @param {number} [options.background] - Background color as hex (default: 0x1e1e1e)
 * @returns {Promise<Object>} - Promise resolving to the viewer instance
 */
export async function loadCADViewer(container, options = {}) {
  const {
    locale = 'en',
    url = null,
    localFile = null,
    theme = 'dark',
    baseUrl = null,
    background = 0x1e1e1e,
  } = options

  console.log('[CAD Viewer] Initializing viewer in container:', container)

  // Build viewer props
  const viewerProps = {
    locale,
    theme,
    background,
  }

  if (url) {
    viewerProps.url = url
  }

  if (localFile) {
    viewerProps.localFile = localFile
  }

  if (baseUrl) {
    viewerProps.baseUrl = baseUrl
  }

  // Create and mount the Vue app with MlCadViewer
  const app = createApp(MlCadViewer, viewerProps)

  // Register i18n for internationalization
  app.use(i18n)

  // Register Element Plus for UI components
  app.use(ElementPlus)

  // Mount to the container element
  app.mount(container)

  // Return a viewer instance with control methods
  const viewerInstance = {
    container,
    initialized: true,
    app,

    /**
     * Load a CAD file from a URL (e.g., Nextcloud API endpoint)
     * @param {string} fileUrl - URL to the CAD file
     */
    async loadFile(fileUrl) {
      console.log('[CAD Viewer] Loading file from URL:', fileUrl)
      try {
        // The MlCadViewer component supports loading via the url prop.
        // We re-create the app with the new URL.
        this.dispose()
        const newApp = createApp(MlCadViewer, {
          ...viewerProps,
          url: fileUrl,
        })
        newApp.use(i18n)
        newApp.use(ElementPlus)
        newApp.mount(container)
        this.app = newApp
        return { success: true }
      } catch (err) {
        console.error('[CAD Viewer] Failed to load file:', err)
        return { success: false, error: err.message }
      }
    },

    /**
     * Dispose of the viewer and clean up resources
     */
    dispose() {
      console.log('[CAD Viewer] Disposing viewer')
      if (this.app) {
        this.app.unmount()
        this.app = null
      }
      this.initialized = false
    },
  }

  return viewerInstance
}

/**
 * Configure UI settings for the CAD viewer
 * @param {Object} settings - UI visibility settings
 * @param {boolean} [settings.isShowToolbar] - Show/hide toolbar
 * @param {boolean} [settings.isShowCommandLine] - Show/hide command line
 * @param {boolean} [settings.isShowCoordinate] - Show/hide coordinate display
 * @param {boolean} [settings.isShowEntityInfo] - Show/hide entity info
 * @param {boolean} [settings.isShowMainMenu] - Show/hide main menu
 * @param {boolean} [settings.isShowStats] - Show/hide stats
 */
export function configureUI(settings = {}) {
  if (!AcApSettingManager.instance) {
    console.warn('[CAD Viewer] AcApSettingManager not yet initialized')
    return
  }

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

/**
 * Check if a MIME type is a supported CAD format
 * @param {string} mimeType - The MIME type of the file
 * @returns {boolean}
 */
export function isSupportedCADFormat(mimeType) {
  const supportedTypes = [
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

  return supportedTypes.includes(mimeType)
}

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string}
 */
export function getFileExtension(filename) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}
