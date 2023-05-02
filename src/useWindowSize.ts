import { onBeforeUnmount, onMounted } from 'vue'
import { isSSR } from './utils'

export function useWindowSize(onResize: () => void) {
   if (isSSR) return

   function _onResize() {
      // Below this width always reposition
      if (window.matchMedia('(max-width: 768px)').matches) {
         onResize()
      }
   }

   onMounted(() => {
      window.addEventListener('resize', _onResize)
   })

   onBeforeUnmount(() => {
      window.removeEventListener('resize', _onResize)
   })
}
