import { generateUrl } from '@nextcloud/router'
import $ from 'jquery';
import { translate as t } from '@nextcloud/l10n'
import axios from '@nextcloud/axios'

$(function () {
    OCA.CadViewer = OCA.CadViewer || {};
    if (!OCA.CadViewer.AppName) {
        OCA.CadViewer = {
            AppName: 'cad_viewer'
        };
    }

    $('#cad-viewer-save').click(async function () {
        const fTheme = $('#theme option:selected').val();
        const fAutosave = $('#autosave option:selected').val();
        const fLibraries = $('#libraries option:selected').val();
        const fPreviews = $('#previews option:selected').val();

        OC.dialogs.info(t(OCA.CadViewer.AppName, 'Saving...'));

        const settings = {
            theme: fTheme,
            autosave: fAutosave,
            libraries: fLibraries,
            previews: fPreviews
        };

        const params = new URLSearchParams();
        for (const key in settings) {
            params.append(key, settings[key]);
        }

        try {
            const response = await axios.post(generateUrl('apps/' + OCA.CadViewer.AppName + '/settings/save'), params);

            if (response.status === 200) {
                OC.dialogs.info(t(OCA.CadViewer.AppName, 'Settings have been successfully saved'));
            } else {
                OC.dialogs.alert(t(OCA.CadViewer.AppName, 'Error when trying to save settings') + ' (' + response.data + ')');
            }
        } catch (error) {
            OC.dialogs.alert(t(OCA.CadViewer.AppName, 'Error when trying to save settings') + ': ' + error.message);
        }
    });
});
