import { inject } from 'vue'
import { userSymbols, defaultSymbol } from './symbols'
import type { Store, PushFn } from './types'

export function usePush(key?: string): PushFn {
   return (inject(key && key in userSymbols ? userSymbols[key] : defaultSymbol) as Store).push
}
