import { onMounted, onBeforeUnmount } from 'vue'

import { useStore } from '@/core/useStore'

export function useWindowFocus() {
   const { items, config, timeouts } = useStore()

   function onWinFocus() {
      if (timeouts.isStreamFocused.value) return

      if (config.pauseOnTabChange.value) {
         timeouts.resume()
      }
   }

   function onWinBlur() {
      if (timeouts.isStreamFocused.value) return

      if (config.pauseOnTabChange.value) {
         timeouts.pause()
      } else {
         items.clear()
      }
   }

   onMounted(() => {
      window.addEventListener('focus', onWinFocus)
      window.addEventListener('blur', onWinBlur)
   })

   onBeforeUnmount(() => {
      window.removeEventListener('focus', onWinFocus)
      window.removeEventListener('blur', onWinBlur)
   })
}
