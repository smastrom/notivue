import { h } from 'vue'
import { Classes as Cx } from './constants'
import { hIcon, hMessage } from './utils'
import { icons as filledIcons } from './icons'
import { light } from './themes'
import type { IconSrc, StoreItem } from './types'

export function notifications(item: StoreItem, theme = light, icons = filledIcons) {
   return h(
      'div',
      {
         class: `${Cx.NOTIFICATION} ${item.class ?? ''}`,
         style: { ...theme, ...(item.style ?? {}) },
         ...(item.icon ? { 'data-icon': '' } : {}),
         'data-notivue': item.type,
      },
      [
         item.icon &&
            icons?.[item.type] &&
            hIcon(icons[item.type] as IconSrc, {
               class: Cx.ICON,
               key: `icon_${item.type}_${item.id}`,
            }),

         h('div', { class: Cx.CONTENT }, [
            item.title && h('h3', { class: Cx.TITLE }, item.title),
            item.message && h('p', { class: Cx.MESSAGE }, hMessage(item.message)),
         ]),

         item.close &&
            icons?.close &&
            h(
               'button',
               { class: Cx.CLOSE, 'aria-label': item.closeAriaLabel, onClick: item.clear },
               [hIcon(icons.close, { class: Cx.CLOSE_ICON })]
            ),
      ]
   )
}
