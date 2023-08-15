import { createStore, storeInjectionKey } from './createStore'

import type { App } from 'vue'
import type { NotivueConfig } from 'notivue'

export const notivue = {
   install(app: App, config: NotivueConfig = {}) {
      app.provide(storeInjectionKey, createStore(config))
   },
}
