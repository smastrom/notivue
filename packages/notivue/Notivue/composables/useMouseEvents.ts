import { computed } from 'vue'

import { isMouse } from '@/core/utils'
import { useNotivue, useItems } from '@/core/useStore'

export function useMouseEvents() {
   const items = useItems()
   const config = useNotivue()

   function pauseHover(event: PointerEvent) {
      if (isMouse(event)) items.pauseTimeouts()
   }

   function resumeHover(event: PointerEvent) {
      if (isMouse(event)) items.resumeTimeouts()
   }

   return computed(() =>
      config.pauseOnHover.value && !items.isStreamFocused.value
         ? {
              onPointerenter: pauseHover,
              onPointerleave: resumeHover,
           }
         : {}
   )
}
