import { inject, computed, toRefs, reactive, readonly, ref, type ComputedRef } from 'vue'

import { isSSR, getSlotItem } from './utils'
import { notivueInjectionKey, notivueInstanceInjectionKey } from './symbols'
import { notify } from './createNotify'
import { DEFAULT_CONFIG } from './constants'

import type {
   NotivueStore,
   UseNotivueReturn,
   NotivueComputedEntries,
   NotivueInstance,
} from 'notivue'

export function useStore() {
   return inject(notivueInjectionKey) as NotivueStore
}

/**
 * Composable to start and stop the Notivue instance.
 *
 * @returns
 *
 * - `startInstance` - Starts or restarts the Notivue instance.
 * - `stopInstance` - Stops the Notivue instance.
 * - `isRunning` - Readonly ref to check if the Notivue instance is running.
 *
 * @docs https://docs.notivue.smastrom.io/api/composables/use-notivue-instance.html
 */
export function useNotivueInstance(): NotivueInstance {
   if (isSSR) {
      return {
         isRunning: ref(true),
         startInstance: () => {},
         stopInstance: () => {},
      } as NotivueInstance
   }

   return inject(notivueInstanceInjectionKey) as NotivueInstance
}

/**
 * Composable to get and update the current Notivue config.
 *
 * @returns
 *
 * The current [global configuration](https://docs.notivue.smastrom.io/stream/configuration/global-configuration.html)
 * where each property is a [ref](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref)
 * that allows for reactive updates and side effects watching.
 *
 * @docs https://docs.notivue.smastrom.io/api/composables/use-notivue.html
 */
export function useNotivue(): UseNotivueReturn {
   if (isSSR) {
      return {
         ...toRefs(reactive(DEFAULT_CONFIG)),
         update: () => {},
         isTopAlign: computed(() => true),
         isStreamPaused: ref(false) as ComputedRef<boolean>,
      } as UseNotivueReturn
   }

   const store = useStore()

   return {
      ...store.config,
      isStreamPaused: readonly(store.timeouts.isStreamPaused) as ComputedRef<boolean>,
      isTopAlign: computed(() => store.config.position.value.indexOf('top') === 0),
   }
}

/**
 * @deprecated Import `notify` from `notivue` instead of calling `useNotify()` in setup.
 *
 * ```ts
 * import { notify } from 'notivue'
 * ```
 *
 * @see https://docs.notivue.smastrom.io/api/utils/notify.html
 */
export function useNotify() {
   return notify
}

/**
 * @deprecated Import `notify` from `notivue` instead of `usePush()`.
 *
 * ```ts
 * import { notify } from 'notivue'
 * ```
 *
 * @see https://docs.notivue.smastrom.io/api/utils/notify.html
 */
export function usePush() {
   return notify
}

/**
 * Composable to get the current displayed notifications and queue.
 *
 * @returns
 *
 * Object of two computed properties:
 *
 * - `entries` - read-only reactive array of all the current displayed notifications
 * - `queue` - read-only reactive array of all the notifications waiting to be displayed
 *
 * @docs https://docs.notivue.smastrom.io/api/composables/use-notifications.html
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
