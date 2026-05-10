<div id="cad-viewer-app" data-file-ids="<?php if (!empty($_FILE['fileIds'])): ?> <?php echo htmlspecialchars($_FILE['fileIds']); ?><?php endif; ?>"></div>

<?php
script_tag('cad_viewer', 'cad-viewer');
style_tag('cad_viewer', 'cad-viewer');
?>

<style>
#cad-viewer-app {
    height: 100vh;
    width: 100%;
}
</style>