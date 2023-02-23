import { reactive, computed, onBeforeUpdate } from 'vue'

export function useRefsMap() {
   const refs = reactive(new Map<string, HTMLElement>())

   const refsData = computed(() => {
      const entries = Array.from(refs.entries()).sort(
         ([prevId], [nextId]) => Number(nextId) - Number(prevId)
      )

      return {
         ids: entries.map(([id]) => id),
         heights: entries.map(([, el]) => el.clientHeight),
      }
   })

   function setRefs(el: HTMLElement | null, key: string) {
      if (el) {
         refs.set(key, el)
      }
   }

   onBeforeUpdate(() => {
      refs.clear()
   })

   return { refs, refsData, setRefs }
}
