import { ref, shallowRef } from 'vue'
import { createPush as _createPush } from './createPush'
import type { IncomingOptions, Notification } from './types'

export function createStore() {
   const items = ref([])
   const incoming = shallowRef({})
   const clear = ref(false)

   function setIncoming(options: IncomingOptions) {
      incoming.value = options
   }

   function createItem(item: Notification) {
      items.value.push(item)
   }

   function clearItem(id: string) {
      getItem(id)?.clear()
   }

   function destroyAll() {
      items.value = []
   }

   function getItem(id: string) {
      return items.value.find(({ id: _id }) => _id === id)
   }

   function updateItem(id: string, options: Partial<Notification>) {
      const item = getItem(id)

      if (item) {
         Object.assign(item, options)
      }
   }

   function removeItem(id: string) {
      items.value = items.value.filter(({ id: _id }) => _id !== id)
   }

   function animateItem(id: string, className: string, onEnd: () => void) {
      updateItem(id, {
         animClass: className,
         onAnimationstart: (event: AnimationEvent) => event.stopPropagation(),
         onAnimationend: (event: AnimationEvent) => {
            event.stopPropagation()
            onEnd()
         },
      })
   }

   function updateAll(onUpdate: (prevItem: Notification) => Notification) {
      items.value = items.value.map((prevItem) => onUpdate(prevItem))
   }

   function createPush() {
      return _createPush(setIncoming, clearItem, clearAll, destroyAll)
   }

   function clearAll() {
      clear.value = true
   }

   function resetClearAll() {
      clear.value = false
   }

   return {
      items,
      incoming,
      clear,
      createItem,
      createPush,
      getItem,
      animateItem,
      updateItem,
      removeItem,
      updateAll,
      destroyAll,
      resetClearAll,
   }
}
