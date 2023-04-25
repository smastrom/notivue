import { h, type CSSProperties } from 'vue'
import type { StoreItem } from './types'

const style: CSSProperties = {
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: '1px',
   overflow: 'hidden',
   position: 'absolute',
   whiteSpace: 'nowrap',
   width: '1px',
}

export function ariaLive(item: StoreItem) {
   return h('div', { 'aria-live': item.ariaLive, role: item.ariaRole, style }, item.message || '')
}
