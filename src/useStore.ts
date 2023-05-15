import { inject } from 'vue'
import { storeInjectionKey } from './symbols'
import type { Store, Push } from './types'

export function useStore() {
   return inject(storeInjectionKey) as Store
}

export function usePush() {
   return inject(storeInjectionKey)?.push as Push
}
