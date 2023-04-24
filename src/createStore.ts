import { computed, ref, shallowRef } from 'vue'
import { createPushFn } from './createPush'
import type { IncomingOptions, StoreItem, Store, Push } from './types'

export function createStore(): Store {
   const items = ref<StoreItem[]>([])
   const incoming = shallowRef<IncomingOptions>({} as IncomingOptions)

   const clearAllScheduler = ref(0)
   const isEnabled = ref(true)
   const count = computed(() => items.value.length)
   const hasItems = computed(() => count.value > 0)

   // Exported, used by Receiver

   function createItem(item: StoreItem) {
      items.value.unshift(item)
   }

   function getItem(id: string) {
      return items.value.find(({ id: _id }) => _id === id)
   }

   function updateItem(id: string, options: Partial<StoreItem>) {
      const item = getItem(id) // isReactive(item) -> true

      if (item) {
         Object.assign(item, options)
      }
   }

   function removeItem(id: string) {
      items.value = items.value.filter(({ id: _id }) => _id !== id)
   }

   function animateItem(id: string, className: string, onEnd: () => void) {
      updateItem(id, {
         animationClass: className,
         onAnimationstart: (event: AnimationEvent) => event.stopPropagation(),
         onAnimationend: (event: AnimationEvent) => {
            event.stopPropagation()
            onEnd()
         },
      })
   }

   function updateAll(updateItem: (prevItem: StoreItem) => StoreItem) {
      items.value = items.value.map((prevItem) => updateItem(prevItem))
   }

   function destroyAll() {
      items.value = []
   }

   // push() scoped, not exported

   function enable() {
      isEnabled.value = true
   }

   function disable() {
      isEnabled.value = false
   }

   function setIncoming(options: IncomingOptions) {
      incoming.value = options
   }

   function callItemMethod(id: string, method: 'clear' | 'destroy') {
      getItem(id)?.[method]()
   }

   function scheduleClearAll() {
      clearAllScheduler.value++
   }

   const push: Push = createPushFn({
      setIncoming,
      callItemMethod,
      scheduleClearAll,
      destroyAll,
      enable,
      disable,
      isEnabled,
      count,
   })

   return {
      push,
      items,
      incoming,
      isEnabled,
      clearAllScheduler,
      hasItems,
      createItem,
      getItem,
      animateItem,
      updateItem,
      removeItem,
      updateAll,
      destroyAll,
   }
}
