import { computed, onBeforeUnmount, watchEffect } from 'vue'

import { useNotivue, useItems, usePointer, useElements } from '@/core/useStore'
import { isMouse } from '@/core/utils'

/**
 * The logic follows this pattern:
 *
 * 1. Leave animation timeouts are paused if tapping on the list container.
 * Event listener is added on the same element in Notivue.vue.
 *
 * 2. Leave animation timeouts are resumed either:
 * - After 1.5 seconds that have been paused
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
   const config = useNotivue()

   let autoResumeTimeout: ReturnType<typeof setTimeout>

   function autoResumeTouch() {
      items.resumeTimeouts()
      pointer.toggleTouch()
   }

   function pauseTouch(event: PointerEvent) {
      if (!pointer.isTouching && !isMouse(event)) {
         const isCloseButton = (event.target as HTMLElement).tagName === 'BUTTON'

         if (!isCloseButton) {
            items.pauseTimeouts()
            pointer.toggleTouch()

            removeTouchListener()
            document.addEventListener('pointerdown', resumeTouch)

            clearTimeout(autoResumeTimeout)
            autoResumeTimeout = setTimeout(autoResumeTouch, 1500)
         }
      }
   }

   function resumeTouch(event: PointerEvent) {
      if (pointer.isTouching && !isMouse(event)) {
         const isOutside = !elements.wrapper.value!.contains(event.target as Node)
         const isCloseButton = !isOutside && (event.target as HTMLElement).tagName === 'BUTTON'

         if (isOutside || isCloseButton) {
            clearTimeout(autoResumeTimeout)
            autoResumeTouch()
         }
      }
   }

   // Listeners

   function removeTouchListener() {
      document.removeEventListener('pointerdown', resumeTouch)
   }

   watchEffect(() => {
      if (items.data.value.length === 0 || !config.pauseOnTouch.value) {
         pointer.reset()
         removeTouchListener()
      }
   })

   onBeforeUnmount(removeTouchListener)

   return computed(() => (config.pauseOnTouch.value ? { onPointerdown: pauseTouch } : {}))
}
