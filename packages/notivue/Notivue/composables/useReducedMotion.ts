import { useStore } from '@/core/useStore'
import { onBeforeUnmount, onMounted } from 'vue'

export function useReducedMotion() {
   const { animations } = useStore()

   const query = window.matchMedia('(prefers-reduced-motion: reduce)')

   const onMatch = () => animations.setReducedMotion(query.matches)

   onMounted(() => {
      onMatch()
      query.addEventListener?.('change', onMatch)
   })

   onBeforeUnmount(() => {
      query.removeEventListener?.('change', onMatch)
   })
}
