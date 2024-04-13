import { onMounted, onBeforeUnmount, watch } from 'vue'

export function useResizeListObserver(elements: HTMLElement[], onSizeChange: () => void) {
   let resizeObserver: ResizeObserver

   const calls = new WeakSet()

   onMounted(() => {
      resizeObserver = new ResizeObserver((entries, observer) => {
         for (const e of entries) {
            if (!calls.has(e.target)) {
               // The element is being added to the DOM, skip
               calls.add(e.target)
            } else {
               // The element is being removed from the DOM and its height never changed, remove
               if (Object.values(e.contentRect.toJSON()).every((val) => val === 0)) {
                  calls.delete(e.target)
                  observer.unobserve(e.target)
               } else {
                  // The element actually changed size, trigger callback and remove
                  console.log('ResizeObserver Triggered')

                  onSizeChange()
                  calls.delete(e.target)
                  observer.unobserve(e.target)
               }
            }
         }
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
