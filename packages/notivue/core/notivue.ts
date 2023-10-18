import { createNotivue } from './createNotivue'

import type { App } from 'vue'
import type { NotivueConfig } from 'notivue'

/**
 * @deprecated
 *
 * **Single-page app (Vite, Webpack, etc)**
 *
 * Since `1.3.0` `createNotivue` can be used instead.
 * This allows to directly import `push` in
 * any file/component.
 *
 * ```ts
 * import { createNotivue } from 'notivue'
 *
 * const app = createApp(App)
 * export const push = createNotivue(app, config)
 * ```
 *
 * **Nuxt**
 *
 * Since `1.3.0` you can use the built-in nuxt module `notivue/nuxt`
 * which provides automatic plugin installation and auto-imports.
 *
 * Documentation: https://notivue.netlify.app
 */
export const notivue = {
   install(app: App, config: NotivueConfig = {}) {
      createNotivue(app, config)
   },
}
