import { inject } from 'vue'

import { storeInjectionKey } from '../core/symbols'
import { createPushSSR } from '../core/createPush'
import { isSSR, toWritableRefs } from '../core/utils'
import { createStore } from '../core/createStore'
import { defaultConfig } from '../core/config'

export function useStore(): ReturnType<typeof createStore> {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

export function useElements() {
   return useStore().elements
}

export function useItems() {
   return useStore().items
}

export function usePointer() {
   return useStore().pointer
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
