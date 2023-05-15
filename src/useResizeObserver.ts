import { onMounted, onBeforeUnmount, watch, type ComputedRef } from 'vue'

export function useResizeObserver(refs: ComputedRef<HTMLElement[]>, onSizeChange: () => void) {
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
      refs,
      (_refs) => {
         if (_refs.length > 0) {
            _refs.forEach((ref) => resizeObserver?.observe(ref))
         }
      },
      { flush: 'post' }
   )

   onBeforeUnmount(() => {
      resizeObserver?.disconnect()
   })
}
