import { watch, type App, type InjectionKey } from 'vue'

import { createPush as createPushSlice } from './createPush'
import {
   createConfigSlice,
   createQueueSlice,
   createItemsSlice,
   createElementsSlice,
   createAnimationsSlice,
   createTimeoutsSlice,
   createProxiesSlice,
} from './createStore'

import type { NotivueConfig, Push, NotivueStore } from 'notivue'

export const notivueInjectionKey = Symbol('') as InjectionKey<NotivueStore>

export function createNotivue(app: App, userConfig: NotivueConfig): Push {
   const config = createConfigSlice(userConfig)
   const queue = createQueueSlice()
   const items = createItemsSlice(config, queue)
   const elements = createElementsSlice()
   const animations = createAnimationsSlice(config, items, queue, elements)
   const timeouts = createTimeoutsSlice(items, animations)

   const pushProxies = createProxiesSlice(config, items, queue, animations, timeouts)

   const push = createPushSlice(pushProxies, {
      onDestroyAll: () => {
         items.clear()
         queue.clear()
      },
      onClearAll: () => animations.playClearAll(),
   })

   watch(
      () => [config.enqueue.value, config.limit.value, config.teleportTo.value],
      () => {
         items.clear()
         queue.clear()
      }
   )

   watch(
      () => items.getLength() === 0 && queue.getLength() === 0,
      (isReset) => {
         if (isReset) {
            console.log('Reset!')

            timeouts.reset()
            animations.resetTransitionData()
         }
      }
   )

   app.provide(notivueInjectionKey, { config, timeouts, animations, push, queue, items, elements })

   return push
}
