import { inject, computed, ComputedRef } from 'vue'

import { createPushSSR } from './createPush'
import { isSSR, toShallowRefs } from './utils'
import { storeInjectionKey } from './createStore'
import { defaultConfig } from './config'
import { getSlotContext } from '@/Notivue/utils'

import type {
   NotivueStore,
   NotivueReactiveConfig,
   NotivueComputedEntries,
   NotivueItem,
} from 'notivue'

/**
 * Used internally by Notivue.vue, since the component should
 * be wrapped in a ClientOnly component there's no need to
 * check for SSR.
 */
export function useElements() {
   return useStore()?.elements
}

export function useItems() {
   return useStore()?.items
}

export function useStore(): NotivueStore {
   return inject(storeInjectionKey) as NotivueStore
}

/**
 * The following composables might be called on the server because
 * are exposed to the user. In such case we return an object
 * with the same shape.
 */
export function useNotivue(): NotivueReactiveConfig {
   if (isSSR) return toShallowRefs({ ...defaultConfig, isTopAlign: true }) as NotivueStore['config']

   return useStore().config
}

export function usePush() {
   if (isSSR) return createPushSSR()

   return useStore().push
}

export function useNotifications(): NotivueComputedEntries {
   if (isSSR) {
      return {
         entries: computed(() => [] as NotivueItem[]),
         queue: computed(() => [] as NotivueItem[]),
      }
   }

   const store = useStore()

   return {
      entries: computed(() => store.items.entries.value.map(getSlotContext)),
      queue: computed(() => store.items.queue.value.map(getSlotContext)),
   }
}
