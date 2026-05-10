import { createApp } from 'vue';
import CadViewerApp from './App.vue';
import router from './router';

// Create the Vue app
const app = createApp(CadViewerApp);
app.use(router);

/**
 * Register file action handler in Nextcloud Files app.
 * This adds a "View in CAD Viewer" action for DWG/DXF files.
 */
function registerFileAction() {
    // Wait for Nextcloud's OCA.Files module to be available
    if (typeof OC === 'undefined' || typeof OCA === 'undefined') {
        return;
    }

    // Use the modern Nextcloud file action API
    const supportedMimes = [
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
    ];

    // Register for each supported MIME type
    supportedMimes.forEach(function(mime) {
        if (OCA.Files && typeof OCA.Files.registerFileAction === 'function') {
            // Legacy Nextcloud 28- API
            OCA.Files.registerFileAction({
                name: 'cad-viewer-open',
                displayName: t('cad_viewer', 'View in CAD Viewer'),
                mime: mime,
                permissions: OC.PERMISSION_READ,
                icon: function() { return OC.imagePath('core', 'actions/screen'); },
                actionHandler: function(fileName, context) {
                    var fileId = context.fileInfo ? context.fileInfo.id : null;
                    if (fileId) {
                        var url = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId;
                        window.location.href = url;
                    }
                },
            });
        }
    });
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    registerFileAction();

    // Mount the Vue app
    // The mount point may be in the template or dynamically created
    var mountEl = document.getElementById('cad-viewer-app') || document.getElementById('cad-viewer-container');
    if (mountEl) {
        app.mount(mountEl);
    }
});

export default app;
