import { inject, toRef } from 'vue'
import { defaultSymbol, userSymbols } from './symbols'
import type { Receiver, StoreData, StoreMethods } from './types'

export function useStore(key?: string): StoreData & StoreMethods {
   return inject(key && key in userSymbols ? userSymbols[key] : defaultSymbol) as Receiver
}
