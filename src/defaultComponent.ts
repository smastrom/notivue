import { h } from 'vue'
import { close } from './icons'
import { CLASS_PREFIX } from './constants'
import { hIcon } from './utils'
import type { Notification } from './types'

export function defaultComponent(item: Notification) {
   return h(
      'div',
      {
         class: CLASS_PREFIX + 'notification',
         'data-vuenotify': item.type,
      },
      [
         hIcon(item.icon),

         h('div', { class: CLASS_PREFIX + 'content' }, [
            item.title && h('h3', { class: CLASS_PREFIX + 'content-title' }, item.title),
            item.message && h('p', { class: CLASS_PREFIX + 'content-message' }, item.message),
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
