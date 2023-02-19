import { inject } from 'vue'
import { userSymbols, defaultSymbol } from './symbols'
import type { Receiver, PushFn } from './types'

export function useNotify(key?: string): PushFn {
   return (inject(key && key in userSymbols ? userSymbols[key] : defaultSymbol) as Receiver).push()
}
