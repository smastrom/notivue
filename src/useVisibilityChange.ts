import { onMounted, onBeforeUnmount } from 'vue'

export function useVisibilityChange({
   onVisible,
   onHidden,
}: {
   onVisible: () => void
   onHidden: () => void
}) {
   function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
         onVisible()
      } else {
         onHidden()
      }
   }

   onMounted(() => {
      document.addEventListener('visibilitychange', onVisibilityChange)
   })

   onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
   })
}
