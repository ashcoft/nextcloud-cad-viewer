<?php
declare(strict_types=1);
/** @var array $_ */
?>
<div id="cad-viewer-container"
     data-file-ids="<?php echo !empty($_['fileIds']) ? htmlspecialchars($_['fileIds'], ENT_QUOTES, 'UTF-8') : ''; ?>"
     data-request-token="<?php echo htmlspecialchars($_['requesttoken'] ?? '', ENT_QUOTES, 'UTF-8'); ?>">
</div>
