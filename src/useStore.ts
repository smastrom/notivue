import { inject } from 'vue'
import { storeSymbol } from './symbols'
import type { Store, Push } from './types'

export function useStore() {
   return inject(storeSymbol) as Store
}

export function usePush() {
   return inject(storeSymbol)?.push as Push
}
