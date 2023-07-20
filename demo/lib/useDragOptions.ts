import { reactive } from 'vue'

import type { NotivueSlot } from 'notivue'
import type { DragOptions } from '@neodrag/vue'

export function useDragOptions(cancelSelectors: string) {
   // Record positions of each notification
   const positions = reactive({}) as Record<string, { x: number; y: number }>

   function setPosition(id: string, x: number) {
      positions[id] = { x, y: 0 }
   }

   return (item: NotivueSlot): DragOptions => {
      if (item.type === 'promise') return { disabled: true }

      return {
         // Position of the notification
         position: positions[item.id] ?? { x: 0, y: 0 },

         // Lock dragging to the x axis
         axis: 'x',
         // Custom class to display a different cursor
         defaultClass: 'Notivue__drag',
         // Prevent dragging when clicking on the close button
         cancel: cancelSelectors,

         onDrag: ({ offsetX, rootNode }) => {
            // Update positions
            setPosition(item.id, offsetX)

            // Do not play any transition as we are moving the notification
            rootNode.style.transitionDuration = '0s'
            // Fade out according to the distance it has been dragged
            rootNode.style.opacity = `${1 - Math.abs(offsetX) / (rootNode.clientWidth * 0.75)}`

            // Call `clear` method if dragged more than the half of the notification's width
            if (Math.abs(offsetX) >= rootNode.clientWidth / 2) {
               item.clear()
            }
         },
         onDragEnd: ({ offsetX, rootNode }) => {
            // When drag ends reset opacity and set a transition duration
            rootNode.style.opacity = '1'
            rootNode.style.transitionDuration = '0.3s'

            // If not swiped enough, reset positions using the above transition duration
            if (Math.abs(offsetX) <= rootNode.clientWidth / 2) {
               setPosition(item.id, 0)
            }
         },
      }
   }
}
