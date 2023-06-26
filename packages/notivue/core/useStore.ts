import { inject } from 'vue'

import { createPushSSR } from './createPush'
import { isSSR, toWritableRefs } from './utils'
import { createStore } from './createStore'
import { defaultConfig } from './config'
import { storeInjectionKey } from './symbols'

export function useStore(): ReturnType<typeof createStore> {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

/**
 * useConfig and usePush might be called on the server because
 * are exposed to the user. In such case we return an object
 * with the same shape.
 */

export function useConfig() {
   if (isSSR) return toWritableRefs({ ...defaultConfig, isTopAlign: true })

   return useStore().config
}

export function usePush() {
   if (isSSR) return createPushSSR()

   return useStore().push
}

// Used internally by Notivue.vue

export function useElements() {
   return useStore().elements
}

export function useItems() {
   return useStore().items
}

export function usePointer() {
   return useStore().pointer
}
