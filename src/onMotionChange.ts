import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import { isSSR } from './utils'

export function onMotionChange(isAnimated: Ref<boolean>) {
   if (isSSR) {
      return
   }

   const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')

   function onChange() {
      isAnimated.value = mediaQuery.matches
   }

   onMounted(() => {
      mediaQuery.addEventListener('change', onChange)
   })

   onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', onChange)
   })
}
