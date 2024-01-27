import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useKeyboardFocus() {
   const isKeyboardFocus = ref(false)

   const setKeyboardFocus = () => (isKeyboardFocus.value = true)
   const unsetKeyboardFocus = () => (isKeyboardFocus.value = false)

   const events = [
      ['keydown', setKeyboardFocus],
      ['mousedown', unsetKeyboardFocus],
      ['touchstart', unsetKeyboardFocus],
   ] as const

   onMounted(() => {
      events.forEach(([e, handler]) => document.addEventListener(e, handler))
   })

   onBeforeUnmount(() => {
      events.forEach(([e, handler]) => document.removeEventListener(e, handler))
   })

   return { isKeyboardFocus }
}
