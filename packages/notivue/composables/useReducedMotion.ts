import { ref, onMounted, onBeforeUnmount } from 'vue'
import { isSSR } from '../core/utils'

export function useReducedMotion() {
   const isReduced = ref(false)

   if (isSSR) return isReduced

   const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduced)')

   function onChange() {
      isReduced.value = mediaQuery.matches
   }

   onMounted(() => {
      mediaQuery.addEventListener('change', onChange)
   })

   onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', onChange)
   })

   return isReduced
}
