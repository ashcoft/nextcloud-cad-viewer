<?php
declare(strict_types=1);

/** @var array $_ */
$recentDrawings = $_['recentDrawings'] ?? [];
$recentJson = json_encode(
    $recentDrawings,
    JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
);
?>
<div id="cad-viewer-start"
     data-recent-drawings="<?php echo htmlspecialchars($recentJson, ENT_QUOTES, 'UTF-8'); ?>">
    <noscript>
        <p><?php echo $l->t('JavaScript is required to use the CAD Viewer.'); ?></p>
    </noscript>
</div>
