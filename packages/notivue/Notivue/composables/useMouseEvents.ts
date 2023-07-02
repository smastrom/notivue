import { computed } from 'vue'

import { isMouse } from '@/core/utils'
import { useNotivue, useItems, usePointer } from '@/core/useStore'

export function useMouseEvents() {
   const pointer = usePointer()
   const items = useItems()
   const config = useNotivue()

   function pauseHover(event: PointerEvent) {
      if (!pointer.isHovering && isMouse(event)) {
         items.pauseTimeouts()
         pointer.toggleHover()
      }
   }

   function resumeHover(event: PointerEvent) {
      if (pointer.isHovering && isMouse(event)) {
         items.resumeTimeouts()
         pointer.toggleHover()
      }
   }

   return computed(() =>
      config.pauseOnHover.value
         ? {
              onPointerenter: pauseHover,
              onPointerleave: resumeHover,
           }
         : {}
   )
}
