<template>
  <div id="cad-viewer-app" class="cad-viewer-container">
    <div v-if="loading" class="loading-spinner">
      <p>Loading CAD Viewer...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="viewer-wrapper">
      <div ref="viewerContainer" class="viewer-canvas"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { loadCADViewer } from './utils/cadLoader';

export default defineComponent({
  name: 'CadViewerApp',
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const viewerContainer = ref(null);
    const viewerInstance = ref(null);

    onMounted(async () => {
      try {
        if (viewerContainer.value) {
          viewerInstance.value = await loadCADViewer(viewerContainer.value);
        }
      } catch (err) {
        error.value = 'Failed to load CAD viewer: ' + err.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      error,
      viewerContainer
    };
  }
});
</script>

<style scoped>
.cad-viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner,
.error-message {
  padding: 2rem;
  text-align: center;
}

.error-message {
  color: #d93025;
}

.viewer-wrapper {
  width: 100%;
  height: 100%;
}

.viewer-canvas {
  width: 100%;
  height: 100%;
}
</style>
