import { useStore } from '@/core/useStore'
import { onBeforeUnmount, onMounted } from 'vue'

export function useReducedMotion() {
   const { animations } = useStore()

   const query = window.matchMedia('(prefers-reduced-motion: reduce)')

   const onMatch = () => animations.setReducedMotion(query.matches)

   onMounted(() => {
      onMatch()
      if (query.addEventListener) {
         query.addEventListener('change', onMatch)
      }
   })

   onBeforeUnmount(() => {
      if (query.removeEventListener) {
         query.removeEventListener('change', onMatch)
      }
   })
}
