import type { Plugin, App } from 'vue'

import { NotivueConfig } from 'notivue'

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
