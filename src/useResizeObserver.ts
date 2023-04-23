import { shallowRef, onMounted, onBeforeUnmount } from 'vue'

export function useResizeObserver(onSizeChange: () => void) {
   const calls = new Set()
   const resizeObserver = shallowRef<ResizeObserver>()

   onMounted(() => {
      resizeObserver.value = new ResizeObserver((entries, _observer) => {
         entries.forEach((entry) => {
            if (!calls.has(entry.target)) {
               calls.add(entry.target)
            } else {
               onSizeChange()
               calls.delete(entry.target)
               _observer.unobserve(entry.target)
            }
         })
      })
   })

   onBeforeUnmount(() => {
      resizeObserver.value?.disconnect()
   })

   return resizeObserver
}
