import { h } from 'vue'
import { close } from './icons'
import { CLASS_PREFIX } from './constants'
import { hIcon, hMessage } from './utils'
import type { StoreItem } from './types'

export function defaultRenderFn(item: StoreItem) {
   return h(
      'div',
      {
         class: CLASS_PREFIX + 'notification',
         'data-vuenotify': item.type,
      },
      [
         item.icon &&
            hIcon(item.icon, { class: CLASS_PREFIX + 'icon', key: `${item.id}_${item.type}` }),

         h('div', { class: CLASS_PREFIX + 'content' }, [
            item.title && h('h3', { class: CLASS_PREFIX + 'content-title' }, item.title),
            item.message &&
               h('p', { class: CLASS_PREFIX + 'content-message' }, hMessage(item.message)),
         ]),

         item.close &&
            h(
               'button',
               { class: CLASS_PREFIX + 'close', ariaLabel: 'Close', onClick: item.clear },
               close
            ),
      ]
   )
}
