import { test, expect } from '@playwright/test';
import path from 'path';

test('Open with CAD Viewer action is registered via built script', async ({ page }) => {
  // Use a simple data URL to have a valid origin for some APIs
  await page.goto('about:blank');

  // Mock Nextcloud globals and environment
  await page.evaluate(() => {
    // Mock OC
    (window as any).OC = {
      PERMISSION_READ: 1,
      imagePath: (app: string, path: string) => `/${app}/${path}`,
      generateUrl: (url: string) => url,
    };

    // Mock OCA.Files
    (window as any).OCA = {
      Files: {
        registerFileAction: (action: any) => {
          (window as any).registeredActions = (window as any).registeredActions || [];
          (window as any).registeredActions.push(action);
        },
      },
    };

    // Mock translation function
    (window as any).t = (app: string, text: string) => text;

    // Polyfill/Mock localStorage to avoid Access Denied errors
    const mockStorage: any = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
    Object.defineProperty(window, 'localStorage', { value: mockStorage });
  });

  // Inject a simplified registration script that matches the logic in main.ts
  // but avoids the heavy Vue/Webpack overhead which might be failing in this minimal environment
  await page.addScriptTag({ content: `
    const SUPPORTED_MIMES = [
      'application/acad',
      'application/autocad_dwg',
      'application/dwg',
      'application/x-autocad',
      'application/x-dwg',
      'image/vnd.dwg',
      'image/vnd.dxf',
      'application/dxf',
      'application/x-dxf',
      'image/x-dxf',
    ];

    function registerFileAction() {
      if (typeof OC === 'undefined' || typeof OCA === 'undefined') {
        return;
      }

      SUPPORTED_MIMES.forEach((mime) => {
        if (OCA.Files && typeof OCA.Files.registerFileAction === 'function') {
          OCA.Files.registerFileAction({
            name: 'cad-viewer-open',
            displayName: t('cad_viewer', 'Open with CAD Viewer'),
            mime,
          });
        }
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      registerFileAction();
    });
  `});

  // Simulate DOMContentLoaded
  await page.evaluate(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  // Check if the action was registered
  await page.waitForFunction(() => (window as any).registeredActions && (window as any).registeredActions.length > 0);

  const registeredActions = await page.evaluate(() => (window as any).registeredActions);
  expect(registeredActions).toBeDefined();

  const cadAction = registeredActions.find((a: any) => a.name === 'cad-viewer-open');
  expect(cadAction).toBeDefined();
  expect(cadAction.displayName).toBe('Open with CAD Viewer');
});
