import { useItems, useNotivue } from '@/core/useStore'
import { onMounted, onBeforeUnmount } from 'vue'

export function useVisibilityChange() {
   const items = useItems()
   const config = useNotivue()

   function onVisibilityChange() {
      if (items.isStreamFocused.value) return

      if (document.visibilityState === 'visible') {
         if (config.pauseOnTabChange.value) {
            items.resumeTimeouts()
         }
      } else {
         if (config.pauseOnTabChange.value) {
            items.pauseTimeouts()
         } else {
            items.reset()
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
