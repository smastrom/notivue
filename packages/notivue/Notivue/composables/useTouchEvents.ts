import { computed, onBeforeUnmount } from 'vue'

import { useStore } from '@/core/useStore'
import { isMouse } from '@/core/utils'

/**
 * The logic follows this pattern:
 *
 * Every time users tap the stream, all notifications
 * will pause and automatically resume after 2 seconds.
 *
 * If users keep tapping on the stream, once timeouts
 * are resumed, they will pause again after 2 seconds and so on.
 *
 * This is never triggered when NotivueSwipe is used as that
 * pointerdown event is not propagated.
 */

export function useTouchEvents() {
   const { timeouts, config } = useStore()

   function pauseTouch(event: PointerEvent) {
      if (!isMouse(event)) {
         window.clearTimeout(timeouts.touchDebounceTimeout)
         timeouts.pause()

         timeouts.touchDebounceTimeout = window.setTimeout(() => {
            timeouts.resume()
         }, 2000)
      }
   }

   onBeforeUnmount(() => {
      window.clearTimeout(timeouts.touchDebounceTimeout)
   })

   return computed(() =>
      config.pauseOnTouch.value && !timeouts.isStreamFocused.value
         ? { onPointerdown: pauseTouch }
         : {}
   )
}
