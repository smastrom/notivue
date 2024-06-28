import { NotivueConfig } from 'notivue'

import type { Plugin, App } from 'vue'

export function createNotivue(
   pluginConfig: NotivueConfig & {
      startOnCreation?: boolean
   } = {}
): Plugin {
   return {
      install(app: App) {
         Object.assign(app.config.globalProperties, {
            notivuePluginConfig: pluginConfig,
         })
      },
   }
}
