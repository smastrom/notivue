import { computed } from 'vue'

import { useStore } from '@/core/useStore'

export function useFocusEvents() {
   const { timeouts } = useStore()

   function onFocusin() {
      timeouts.pause()
   }

   function onFocusout(e: FocusEvent) {
      const stream = e.currentTarget as HTMLElement
      const newTarget = e.relatedTarget as HTMLElement | null

      if (!newTarget || !stream.contains(newTarget)) {
         timeouts.resume()
      }
   }

   return computed(() => (!timeouts.isStreamFocused.value ? { onFocusin, onFocusout } : {}))
}
