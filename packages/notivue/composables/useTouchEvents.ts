import { computed, watchEffect } from 'vue'

import { useConfig, useItems, usePointer, useElements } from './useStore'
import { isMouse } from '../core/utils'

/**
 * The logic follows this pattern:
 *
 * 1. Leave animation timeouts are paused if tapping on the list container.
 * Event listener is added on the same element in Notivue.vue.
 *
 * 2. Leave animation timeouts are resumed either:
 * - If tapping outside the list
 * - If clicking any button in the notification
 * Event listener is added on the document.
 *
 * 3. Since 'pauseOnTouch' prop is reactive, listeners are also toggled using a watcher.
 */
export function useTouchEvents() {
   const elements = useElements()
   const pointer = usePointer()
   const items = useItems()
   const config = useConfig()

   function pauseTouch(event: PointerEvent) {
      if (!pointer.isTouching && !isMouse(event)) {
         const isCloseButton = (event.target as HTMLElement).tagName === 'BUTTON'

         if (!isCloseButton) {
            items.pauseTimeouts()
            pointer.toggleTouch()

            removeTouchListener()
            document.addEventListener('pointerdown', resumeTouch)
         }
      }
   }

   function resumeTouch(event: PointerEvent) {
      if (pointer.isTouching && !isMouse(event)) {
         const isOutside = !elements.wrapper.value!.contains(event.target as Node)
         const isCloseButton = !isOutside && (event.target as HTMLElement).tagName === 'BUTTON'

         if (isOutside || isCloseButton) {
            items.resumeTimeouts()
            pointer.toggleTouch()
         }
      }
   }

   // Listeners

   function removeTouchListener() {
      document.removeEventListener('pointerdown', resumeTouch)
   }

   watchEffect(() => {
      if (!config.pauseOnTouch.value) removeTouchListener()
   })

   watchEffect(() => {
      if (items.data.value.length === 0) {
         pointer.reset()
         removeTouchListener()
      }
   })

   return computed(() => (config.pauseOnTouch.value ? { onPointerdown: pauseTouch } : {}))
}
