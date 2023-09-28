import { useStore } from '@/core/useStore'
import { onMounted, onBeforeUnmount } from 'vue'

export function useVisibilityChange() {
   const { items, config, timeouts } = useStore()

   function onVisibilityChange() {
      if (timeouts.isStreamFocused.value) return

      if (document.visibilityState === 'visible') {
         if (config.pauseOnTabChange.value) {
            timeouts.resume()
         }
      } else {
         if (config.pauseOnTabChange.value) {
            timeouts.pause()
         } else {
            items.clear()
         }
      }
   }

   onMounted(() => {
      document.addEventListener('visibilitychange', onVisibilityChange)
   })

   onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
   })
}
