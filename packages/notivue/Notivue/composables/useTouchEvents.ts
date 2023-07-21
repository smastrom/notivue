import { computed } from 'vue'

import { useNotivue, useItems } from '@/core/useStore'
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
 */

export function useTouchEvents() {
   const items = useItems()
   const config = useNotivue()

   let resumeTimeout: ReturnType<typeof setTimeout>

   function pauseTouch(event: PointerEvent) {
      if (!isMouse(event)) {
         const isButton = (event.target as HTMLElement).tagName === 'BUTTON'

         if (!isButton) {
            items.pauseTimeouts()

            clearTimeout(resumeTimeout)
            resumeTimeout = setTimeout(() => {
               items.resumeTimeouts()
            }, 2000)
         }
      }
   }

   return computed(() => (config.pauseOnTouch.value ? { onPointerdown: pauseTouch } : {}))
}
