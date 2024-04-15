import { computed } from 'vue'

import { isMouse } from '@/Notivue/utils'
import { useStore } from '@/core/useStore'

export function useMouseEvents() {
   const { timeouts, config } = useStore()

   function pauseHover(e: PointerEvent) {
      if (isMouse(e)) timeouts.pause()
   }

   function resumeHover(e: PointerEvent) {
      if (isMouse(e)) timeouts.resume()
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
