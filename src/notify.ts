import { createStore } from './createStore'
import { defaultSymbol, userSymbols } from './symbols'
import type { Plugin, InjectionKey } from 'vue'
import type { PluginOptions, Store } from './types'

export const notify: Plugin = {
   install(
      app,
      { additionalReceivers = [] }: PluginOptions = {
         additionalReceivers: [],
      }
   ) {
      additionalReceivers.forEach((key) => {
         userSymbols[key.toString()] = Symbol(key.toString())
      })

      const receivers = new Map<InjectionKey<Store>, Store>()

      Object.values(userSymbols)
         .concat(defaultSymbol)
         .forEach((sym) => {
            receivers.set(sym, createStore())
         })

      receivers.forEach((value, sym) => app.provide(sym, value))
   },
}
