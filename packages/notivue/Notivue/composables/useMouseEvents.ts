import { computed } from 'vue'

import { isMouse } from '@/core/utils'
import { useStore } from '@/core/useStore'

export function useMouseEvents() {
   const { timeouts, config } = useStore()

   function pauseHover(event: PointerEvent) {
      if (isMouse(event)) timeouts.pause()
   }

   function resumeHover(event: PointerEvent) {
      if (isMouse(event)) timeouts.resume()
   }

   return computed(() =>
      config.pauseOnHover.value && !timeouts.isStreamFocused.value
         ? {
              onPointerenter: pauseHover,
              onPointerleave: resumeHover,
           }
         : {}
   )
}
