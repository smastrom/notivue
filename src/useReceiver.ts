import { inject } from 'vue'
import { defaultSymbol, userSymbols } from './symbols'
import type { Receiver } from './types'

export function useReceiver(key?: string): Pick<Receiver, 'items' | 'incoming' | 'isAnimated'> {
   const { items, incoming, isAnimated } = inject(
      key && key in userSymbols ? userSymbols[key] : defaultSymbol
   ) as Receiver

   return { items, incoming, isAnimated }
}
