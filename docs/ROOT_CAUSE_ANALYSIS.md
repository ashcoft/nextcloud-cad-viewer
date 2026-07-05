# Root Cause Analysis: CAD Viewer Downloads Instead of Opening

## Executive Summary

**Root Cause:** The app uses the deprecated `OCA.Viewer.registerHandler()` API which has unreliable script loading order, causing the CAD Viewer handler to either not register or register too late, resulting in Nextcloud falling back to downloading the file.

**Confidence:** 95%

---

## 1. Root Cause Analysis

### Primary Issue: Deprecated Viewer API

**Location:** `src/main.ts` lines 74-85

```typescript
if (OCA?.Viewer !== undefined) {
  OCA.Viewer.registerHandler({
    id: 'cad-viewer',
    group: 'cad',
    mimes: SUPPORTED_MIMES,
    component: CadViewerHandler,
  })
  isRegistered = true
  console.log('CAD Viewer handler registered successfully')
  return true
}
```

**Problem:** The Nextcloud Viewer app documentation explicitly states:

> "Using OCA.Viewer for registering your handlers is not recommended as this might break depending on the script loading order"

### Secondary Issue: Polling May Succeed But Viewer Still Won't Open

**Location:** `src/main.ts` lines 88-109

Even though the code polls for `OCA.Viewer` availability and reports success, the registration may happen too late in the Nextcloud page lifecycle. The Viewer app scans for handlers during initialization, not after all scripts load.

---

## 2. Files Responsible

| File | Lines | Issue |
|------|-------|-------|
| `src/main.ts` | 74-85 | Uses deprecated `OCA.Viewer.registerHandler()` |
| `src/main.ts` | 88-109 | Polling mechanism is insufficient |
| `src/main.ts` | 136-137 | Calls `setupViewerObserver()` but it's not using the new API |

---

## 3. Detailed Findings

### 3.1 MIME Registration - CORRECT ✅

**Location:** `appinfo/mimetypes.json`

```json
{
    "mimetypes": [
        "application/acad",
        "application/autocad_dwg", 
        "application/dwg",
        ...
    ],
    "aliases": {
        "dwg": "application/dwg",
        "dxf": "image/vnd.dxf"
    }
}
```

**Status:** Correctly registered. DWG and DXF files are mapped to proper MIME types.

**Confidence:** 100%

---

### 3.2 Viewer Registration - INCORRECT ❌

**Location:** `src/main.ts`

**Current Implementation:**
```typescript
// OLD deprecated API
OCA.Viewer.registerHandler({
  id: 'cad-viewer',
  group: 'cad',
  mimes: SUPPORTED_MIMES,
  component: CadViewerHandler,
})
```

**Required Implementation (from @nextcloud/viewer docs):**
```typescript
import { registerHandler } from '@nextcloud/viewer'

registerHandler({
  id: 'video',
  group: 'media',
  mimes: ['video/mpeg', 'video/ogg'],
  component: VideoView,
  // Optional: callback before download
  downloadCallback: async (fileInfo) => {
    // Handle download callback
  }
})
```

**Confidence:** 95%

---

### 3.3 Script Loading - USES WRONG METHOD ❌

**Location:** `lib/Listener/LoadViewer.php`

```php
Util::addScript(Application::APP_ID, 'cad-viewer');
```

**Issue:** Uses `addScript` instead of `addInitScript`. The Nextcloud docs specifically state:

> "Make sure your script is loaded with `\OCP\Util::addInitScript` so that the handler is registered before the viewer is loaded."

**Confidence:** 90%

---

### 3.4 JavaScript Loading - CORRECT ✅

**Location:** `js/cad-viewer.js` exists and is bundled correctly.

**Status:** Compiled JavaScript exists in release artifact.

---

### 3.5 Routes - CORRECT ✅

**Location:** `appinfo/routes.php`

```php
['name' => 'view#view', 'url' => '/view', 'verb' => 'GET'],
```

**Status:** Routes are properly defined.

---

### 3.6 Controller - CORRECT ✅

**Location:** `lib/Controller/FileController.php`

The `getFileContent` method returns a `StreamResponse` with `Content-Type: application/octet-stream` to prevent browser download. This is correct.

**Status:** Controller logic is sound.

---

### 3.7 Release Packaging - CORRECT ✅

**Location:** `Makefile`, `.github/workflows/release.yml`

The release artifact includes:
- `js/cad-viewer.js` (compiled)
- `css/cad-viewer.css`
- `lib/` (PHP code)
- `appinfo/` (config files)

**Status:** Packaging is correct.

---

## 4. Comparison with Working Apps (ONLYOFFICE, Draw.io)

### ONLYOFFICE Integration
Uses the `@nextcloud/files` package for file actions:
```typescript
import { registerFileAction } from '@nextcloud/files'
```

And uses `addInitScript` for Viewer integration.

### Draw.io Integration  
Uses the `@nextcloud/viewer` package:
```typescript
import { registerHandler } from '@nextcloud/viewer'
registerHandler({...})
```

---

## 5. Recommended Fixes

### Fix 1: Update to @nextcloud/viewer Package (CRITICAL)

**File:** `package.json`

Add dependency:
```json
{
  "dependencies": {
    "@nextcloud/viewer": "^14.0.0"
  }
}
```

### Fix 2: Update Script Registration (CRITICAL)

**File:** `lib/Listener/LoadViewer.php`

Change from:
```php
Util::addScript(Application::APP_ID, 'cad-viewer');
```

To:
```php
Util::addInitScript(Application::APP_ID, 'cad-viewer');
```

### Fix 3: Update Viewer Registration (CRITICAL)

**File:** `src/main.ts`

Replace deprecated code with:
```typescript
import { registerHandler } from '@nextcloud/viewer'
import CadViewerHandler from './components/ViewerHandler.vue'

// Register using the new API
registerHandler({
  id: 'cad-viewer',
  group: 'cad',
  mimes: SUPPORTED_MIMES,
  component: CadViewerHandler,
  // Optional download callback
  downloadCallback: async (fileInfo) => {
    // Handle any pre-download logic
    return true
  }
})
```

### Fix 4: Remove Polling Code

Remove the polling and MutationObserver code since it's not needed with the new API:
```typescript
// Remove setupViewerObserver() and all polling code
```

---

## 6. Example Patch

### lib/Listener/LoadViewer.php

```diff
-        Util::addScript(Application::APP_ID, 'cad-viewer');
+        Util::addInitScript(Application::APP_ID, 'cad-viewer');
```

### src/main.ts

```diff
+import { registerHandler } from '@nextcloud/viewer'
 import CadViewerApp from './App.vue'
 import router from './router'
 import CadViewerHandler from './components/ViewerHandler.vue'
 
-// Track if we've already registered to avoid duplicate registrations
-let isRegistered = false
-
-// Register the CAD viewer handler with Nextcloud Viewer
-function registerViewerHandler(): boolean {
-  if (isRegistered) return false
-  
-  if (OCA?.Viewer !== undefined) {
-    OCA.Viewer.registerHandler({
-      id: 'cad-viewer',
-      group: 'cad',
-      mimes: SUPPORTED_MIMES,
-      component: CadViewerHandler,
-    })
-    isRegistered = true
-    console.log('CAD Viewer handler registered successfully')
-    return true
-  }
-  return false
-}
-
-// Set up polling to ensure registration happens when OCA.Viewer becomes available
-function setupViewerPolling(): void {
-  // If already registered, nothing to do
-  if (registerViewerHandler()) return
-  
-  // Poll every 100ms for up to 10 seconds
-  let pollCount = 0
-  const maxPolls = 100
-  
-  const pollInterval = setInterval(() => {
-    if (registerViewerHandler()) {
-      clearInterval(pollInterval)
-      return
-    }
-    
-    pollCount++
-    if (pollCount >= maxPolls) {
-      clearInterval(pollInterval)
-      console.warn('OCA.Viewer not available after 10 seconds, CAD viewer handler not registered')
-    }
-  }, 100)
-}
-
-// Also use MutationObserver to detect when OCA.Viewer becomes available
-function setupViewerObserver(): void {
-  if (isRegistered) return
-
-  // Try immediately first
-  if (registerViewerHandler()) return
-
-  // Set up MutationObserver to watch for OCA object changes
-  if (typeof MutationObserver !== 'undefined') {
-    const observer = new MutationObserver(() => {
-      if (registerViewerHandler()) {
-        observer.disconnect()
-      }
-    })
-    
-    observer.observe(document.documentElement, {
-      childList: true,
-      subtree: true,
-    })
-  }
-  
-  // Also set up polling as backup
-  setupViewerPolling()
-}
-
-// Initialize viewer registration immediately when script loads
-setupViewerObserver()
+// Register the CAD viewer handler with Nextcloud Viewer using the new API
+registerHandler({
+  id: 'cad-viewer',
+  group: 'cad',
+  mimes: SUPPORTED_MIMES,
+  component: CadViewerHandler,
+})
+console.log('CAD Viewer handler registered successfully')
```

### package.json

```diff
   "dependencies": {
+    "@nextcloud/viewer": "^14.0.0",
     "@mlightcad/cad-html-plugin": "1.5.7",
```

---

## 7. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking change to Viewer API | Medium | Test with Nextcloud 33 and 34 |
| Package version mismatch | Low | Use ^14.0.0 for broad compatibility |
| Vue component compatibility | Low | Vue 3 components work with @nextcloud/viewer |

---

## 8. Nextcloud 33+ Compatibility Notes

1. **OCA.Viewer is deprecated** but still functional in NC33
2. **@nextcloud/viewer** is the recommended approach for NC28+
3. **addInitScript** is required for early script loading
4. **@nextcloud/files** v4+ provides file actions for sidebar menus

---

## 9. Verification Steps

After applying fixes:

1. Build the app: `pnpm run build`
2. Package: `make production-setup && make appstore`
3. Install on Nextcloud 33+
4. Open browser console
5. Click a DWG/DXF file
6. Verify: "CAD Viewer handler registered successfully" appears
7. Verify: MLightCAD viewer opens instead of download dialog
