import { createStore, storeInjectionKey } from './createStore'

import type { App, Plugin } from 'vue'
import type { NotivueConfig } from 'notivue'

export const notivue = {
   install(app: App, config: NotivueConfig = {}) {
      app.provide(storeInjectionKey, createStore(config))
   },
}

export function notivueCypress(config: NotivueConfig = {}): Plugin {
   return {
      install(app) {
         app.provide(storeInjectionKey, createStore(config))
      },
   }
}
