import { useStore } from '@/core/useStore'

export function useFocusEvents() {
   const { timeouts } = useStore()

   function onFocusin() {
      timeouts.setStreamFocus()
      timeouts.pause()
   }

   function onFocusout(e: FocusEvent) {
      const stream = e.currentTarget as HTMLElement
      const newTarget = e.relatedTarget as HTMLElement | null

      if (!newTarget || !stream.contains(newTarget)) {
         timeouts.setStreamFocus(false)
         timeouts.resume()
      }
   }

   return { onFocusin, onFocusout }
}
