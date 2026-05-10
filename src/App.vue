<template>
  <div id="cad-viewer-wrapper" class="cad-viewer-wrapper">
    <div v-if="loading" class="cad-viewer-loading">
      <div class="spinner"></div>
      <p>{{ t('cad_viewer', 'Loading CAD Viewer...') }}</p>
    </div>
    <div v-else-if="error" class="cad-viewer-error">
      <p>{{ error }}</p>
      <button v-if="fileUrl" class="button primary" @click="retryLoad">
        {{ t('cad_viewer', 'Retry') }}
      </button>
    </div>
    <div v-else ref="viewerContainer" class="cad-viewer-canvas"></div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { loadCADViewer } from './utils/cadLoader';
import { generateUrl } from '@nextcloud/router';

export default defineComponent({
  name: 'CadViewerApp',
  props: {
    fileId: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props) {
    const loading = ref(true);
    const error = ref(null);
    const viewerContainer = ref(null);
    const viewerInstance = ref(null);
    const fileUrl = ref(null);

    let mountedApp = null;

    onMounted(async () => {
      try {
        // Resolve file ID from props, route, or data attribute
        let fileId = props.fileId;

        if (!fileId) {
          // Try from data attribute on container
          const container = document.getElementById('cad-viewer-container');
          if (container) {
            fileId = container.dataset.fileIds || '';
          }
        }

        // If still no fileId, try from URL query parameter
        if (!fileId) {
          const params = new URLSearchParams(window.location.search);
          fileId = params.get('fileIds') || params.get('fileId') || '';
        }

        if (!fileId) {
          error.value = t('cad_viewer', 'No file selected. Please open a DWG or DXF file from Nextcloud.');
          loading.value = false;
          return;
        }

        // Build the API URL for streaming the file content
        fileUrl.value = generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: fileId });

        if (viewerContainer.value) {
          mountedApp = await loadCADViewer(viewerContainer.value, {
            url: fileUrl.value,
            theme: 'dark',
          });
          viewerInstance.value = mountedApp;
        }
      } catch (err) {
        error.value = t('cad_viewer', 'Failed to load CAD viewer: ') + err.message;
      } finally {
        loading.value = false;
      }
    });

    onBeforeUnmount(() => {
      if (viewerInstance.value && typeof viewerInstance.value.dispose === 'function') {
        viewerInstance.value.dispose();
      }
      if (mountedApp) {
        mountedApp = null;
      }
    });

    const retryLoad = async () => {
      error.value = null;
      loading.value = true;

      if (viewerContainer.value && fileUrl.value) {
        if (viewerInstance.value) {
          viewerInstance.value.dispose();
        }
        try {
          mountedApp = await loadCADViewer(viewerContainer.value, {
            url: fileUrl.value,
            theme: 'dark',
          });
          viewerInstance.value = mountedApp;
        } catch (err) {
          error.value = t('cad_viewer', 'Failed to load CAD viewer: ') + err.message;
        }
      }
      loading.value = false;
    };

    return {
      loading,
      error,
      viewerContainer,
      fileUrl,
      retryLoad,
    };
  },
});
</script>

<style scoped>
.cad-viewer-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.cad-viewer-loading,
.cad-viewer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fff;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #0082c9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cad-viewer-error {
  color: #d93025;
}

.cad-viewer-canvas {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
</style>
