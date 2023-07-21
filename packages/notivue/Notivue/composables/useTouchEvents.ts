import { computed } from 'vue'

import { useNotivue, useItems, usePointer } from '@/core/useStore'
import { isMouse } from '@/core/utils'

/**
 * The logic follows this pattern:
 *
 * Every time the users touch a notification, unless
 * it's a button, all notifications will pause and automatically
 * resume after 2 seconds.
 *
 * If users keep tapping on the notifications, once timeouts
 * are resumed, they will pause again after 2 seconds and so on.
 *
 * 'pointer.isTouching' is used to keep track of the paused/resumed state.
 */

export function useTouchEvents() {
   const pointer = usePointer()
   const items = useItems()
   const config = useNotivue()

   let resumeTimeout: ReturnType<typeof setTimeout>

   function pauseTouch(event: PointerEvent) {
      if (!pointer.isTouching && !isMouse(event)) {
         const isButton = (event.target as HTMLElement).tagName === 'BUTTON'

         if (!isButton) {
            items.pauseTimeouts()
            pointer.toggleTouch()

            clearTimeout(resumeTimeout)
            resumeTimeout = setTimeout(() => {
               items.resumeTimeouts()
               pointer.toggleTouch()
            }, 2000)
         }
      }
   }

   return computed(() => (config.pauseOnTouch.value ? { onPointerdown: pauseTouch } : {}))
}
