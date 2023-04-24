import { inject } from 'vue'
import { userSymbols, defaultSymbol } from './symbols'
import type { Store, Push } from './types'

export function usePush(key?: string): Push {
   return (inject(key && key in userSymbols ? userSymbols[key] : defaultSymbol) as Store).push
}
