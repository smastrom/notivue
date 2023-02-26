import { shallowRef, onMounted, onBeforeUnmount } from 'vue'

export function useResizeObserver(onSizeChange: () => void) {
   const callSet = new Set()
   const resizeObserver = shallowRef<ResizeObserver>()

   onMounted(() => {
      resizeObserver.value = new ResizeObserver((entries, _observer) => {
         entries.forEach((entry) => {
            if (!callSet.has(entry.target)) {
               callSet.add(entry.target)
            } else {
               onSizeChange()
               callSet.delete(entry.target)
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
