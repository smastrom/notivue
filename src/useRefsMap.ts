import { ref, reactive, onBeforeUpdate, type Ref } from 'vue'

export function useRefsMap() {
   const refs = reactive(new Map<string, Ref<HTMLElement>>())

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
