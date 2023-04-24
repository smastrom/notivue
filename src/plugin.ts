import { createStore } from './createStore'
import { defaultSymbol, userSymbols } from './symbols'
import type { Plugin, InjectionKey } from 'vue'
import type { PluginOptions, Store, Push } from './types'

declare module 'vue' {
   interface ComponentCustomProperties {
      $push: Push
   }
}

export const plugin: Plugin = {
   install(
      app,
      { register = [] }: PluginOptions = {
         register: [],
      }
   ) {
      register.forEach((key) => (userSymbols[key.toString()] = Symbol(key.toString())))

      const receivers = new Map<InjectionKey<Store>, Store>()

      Object.values(userSymbols)
         .concat(defaultSymbol)
         .forEach((sym) => receivers.set(sym, createStore()))

      receivers.forEach((value, sym) => app.provide(sym, value))

      if (!app.config.globalProperties.$push && receivers.get(defaultSymbol)) {
         app.config.globalProperties.$push = receivers.get(defaultSymbol)!.push
      }
   },
}
