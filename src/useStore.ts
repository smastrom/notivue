import { inject } from 'vue'
import { defaultSymbol, userSymbols } from './symbols'
import type { Store } from './types'

export function useStore(key?: string): Store {
   return inject(key && key in userSymbols ? userSymbols[key] : defaultSymbol) as Store
}
