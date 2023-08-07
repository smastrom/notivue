import { inject, computed, ComputedRef } from 'vue'

import { createPushSSR } from './createPush'
import { isSSR, toShallowRefs } from './utils'
import { createStore, storeInjectionKey } from './createStore'
import { defaultConfig } from './config'
import { StoreItem } from 'notivue'

type NotivueStore = ReturnType<typeof createStore>

/**
 * Used internally by Notivue.vue, since the component should
 * be wrapped in a ClientOnly component there's no need to
 * check for SSR.
 */

export function useElements() {
   return useStore().elements
}

export function useItems() {
   return useStore().items
}

export function useStore(): NotivueStore {
   return inject(storeInjectionKey) as NotivueStore
}

/**
 * The following composables might be called on the server because
 * are exposed to the user. In such case we return an object
 * with the same shape.
 */

export function useNotivue(): NotivueStore['config'] {
   if (isSSR) return toShallowRefs({ ...defaultConfig, isTopAlign: true }) as NotivueStore['config']

   return useStore().config
}

export function usePush() {
   if (isSSR) return createPushSSR()

   return useStore().push
}

export function useNotifications(): {
   entries: ComputedRef<StoreItem[]>
   queue: ComputedRef<StoreItem[]>
} {
   if (isSSR) {
      return {
         entries: computed(() => [] as StoreItem[]),
         queue: computed(() => [] as StoreItem[]),
      }
   }

   const store = useStore()

   return {
      entries: computed(() => store.items.entries.value),
      queue: computed(() => store.items.queue.value),
   }
}
