import { shallowReactive, shallowRef, type Plugin, type InjectionKey } from 'vue'
import { createPush } from './createPush'
import { defaultSymbol, userSymbols } from './symbols'
import type { PluginOptions, Receiver } from './types'

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

      const receivers = new Map<InjectionKey<Receiver>, Receiver>()

      Object.values(userSymbols)
         .concat(defaultSymbol)
         .forEach((sym) => {
            receivers.set(sym, {
               items: shallowReactive([]),
               incoming: shallowRef(null) as unknown as Receiver['incoming'],
               push: () => createPush(receivers.get(sym) as Receiver),
            })
         })

      receivers.forEach((value, sym) => app.provide(sym, value))
   },
}
