<?php
// Scripts and styles are added in AdminSettingsController::index().
?>
<div id="cad-viewer" class="section section-cad-viewer">
    <h2>CAD Viewer</h2>

    <div class="cad-viewer-setting">
        <label for="cad-viewer-theme"><?php p($l->t('Theme:')) ?></label>
        <select id="cad-viewer-theme">
            <option
                value="light"
                <?php if ($_['theme'] === 'light') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('Light')) ?></option>
            <option
                value="dark"
                <?php if ($_['theme'] === 'dark') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('Dark')) ?></option>
        </select>
        <p class="cad-viewer-hint">
            <?php p($l->t('Note: The theme used when a drawing is opened in the viewer.')) ?>
        </p>
    </div>

    <div class="cad-viewer-setting">
        <label for="cad-viewer-previews"><?php p($l->t('Enable file previews?')) ?></label>
        <select id="cad-viewer-previews">
            <option
                value="yes"
                <?php if ($_['previews'] === 'yes') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('Yes')) ?></option>
            <option
                value="no"
                <?php if ($_['previews'] === 'no') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('No')) ?></option>
        </select>
        <p class="cad-viewer-hint">
            <?php p($l->t('Note: Disable previews to save storage space for CAD previews.')) ?>
        </p>
    </div>

    <button type="button" id="cad-viewer-save" class="button primary">
        <?php p($l->t('Save')) ?>
    </button>
    <span id="cad-viewer-status" class="cad-viewer-status" role="status"></span>
</div>
