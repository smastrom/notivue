import { inject, computed } from 'vue'

import { createPushSSR } from './createPush'
import { isSSR, toShallowRefs } from './utils'
import { notivueInjectionKey } from './createNotivue'
import { DEFAULT_CONFIG } from './constants'

import { getSlotContext } from '@/Notivue/utils'

import type { NotivueStore, ConfigSlice, NotivueComputedEntries, NotivueItem } from 'notivue'

export function useStore() {
   return inject(notivueInjectionKey) as NotivueStore
}

export function useNotivue(): ConfigSlice {
   if (isSSR) {
      return toShallowRefs({ ...DEFAULT_CONFIG, isTopAlign: true }) as NotivueStore['config']
   }

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
      queue: computed(() => store.queue.entries.value.map(getSlotContext)),
   }
}
