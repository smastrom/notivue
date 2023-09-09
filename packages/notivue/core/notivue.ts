import { createNotivue } from './createNotivue'

import type { App } from 'vue'
import type { NotivueConfig } from 'notivue'

/**
 * @deprecated
 *
 * **Vite SPA**
 *
 * Since `1.3.0` `createNotivue` can be used instead.
 * This will allow to directly import `push` and create
 * notifications from any file/component.
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
 * Since `1.3.0` you can install the official nuxt module `@nuxtjs/notivue`
 * which provides automatic installation and auto-imports.
 */
export const notivue = {
   install(app: App, config: NotivueConfig = {}) {
      createNotivue(app, config)
   },
}
