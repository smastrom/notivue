import { ref, onMounted, onBeforeUnmount } from 'vue'
import { isSSR } from './utils'

export function useReducedMotion() {
   const hasNoPref = ref(true)

   if (isSSR) {
      return hasNoPref
   }

   const mediaQuery = window?.matchMedia('(prefers-reduced-motion: no-preference)')

   function onChange() {
      hasNoPref.value = mediaQuery.matches
   }

   onMounted(() => {
      mediaQuery?.addEventListener('change', onChange)
   })

   onBeforeUnmount(() => {
      mediaQuery?.removeEventListener('change', onChange)
   })

   return hasNoPref
}
