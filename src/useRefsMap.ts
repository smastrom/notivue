import { ref, onBeforeUpdate, type Ref } from 'vue'

export function useRefsMap() {
   const refs = new Map<string, Ref<HTMLElement>>()

   async function setRefs(_ref: HTMLElement | null, key: string) {
      if (_ref) {
         refs.set(key, ref(_ref))
      }
   }

   onBeforeUpdate(() => {
      refs.clear()
   })

   return { refs, setRefs }
}
