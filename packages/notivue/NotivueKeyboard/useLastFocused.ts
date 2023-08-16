import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'

import { useElements } from '@/core/useStore'

export function useLastFocused() {
   const { wrapper: stream } = useElements()

   const lastFocused = ref<HTMLElement | null>(null)

   function onFocusCapture(e: FocusEvent) {
      const isValidTarget = e.target instanceof HTMLElement

      if (isValidTarget && stream.value?.contains(e.target)) return

      if (isValidTarget) lastFocused.value = e.target
   }

   function focusLastElement() {
      console.log('Focusing last element!', lastFocused.value)

      if (lastFocused.value) {
         lastFocused.value.focus()
      } else {
         /**
          * This may happen once in a lifetime, For example:
          *
          * - On Safari: if users never focused an element with the keyboard
          * before accessing the stream as clicks do not trigger focus.
          *
          * - On Chrome/Firefox: if users never interacted with any element
          * before accessing the stream.
          *
          */
         document.activeElement instanceof HTMLElement && document.activeElement.blur()
         document.body.focus()
      }
   }

   onMounted(() => {
      document.addEventListener('focus', onFocusCapture, true)
   })

   onBeforeUnmount(() => {
      document.removeEventListener('focus', onFocusCapture, true)
   })

   return { focusLastElement }
}
