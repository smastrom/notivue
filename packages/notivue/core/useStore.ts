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

/**
 * @returns
 *
 * An object with the same shape of the plugin
 * [configuration](https://notivuedocs.netlify.app/customization/configuration) except
 * for the fact that each property is a [shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)
 * that allows for reactive updates and side effects.
 *
 * Documentation: https://notivue.netlify.app/api/use-notivue
 */
export function useNotivue(): ConfigSlice {
   if (isSSR) {
      return toShallowRefs({ ...DEFAULT_CONFIG, isTopAlign: true }) as ConfigSlice
   }

   return useStore().config
}

/**
 * @returns
 *
 * Portion of the store matching the actions to create notifications.
 *
 * Documentation: https://notivue.netlify.app/api/use-push
 */
export function usePush() {
   if (isSSR) return createPushSSR()

   return useStore().push
}

/**
 * @returns
 *
 * An object with two computed properties:
 *
 * - `entries` - read-only reactive array of all the current displayed notifications
 * - `queue` - read-only reactive array of all the notifications waiting to be displayed
 *
 * Documentation: https://notivue.netlify.app/api/use-notifications
 */
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
