import { shallowReactive, shallowRef, type Plugin, type InjectionKey } from 'vue'
import { createPush } from './createPush'
import { notifySyms, userSyms } from './symbols'
import type { PluginOptions, Receiver as ReceiverT } from './types'

export const notify: Plugin = {
   install(
      app,
      { additionalReceivers = [] }: PluginOptions = {
         additionalReceivers: [],
      }
   ) {
      const receivers = new Map<InjectionKey<ReceiverT>, ReceiverT>()

      additionalReceivers.forEach((key) => {
         userSyms[key.toString()] = Symbol(key.toString())
      })

      notifySyms.push(...Object.values(userSyms))

      notifySyms.forEach((sym) => {
         receivers.set(sym, {
            items: shallowReactive([]),
            incoming: shallowRef({}) as ReceiverT['incoming'],
            push: () => createPush(receivers.get(sym) as ReceiverT),
         })
      })

      receivers.forEach((value, sym) => app.provide(sym, value))
   },
}
