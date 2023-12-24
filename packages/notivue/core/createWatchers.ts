import { watch } from 'vue'
import { TransitionType as TType } from './constants'

import type { NotivueStore } from 'notivue'

export function createWatchers(store: NotivueStore) {
   watch(store.config.isTopAlign, () => {
      store.animations.updatePositions(TType.IMMEDIATE)
   })

   watch(
      () => store.items.length,
      () => store.animations.updatePositions(TType.PUSH),
      { flush: 'post' }
   )

   watch(
      () => store.items.length === 0 && store.queue.length === 0,
      (isReset) => {
         if (isReset) {
            store.timeouts.reset()
            store.elements.setRootAttrs({})
         }
      }
   )

   watch(
      () => store.config.animations.value.enter,
      (newEnter, prevEnter) => {
         if (newEnter !== prevEnter) {
            store.animations.resetTransitionData()
         }
      }
   )
}
