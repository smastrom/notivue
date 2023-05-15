import { createStore } from './createStore'
import { storeInjectionKey } from './symbols'
import type { Plugin } from 'vue'

export const plugin: Plugin = {
   install(app) {
      app.provide(storeInjectionKey, createStore())
   },
}
