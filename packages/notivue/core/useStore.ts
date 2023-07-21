import { inject } from 'vue'

import { createPushSSR } from './createPush'
import { isSSR, toShallowRefs } from './utils'
import { createStore, storeInjectionKey } from './createStore'
import { defaultConfig } from './config'

export function useStore(): ReturnType<typeof createStore> {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

/**
 * useNotivue and usePush might be called on the server because
 * are exposed to the user. In such case we return an object
 * with the same shape.
 */

export function useNotivue() {
   if (isSSR) return toShallowRefs({ ...defaultConfig, isTopAlign: true })

   return useStore().config
}

export function usePush() {
   if (isSSR) return createPushSSR()

   return useStore().push
}

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
