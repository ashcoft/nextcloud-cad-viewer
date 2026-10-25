/// <reference types="jest" />
/**
 * The AssetController serves the worker assets the viewer requests relative to
 * the page ("./assets/<name>"). Its allowlist must stay in sync with the files
 * webpack copies into assets/, or a renamed worker silently 404s.
 *
 * Both files are read as text: importing the webpack config pulls in
 * vue-loader, which needs a Vue-aware transform this Jest setup lacks.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const webpackSource = readFileSync(resolve(__dirname, '../../webpack.config.js'), 'utf8')
const controllerSource = readFileSync(
  resolve(__dirname, '../../lib/Controller/AssetController.php'),
  'utf8',
)

describe('AssetController allowlist', () => {
  it.each([
    'libredwg-parser-worker.js',
    'libredwg-web.wasm',
    'mtext-renderer-worker.js',
  ])('serves %s, which webpack copies', (file) => {
    // Listed in the PHP allowlist...
    expect(controllerSource).toContain(`'${file}' =>`)
    // ...and emitted by webpack under assets/.
    expect(webpackSource).toContain(`assets/${file}`)
  })

  it('does not list assets webpack never copies', () => {
    const listed = [...controllerSource.matchAll(/'([^']+\.(?:js|wasm))' =>/g)].map(
      (match) => match[1],
    )
    expect(listed.length).toBeGreaterThan(0)
    for (const file of listed) {
      expect(webpackSource).toContain(`assets/${file}`)
    }
  })
})
