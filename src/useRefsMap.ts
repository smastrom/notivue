import { reactive, computed, onBeforeUpdate } from 'vue'

export function useRefsMap() {
   const refs = reactive(new Map<string, HTMLElement>())

   const sortedIds = computed(() =>
      Array.from(refs.entries())
         .sort(([prevId], [nextId]) => +nextId - +prevId)
         .map(([id]) => id)
   )

   function setRefs(el: HTMLElement | null, key: string) {
      if (el) {
         refs.set(key, el)
      }
   }

   onBeforeUpdate(() => refs.clear())

   return { setRefs, refs, sortedIds }
}
