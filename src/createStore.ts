import { computed, ref, shallowRef } from 'vue'
import { createPush } from './createPush'
import type { IncomingPushOptions, StoreItem, Store } from './types'

export function createStore(): Store {
   const items = ref<StoreItem[]>([])
   const incoming = shallowRef<IncomingPushOptions>({} as IncomingPushOptions)
   const clearAllScheduler = ref(0)
   const isEnabled = ref(true)
   const count = computed(() => items.value.length)
   const hasItems = computed(() => count.value > 0)

   function createItem(item: StoreItem) {
      items.value.unshift(item)
   }

   function getItem(_id: string) {
      return items.value.find(({ id }) => id === _id)
   }

   function updateItem(id: string, options: Partial<StoreItem>) {
      const item = getItem(id) // isReactive(item) -> true

      if (item) {
         Object.assign(item, options)
      }
   }

   function removeItem(_id: string) {
      items.value = items.value.filter(({ id }) => id !== _id)
   }

   function updateAll(updateItem: (prevItem: StoreItem) => StoreItem) {
      items.value = items.value.map((prevItem) => updateItem(prevItem))
   }

   function destroyAll() {
      items.value = []
   }

   const push = createPush({
      setIncoming: (options) => (incoming.value = options),
      enable: () => (isEnabled.value = true),
      disable: () => (isEnabled.value = false),
      callItemMethod: (id: string, method: 'clear' | 'destroy') => getItem(id)?.[method](),
      scheduleClearAll: () => clearAllScheduler.value++,
      destroyAll,
      isEnabled,
      count,
      hasItems,
   })

   return {
      // usePush()
      push,
      // useStore(), internal
      items,
      incoming,
      isEnabled,
      clearAllScheduler,
      hasItems,
      createItem,
      getItem,
      updateItem,
      removeItem,
      updateAll,
      destroyAll,
   }
}
