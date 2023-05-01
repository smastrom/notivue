import { computed, ref, shallowRef } from 'vue'
import { createPush } from './createPush'
import type { IncomingPushOptions, StoreItem, Store } from './types'

export function createStore(): Partial<Store> {
   const items = ref<StoreItem[]>([])
   const incoming = shallowRef<IncomingPushOptions>({} as IncomingPushOptions)
   const clearAllTrigger = ref(0)
   const hasItems = computed(() => items.value.length > 0)

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

   function setIncoming(options: IncomingPushOptions) {
      incoming.value = options
   }

   function callItemMethod(id: string, method: 'clear' | 'destroy') {
      getItem(id)?.[method]()
   }

   function clearAll() {
      clearAllTrigger.value++
   }

   const push = createPush({
      setIncoming,
      callItemMethod,
      clearAll,
      destroyAll,
   })

   return {
      // useStore()
      items,
      incoming,
      clearAllTrigger,
      hasItems,
      createItem,
      getItem,
      updateItem,
      removeItem,
      updateAll,
      destroyAll,
      // usePush()
      push,
   }
}
