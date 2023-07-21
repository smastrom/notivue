import { watch } from 'vue'

import { useElements, useItems } from '@/core/useStore'
import { isSSR } from '@/core/utils'

export function useFocusEvents() {
   const items = useItems()
   const elements = useElements()

   function pauseTimeouts() {
      items.pauseTimeouts()
   }

   function resumeTimeouts() {
      items.resumeTimeouts()
   }

   /**
    * Using a Set for better control instead of the watcher cleanup function.
    * Listener will in any case garbage collected when the notification is removed.
    */
   const buttonSet = new Set<HTMLButtonElement>()

   watch(
      elements.items.value,
      (newItems) => {
         if (isSSR) return

         buttonSet.forEach((button) => {
            if (!elements.wrapper.value?.contains(button)) buttonSet.delete(button)
         })

         newItems.forEach((el) => {
            el.querySelectorAll('button').forEach((button) => {
               if (buttonSet.has(button)) return

               button.addEventListener('focus', pauseTimeouts)
               button.addEventListener('blur', resumeTimeouts)
               button.addEventListener('click', (event) => {
                  // If keyboard
                  if (event.detail === 0) resumeTimeouts()
               })

               buttonSet.add(button)
            })
         })
      },
      { flush: 'post' }
   )
}
