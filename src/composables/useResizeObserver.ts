import { onMounted, onBeforeUnmount, watch, type ComputedRef } from 'vue'

export function useResizeObserver(elements: HTMLElement[], onSizeChange: () => void) {
   let resizeObserver: ResizeObserver

   const calls = new Set()

   onMounted(() => {
      resizeObserver = new ResizeObserver((entries, observer) => {
         entries.forEach((entry) => {
            if (!calls.has(entry.target)) {
               calls.add(entry.target)
            } else {
               onSizeChange()
               calls.delete(entry.target)
               observer.unobserve(entry.target)
            }
         })
      })
   })

   watch(
      elements,
      (el) => {
         if (el.length > 0) el.forEach((el) => resizeObserver?.observe(el))
      },
      { flush: 'post' }
   )

   onBeforeUnmount(() => {
      resizeObserver?.disconnect()
   })
}
