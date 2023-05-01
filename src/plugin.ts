import { createStore } from './createStore'
import { storeSymbol } from './symbols'
import type { Plugin } from 'vue'

export const plugin: Plugin = {
   install(app) {
      app.provide(storeSymbol, createStore())
   },
}
