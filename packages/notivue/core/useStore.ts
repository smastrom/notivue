import { inject, computed, toRefs, reactive, readonly, ref } from 'vue'

import { isSSR, getSlotItem } from './utils'
import { notivueInjectionKey } from './createNotivue'
import { push } from './createPush'
import { DEFAULT_CONFIG } from './constants'

import { getSlotItem } from '@/Notivue/utils'

import type { NotivueStore, UseNotivueReturn, NotivueComputedEntries, NotivueItem } from 'notivue'

export function useStore() {
   return inject(notivueInjectionKey) as NotivueStore
}

/**
 * @returns
 *
 * The current [configuration](https://notivuedocs.netlify.app/customization/configuration)
 * where each property is a [ref](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref)
 * that allows for reactive updates and side effects watching.
 *
 * @docs https://notivuedocs.netlify.app/api/use-notivue
 */
export function useNotivue(): UseNotivueReturn {
   if (isSSR) {
      return {
         ...toRefs(reactive(DEFAULT_CONFIG)),
         update: () => {},
         isTopAlign: computed(() => true),
         isStreamPaused: ref(false),
      } as UseNotivueReturn
   }

   const store = useStore()

   return {
      ...store.config,
      isStreamPaused: readonly(store.timeouts.isStreamPaused),
      isTopAlign: computed(() => store.config.position.value.indexOf('top') === 0),
   }
}

/**
 * @deprecated
 *
 * Since version 2.0.0, import `push` directly instead.
 *
 * ```ts
 * import { push } from 'notivue'
 * ```
 */
export function usePush() {
   return push
}

/**
 * @returns
 *
 * Object of two computed properties:
 *
 * - `entries` - read-only reactive array of all the current displayed notifications
 * - `queue` - read-only reactive array of all the notifications waiting to be displayed
 *
 * @docs https://notivuedocs.netlify.app/api/use-notifications
 */
export function useNotifications(): NotivueComputedEntries {
   if (isSSR) {
      return {
         entries: computed(() => []),
         queue: computed(() => []),
      } as NotivueComputedEntries
   }

   const store = useStore()

   return {
      entries: computed(() => store.items.entries.value.map(getSlotItem)),
      queue: computed(() => store.queue.entries.value.map(getSlotItem)),
   }
}
