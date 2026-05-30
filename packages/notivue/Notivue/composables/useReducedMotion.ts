import { onBeforeUnmount, onMounted } from 'vue'

import { useStore } from '@/core/useStore'

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
