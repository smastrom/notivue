import { inject } from 'vue'
import { userSyms, defaultSym } from './symbols'
import type { Receiver } from './types'

export function useReceiver(key?: string): Pick<Receiver, 'items' | 'incoming'> {
   const { items, incoming } = inject(
      key && key in userSyms ? userSyms[key] : defaultSym
   ) as Receiver

   return { items, incoming }
}
