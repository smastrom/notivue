import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useFocusDevice() {
   const isKeyboard = ref(false)

   const setKeyboardFocus = () => (isKeyboard.value = true)
   const unsetKeyboardFocus = () => (isKeyboard.value = false)

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

   return { isKeyboard }
}
