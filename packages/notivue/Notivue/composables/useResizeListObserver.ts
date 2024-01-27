import { onMounted, onBeforeUnmount, watch } from 'vue'

export function useResizeListObserver(elements: HTMLElement[], onSizeChange: () => void) {
   let resizeObserver: ResizeObserver

   const calls = new Set()

   onMounted(() => {
      resizeObserver = new ResizeObserver((entries, observer) => {
         entries.forEach((e) => {
            if (!calls.has(e.target)) {
               calls.add(e.target)
            } else {
               onSizeChange()
               calls.delete(e.target)
               observer.unobserve(e.target)
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
