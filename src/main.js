import { createApp } from 'vue';
import CadViewerApp from './App.vue';
import router from './router';

// Register file action for CAD files using Nextcloud globals
(function() {
    if (typeof OC === 'undefined') return;
    
    // Wait for files library to be ready
    require(['@nextcloud/files'], function(OCFiles) {
        if (!OCFiles || !OCFiles.registerFileAction) return;
        
        OCFiles.registerFileAction({
            name: 'cad-viewer',
            displayName: t('cad_viewer', 'View in CAD Viewer'),
            mime: ['image/vnd.dwg', 'image/vnd.dxf', 'model/vnd.dwg', 'model/vnd.dxf'],
            permissions: OC.PERMISSION_READ,
            order: 10,
            iconSvgInline: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/></svg>',
            actionHandler: function(file) {
                var fileId = file.fileid;
                window.location.href = OC.linkTo('cad_viewer', 'index.php/apps/cad_viewer/view') + '?fileIds=' + fileId;
            },
        });
    });
})();

var app = createApp(CadViewerApp);
app.use(router);
app.mount('#cad-viewer-app');

export default app;
