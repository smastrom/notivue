import { watch } from 'vue'

import type { NotivueStore } from 'notivue'

export function createWatchers(store: NotivueStore) {
   watch(
      store.config.isTopAlign,
      () => {
         store.animations.updatePositions({ isImmediate: true })
      },
      { flush: 'post' }
   )

   watch(
      () => store.items.length,
      () => {
         store.animations.updatePositions()
      },
      { flush: 'post' }
   )

   watch(
      () => store.items.length === 0 && store.queue.length === 0,
      (isReset) => {
         if (isReset) {
            store.timeouts.reset()
            store.elements.setRootAttrs({})
         }
      },
      { flush: 'post' }
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
