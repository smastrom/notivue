import { onMounted, onBeforeUnmount } from 'vue'

import { useStore } from '@/core/useStore'

export function useWindowFocus() {
   const { config, timeouts } = useStore()

   function onFocus() {
      if (timeouts.isStreamFocused.value) return
      if (config.pauseOnTabChange.value) timeouts.resume()
   }

   function onBlur() {
      if (timeouts.isStreamFocused.value) return
      if (config.pauseOnTabChange.value) timeouts.pause()
   }

   onMounted(() => {
      window.addEventListener('focus', onFocus)
      window.addEventListener('blur', onBlur)
   })

   onBeforeUnmount(() => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
   })
}
