import { shallowRef, onMounted, onBeforeUnmount } from 'vue'

export function useResizeObserver({ onSizeChange }: { onSizeChange: (id?: string) => void }) {
   const callSet = new Set()
   const resizeObserver = shallowRef<ResizeObserver>()

   onMounted(() => {
      resizeObserver.value = new ResizeObserver((entries, _observer) => {
         entries.forEach((entry) => {
            const id = entry.target.id
            if (!callSet.has(id)) {
               callSet.add(id)
            } else {
               onSizeChange(id)
               _observer.unobserve(entry.target)
               callSet.delete(id)
            }
         })
      })
   })

   onBeforeUnmount(() => {
      resizeObserver.value?.disconnect()
   })

   return resizeObserver
}
