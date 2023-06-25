import { createStore } from './createStore'
import { storeInjectionKey } from './symbols'

import type { Plugin } from 'vue'
import type { _NotivueConfig, DeepPartial } from '../types'

export const notivue: Plugin = {
   install(app, config: DeepPartial<_NotivueConfig> = {}) {
      app.provide(storeInjectionKey, createStore(config))
   },
}
