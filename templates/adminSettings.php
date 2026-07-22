<?php // Scripts and styles are added in AdminSettingsController::index()?>
<div id="cad-viewer" class="section section-cad-viewer">
    <h2>CAD Viewer</h2>

    <div class="cad-viewer-setting">
        <label for="theme"><?php p($l->t('Theme:')) ?></label>
        <select id="theme">
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
    </div>

    <div class="cad-viewer-setting">
        <label for="autosave"><?php p($l->t('Activate autosave?')) ?></label>
        <select id="autosave">
            <option
                value="yes"
                <?php if ($_['autosave'] === 'yes') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('Yes')) ?></option>
            <option
                value="no"
                <?php if ($_['autosave'] === 'no') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('No')) ?></option>
        </select>
        <p class="cad-viewer-hint"><?php p($l->t('Note: Autosave automatically saves the file while editing.')) ?></p>
    </div>

    <div class="cad-viewer-setting">
        <label for="libraries"><?php p($l->t('Enable libraries?')) ?></label>
        <select id="libraries">
            <option
                value="yes"
                <?php if ($_['libraries'] === 'yes') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('Yes')) ?></option>
            <option
                value="no"
                <?php if ($_['libraries'] === 'no') {
                    echo ' selected';
                } ?>
            ><?php p($l->t('No')) ?></option>
        </select>
        <p class="cad-viewer-hint"><?php p($l->t('Note: Enable libraries to access CAD component libraries.')) ?></p>
    </div>

    <div class="cad-viewer-setting">
        <label for="previews"><?php p($l->t('Enable file previews?')) ?></label>
        <select id="previews">
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

    <a id="cad-viewer-save" class="button"><?php p($l->t('Save')) ?></a>
</div>
