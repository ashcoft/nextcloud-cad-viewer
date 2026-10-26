<template>
  <div class="cad-start">
    <header class="cad-start__header">
      <div class="cad-start__intro">
        <h1 class="cad-start__title">{{ appTranslation('CAD Viewer') }}</h1>
        <p class="cad-start__subtitle">
          {{ appTranslation('Open a recent drawing or start with a blank one.') }}
        </p>
      </div>
      <div class="cad-start__actions">
        <button type="button" class="button primary" @click="openDialog">
          {{ appTranslation('New blank drawing') }}
        </button>
        <a class="button" :href="filesUrl">{{ appTranslation('Browse files') }}</a>
      </div>
    </header>

    <section v-if="recent.length > 0" class="cad-start__section">
      <h2 class="cad-start__heading">{{ appTranslation('Recent drawings') }}</h2>
      <ul class="cad-start__grid">
        <li v-for="drawing in recent" :key="drawing.id">
          <a class="cad-start__card" :href="viewerUrl(drawing.id)" :title="drawing.path">
            <span class="cad-start__thumb">
              <img
                v-if="drawing.hasPreview && !failedPreviews.includes(drawing.id)"
                :src="previewUrl(drawing)"
                alt=""
                loading="lazy"
                @error="markPreviewFailed(drawing.id)"
              >
              <svg
                v-else
                class="cad-start__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2V4a2 2 0 0 0-2-2H7zm0 2h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2z" />
              </svg>
            </span>
            <span class="cad-start__card-body">
              <span class="cad-start__name">{{ drawing.name }}</span>
              <span class="cad-start__path">{{ folderOf(drawing.path) }}</span>
              <span class="cad-start__meta">
                <span class="cad-start__badge">{{ drawing.extension.toUpperCase() }}</span>
                {{ formatMtime(drawing.mtime) }}
              </span>
            </span>
          </a>
        </li>
      </ul>
    </section>

    <section v-else class="cad-start__empty">
      <h2 class="cad-start__heading">{{ appTranslation('Recent drawings') }}</h2>
      <p>{{ appTranslation('No drawings yet.') }}</p>
      <p class="cad-start__hint">
        {{ appTranslation('Upload a DWG or DXF file in Files, or create a blank drawing.') }}
      </p>
    </section>

    <dialog
      ref="dialogElement"
      class="cad-start__dialog"
      aria-labelledby="cad-start-dialog-title"
      @cancel.prevent="closeDialog"
      @click.self="closeDialog"
      @close="handleDialogClosed"
      @keydown.esc.prevent="closeDialog"
    >
      <form @submit.prevent="createDrawing">
        <h2 id="cad-start-dialog-title" class="cad-start__heading">
          {{ appTranslation('New blank drawing') }}
        </h2>

        <label class="cad-start__label" for="cad-start-name">
          {{ appTranslation('File name') }}
        </label>
        <input
          id="cad-start-name"
          ref="nameInput"
          v-model="fileName"
          type="text"
          autocomplete="off"
          spellcheck="false"
          :disabled="creating"
          :placeholder="appTranslation('Drawing.dxf')"
        >
        <p class="cad-start__hint">
          {{ appTranslation('The drawing is saved as a DXF file in your home folder.') }}
        </p>

        <p v-if="error" class="cad-start__error" role="alert">{{ error }}</p>

        <div class="cad-start__dialog-actions">
          <button type="button" class="button" :disabled="creating" @click="closeDialog">
            {{ appTranslation('Cancel') }}
          </button>
          <button type="submit" class="button primary" :disabled="creating">
            {{ creating ? appTranslation('Creating…') : appTranslation('Create') }}
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>


<script lang="ts">
import { defineComponent, nextTick, ref, type PropType } from 'vue'
import { translate } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { buildViewerUrl } from './fileActions'
import { createBlankDrawing, requestErrorMessage } from './utils/startPage'
import type { RecentDrawing } from './types/recentDrawing'

const appTranslation = (text: string): string => translate('cad_viewer', text)

function viewerUrl(fileId: number): string {
  return buildViewerUrl(fileId)
}

function formatMtime(mtime: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(mtime * 1000))
}

/**
 * Build the URL of Nextcloud's preview endpoint for a drawing.
 *
 * The app's preview provider only has an image after the viewer has rendered
 * the drawing once; `hasPreview` keeps the client from requesting one before
 * that.
 */
function previewUrl(drawing: RecentDrawing): string {
  const params = new URLSearchParams({
    fileId: String(drawing.id),
    x: '320',
    y: '200',
    a: '0',
    mimeFallback: 'false',
    v: String(drawing.mtime),
  })

  return `${generateUrl('/core/preview')}?${params.toString()}`
}

export default defineComponent({
  name: 'CadStartPage',
  props: {
    recent: {
      type: Array as PropType<RecentDrawing[]>,
      default: () => [],
    },
  },
  setup() {
    const creating = ref(false)
    const error = ref<string | null>(null)
    const fileName = ref('Drawing.dxf')
    const nameInput = ref<HTMLInputElement | null>(null)
    const dialogElement = ref<HTMLDialogElement | null>(null)
    const failedPreviews = ref<number[]>([])

    const filesUrl = generateUrl('/apps/files/')

    function markPreviewFailed(fileId: number): void {
      if (!failedPreviews.value.includes(fileId)) {
        failedPreviews.value = [...failedPreviews.value, fileId]
      }
    }

    function openDialog(): void {
      error.value = null
      fileName.value = 'Drawing.dxf'
      dialogElement.value?.showModal()
      void nextTick(() => nameInput.value?.select())
    }

    function closeDialog(): void {
      if (creating.value) {
        return
      }
      dialogElement.value?.close()
    }

    function handleDialogClosed(): void {
      error.value = null
    }

    async function createDrawing(): Promise<void> {
      if (creating.value) {
        return
      }

      creating.value = true
      error.value = null

      try {
        const fileId = await createBlankDrawing(fileName.value)
        window.location.href = buildViewerUrl(fileId)
      } catch (err) {
        error.value = requestErrorMessage(
          err,
          appTranslation('Could not create the drawing. Please try again.'),
        )
        creating.value = false
      }
    }

    function folderOf(path: string): string {
      const separator = path.lastIndexOf('/')
      return separator > 0 ? path.slice(0, separator) : appTranslation('Home')
    }

    return {
      creating,
      error,
      fileName,
      nameInput,
      dialogElement,
      failedPreviews,
      filesUrl,
      markPreviewFailed,
      previewUrl,
      openDialog,
      closeDialog,
      handleDialogClosed,
      createDrawing,
      viewerUrl,
      folderOf,
      formatMtime,
      appTranslation,
    }
  },
})
</script>

<style scoped>
.cad-start {
  box-sizing: border-box;
  max-width: 1100px;
  min-height: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  color: var(--color-main-text);
}

.cad-start__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.cad-start__title {
  margin: 0 0 0.35rem;
  font-size: 2rem;
  font-weight: 700;
}

.cad-start__subtitle {
  margin: 0;
  color: #000;
}

/* Keep the instruction readable when Nextcloud runs a dark theme. */
[data-theme-dark] .cad-start__subtitle,
[data-theme-dark-highcontrast] .cad-start__subtitle {
  color: var(--color-main-text);
}

.cad-start__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cad-start__actions .button {
  margin: 0;
}

.cad-start__heading {
  margin: 0 0 1rem;
  font-size: 1.15rem;
  font-weight: 600;
}

.cad-start__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

.cad-start__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  box-sizing: border-box;
  height: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large, 12px);
  background: var(--color-main-background);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.cad-start__card:hover,
.cad-start__card:focus-visible {
  border-color: var(--color-primary-element);
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  text-decoration: none;
}

.cad-start__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--border-radius, 4px);
  background: var(--color-background-dark);
}

.cad-start__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cad-start__icon {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  color: var(--color-primary-element);
}

.cad-start__card-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  min-width: 0;
}

.cad-start__name {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cad-start__path {
  overflow: hidden;
  color: var(--color-text-maxcontrast);
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cad-start__meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.2rem;
  color: var(--color-text-maxcontrast);
  font-size: 0.8rem;
}

.cad-start__badge {
  padding: 0.1rem 0.4rem;
  border-radius: var(--border-radius, 4px);
  background: var(--color-background-dark);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.cad-start__empty {
  padding: 3rem 1.5rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-large, 12px);
  text-align: center;
}

.cad-start__hint {
  color: var(--color-text-maxcontrast);
  font-size: 0.9rem;
}

.cad-start__dialog {
  box-sizing: border-box;
  width: min(440px, 100%);
  max-width: calc(100% - 2rem);
  padding: 0;
  border: none;
  border-radius: var(--border-radius-large, 12px);
  background: var(--color-main-background);
  color: var(--color-main-text);
  box-shadow: 0 8px 32px rgb(0 0 0 / 25%);
}

.cad-start__dialog::backdrop {
  background: rgb(0 0 0 / 50%);
}

.cad-start__dialog form {
  padding: 1.5rem;
}

.cad-start__label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.cad-start__dialog input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.65rem;
}

.cad-start__error {
  margin: 0.75rem 0 0;
  color: var(--color-error-text, #d93025);
}

.cad-start__dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

.cad-start__dialog-actions .button {
  margin: 0;
}
</style>
