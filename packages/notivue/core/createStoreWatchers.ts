import { watch } from 'vue'

import type { NotivueStore } from 'notivue'

export function createStoreWatchers(store: NotivueStore) {
   const unwatchCount = watch(
      () => [
         store.items.createdCount.value,
         store.items.clearedCount.value,
         store.items.destroyedCount.value,
      ],
      () => {
         store.animations.updatePositions()
      },
      { flush: 'post' }
   )

   const unwatchPosition = watch(
      store.config.position,
      () => {
         store.animations.updatePositions({ isImmediate: true })
      },
      { flush: 'post' }
   )

   const unwatchRoot = watch(
      () => store.items.length === 0 && store.queue.length === 0,
      (isReset) => {
         if (isReset) {
            store.timeouts.reset()
            store.elements.setRootAttrs({})
         }
      },
      { flush: 'post' }
   )

   const unwatchAnimations = watch(
      () => store.config.animations.value.enter,
      (newEnter, prevEnter) => {
         if (newEnter !== prevEnter) {
            store.animations.resetTransitionStyles()
         }
      }
   )

   return () => {
      unwatchCount()
      unwatchPosition()
      unwatchRoot()
      unwatchAnimations()
   }
}
