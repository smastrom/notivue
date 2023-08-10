import { computed, onBeforeUnmount, watchEffect } from 'vue'

import { useNotivue, useItems } from '@/core/useStore'
import { isMouse } from '@/core/utils'

/**
 * The logic follows this pattern:
 *
 * Every time users touch the stream, all notifications
 * will pause and automatically resume after 2 seconds.
 *
 * If users keep tapping on the stream, once timeouts
 * are resumed, they will pause again after 2 seconds and so on.
 *
 * This is never triggered when NotivueSwipe is used as that
 * pointerdown event is not propagated.
 */

export function useTouchEvents() {
   const items = useItems()
   const config = useNotivue()

   let resumeTimeout: ReturnType<typeof setTimeout>

   function pauseTouch(event: PointerEvent) {
      if (!isMouse(event)) {
         items.pauseTimeouts()
         clearTimeout(resumeTimeout)

         resumeTimeout = setTimeout(() => {
            items.resumeTimeouts()
         }, 2000)
      }
   }

   onBeforeUnmount(() => {
      clearTimeout(resumeTimeout)
   })

   return computed(() =>
      config.pauseOnTouch.value && !items.isStreamFocused.value ? { onPointerdown: pauseTouch } : {}
   )
}
