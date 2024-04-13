import { onMounted, onBeforeUnmount } from 'vue'

import { useStore } from '@/core/useStore'

export function useWindowFocus() {
   const { config, timeouts } = useStore()

   function onWinFocus() {
      if (timeouts.isStreamFocused.value) return
      if (config.pauseOnTabChange.value) timeouts.resume()
   }

   function onWinBlur() {
      if (timeouts.isStreamFocused.value) return
      if (config.pauseOnTabChange.value) timeouts.pause()
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
