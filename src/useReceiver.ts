import { inject } from 'vue'
import { defaultSymbol, userSymbols } from './symbols'
import type { Receiver } from './types'

export function useReceiver(key?: string): Pick<Receiver, 'items' | 'incoming' | 'runClear'> {
   const { items, incoming, runClear } = inject(
      key && key in userSymbols ? userSymbols[key] : defaultSymbol
   ) as Receiver

   return { items, incoming, runClear }
}
