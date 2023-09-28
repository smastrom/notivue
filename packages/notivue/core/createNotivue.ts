import { watch, type App, type InjectionKey } from 'vue'

import { TransitionType as TType } from './constants'
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

export function createNotivue(app: App, userConfig: NotivueConfig = {}): Push {
   const config = createConfigSlice(userConfig)
   const elements = createElementsSlice()
   const queue = createQueueSlice()
   const items = createItemsSlice(config, queue)
   const animations = createAnimationsSlice(config, items, elements)
   const timeouts = createTimeoutsSlice(items, animations)

   const proxies = createProxiesSlice({ config, items, queue, animations, timeouts })
   const push = Object.freeze(createPushSlice(proxies))

   watch(config.isTopAlign, () => animations.updatePositions(TType.IMMEDIATE))

   watch(
      () => items.getLength(),
      () => animations.updatePositions(TType.PUSH)
   )

   watch(
      () => items.getLength() === 0 && queue.getLength() === 0,
      (isReset) => {
         if (isReset) {
            timeouts.reset()
            elements.setRootAttrs({})

            console.log('Reset!')
         }
      }
   )

   watch(
      () => config.animations.value.enter,
      (newEnter, prevEnter) => {
         if (newEnter !== prevEnter) {
            console.log('Resetting transition data!')
            animations.resetTransitionData()
         }
      }
   )

   app.provide(notivueInjectionKey, { config, timeouts, animations, push, queue, items, elements })

   return push
}
