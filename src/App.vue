<template>
  <div class="cad-viewer-app">
    <div class="viewer-header">
      <h2>{{ fileName || 'CAD Viewer' }}</h2>
      <div class="toolbar">
        <button class="btn" @click="fitToView">Fit to View</button>
        <button class="btn" @click="toggleFullscreen">Fullscreen</button>
      </div>
    </div>
    <div id="cad-viewer" ref="viewerContainer"></div>
  </div>
</template>

<script>
export default {
  name: 'CadViewerApp',
  data() {
    return {
      fileName: null,
      viewer: null
    }
  },
  mounted() {
    this.initViewer()
  },
  methods: {
    initViewer() {
      const params = new URLSearchParams(window.location.search)
      const fileId = params.get('fileId')
      
      if (fileId) {
        this.loadFile(fileId)
      }
    },
    async loadFile(fileId) {
      try {
        const response = await fetch(`/apps/cad_viewer/api/file/${fileId}`)
        const data = await response.json()
        
        if (data.error) {
          console.error('Error loading file:', data.error)
          return
        }
        
        this.fileName = data.name
        this.renderFile(data)
      } catch (error) {
        console.error('Failed to load file:', error)
      }
    },
    renderFile(fileData) {
      // Initialize CAD viewer with file data
      // This will be integrated with @cad-viewer/core
      console.log('Rendering file:', fileData)
    },
    fitToView() {
      console.log('Fitting to view')
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.getElementById('cad-viewer').requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }
}
</script>

<style scoped>
.cad-viewer-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}

.viewer-header {
  background: #fff;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.viewer-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar .btn {
  padding: 8px 16px;
  background: #0082c9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.toolbar .btn:hover {
  background: #006ba3;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toolbar .btn:active {
  transform: scale(0.98);
}

#cad-viewer {
  flex: 1;
  overflow: hidden;
  background: #fff;
}
</style>
