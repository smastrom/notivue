import { computed, ref, shallowRef } from 'vue'
import { createPush } from './createPush'
import type { IncomingPushOptions, StoreItem, Store } from './types'

export function createStore(): Store {
   const items = ref<StoreItem[]>([])
   const incoming = shallowRef<IncomingPushOptions>({} as IncomingPushOptions)
   const isEnabled = ref(true)
   const clearAllTrigger = ref(0)

   const count = computed(() => items.value.length)
   const hasItems = computed(() => count.value > 0)

   function createItem(item: StoreItem) {
      items.value.unshift(item)
   }

   function getItem(_id: string) {
      return items.value.find(({ id }) => id === _id)
   }

   function updateItem(id: string, options: Partial<StoreItem>) {
      Object.assign(getItem(id) ?? {}, options)
   }

   function updateAll(updateItem: (item: StoreItem) => StoreItem) {
      items.value = items.value.map((item) => updateItem(item))
   }

   function removeItem(_id: string) {
      items.value = items.value.filter(({ id }) => id !== _id)
   }

   function destroyAll() {
      items.value = []
   }

   // Internal unexported methods, used by createPush()

   function setIncoming(options: IncomingPushOptions) {
      incoming.value = options
   }

   function enable() {
      isEnabled.value = true
   }

   function disable() {
      isEnabled.value = false
   }

   function callItemMethod(id: string, method: 'clear' | 'destroy') {
      getItem(id)?.[method]()
   }

   function clearAll() {
      clearAllTrigger.value++
   }

   const push = createPush({
      setIncoming,
      enable,
      disable,
      callItemMethod,
      clearAll,
      destroyAll,
      isEnabled,
      count,
   })

   return {
      // usePush()
      push,
      // useStore()
      items,
      incoming,
      isEnabled,
      clearAllTrigger,
      hasItems,
      createItem,
      getItem,
      updateItem,
      removeItem,
      updateAll,
      destroyAll,
   }
}
