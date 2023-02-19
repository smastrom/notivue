import { inject } from 'vue'
import { defaultSymbol, userSymbols } from './symbols'
import type { Receiver } from './types'

export function useReceiver(key?: string): Pick<Receiver, 'items' | 'incoming'> {
   const { items, incoming } = inject(
      key && key in userSymbols ? userSymbols[key] : defaultSymbol
   ) as Receiver

   return { items, incoming }
}
