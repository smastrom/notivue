import { onBeforeUnmount, onMounted } from 'vue'
import { isSSR } from '../core/utils'

export function useWindowSize(onResize: () => void) {
   if (isSSR) return

   function _onResize() {
      if (window.matchMedia('(max-width: 1100px)').matches) {
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
