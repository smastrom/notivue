import { h } from 'vue'
import { close } from './icons'
import { CLASS_PREFIX as CX } from './constants'
import { hIcon, hMessage } from './utils'
import type { StoreItem } from './types'

export function defaultRenderFn(item: StoreItem) {
   return h(
      'div',
      {
         class: CX + 'notification',
         'data-notsy': item.type,
      },
      [
         item.icon && hIcon(item.icon, { class: CX + 'icon', key: `${item.id}_${item.type}` }),

         h('div', { class: CX + 'content' }, [
            item.title && h('h3', { class: CX + 'content-title' }, item.title),
            item.message && h('p', { class: CX + 'content-message' }, hMessage(item.message)),
         ]),

         item.close &&
            h('button', { class: CX + 'close', ariaLabel: 'Close', onClick: item.clear }, close),
      ]
   )
}
