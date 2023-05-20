import { inject } from 'vue'
import { storeInjectionKey } from './symbols'
import { createPushMock } from './createPush'
import { isSSR } from './utils'
import type { Store, Push } from './types'

export function useStore(): Store {
   /**
    * No need for SSR check since useStore is only called directly
    * in <Notivue /> which must be wrapped in <ClientOnly> if using Nuxt 3.
    */
   return inject(storeInjectionKey) as Store
}

export function usePush(): Push {
   /**
    * usePush may be called on the server by users who are using Nuxt 3.
    * Using this condition to prevent 'injection key not found' warnings in the console.
    */
   if (isSSR) {
      return createPushMock()
   }

   // On the client the injection key is always defined.
   const store = useStore()
   return store.push
}
