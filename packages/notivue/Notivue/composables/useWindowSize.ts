import { onBeforeUnmount, onMounted } from 'vue'

export function useWindowSize(onResize: () => void) {
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
