import { h } from 'vue'
import { Classes as Cx } from './constants'
import { hIcon, hMessage } from './utils'
import type { StoreItem, IconSrc } from './types'

type Param = {
   item: StoreItem
   iconSrc: unknown
   closeIconSrc: unknown
}

export function defaultComponent({ item, iconSrc, closeIconSrc }: Param) {
   return h(
      'div',
      {
         class: Cx.NOTIFICATION,
         'data-notsy': item.type,
      },
      [
         item.icon && (iconSrc as any)
            ? hIcon(iconSrc as IconSrc, { class: Cx.ICON, key: `${item.id}_${item.type}` })
            : h('span'),

         h('div', { class: Cx.CONTENT }, [
            item.title && h('h3', { class: Cx.TITLE }, item.title),
            item.message && h('p', { class: Cx.MESSAGE }, hMessage(item.message)),
         ]),

         item.close && (closeIconSrc as any)
            ? h(
                 'button',
                 { class: Cx.CLOSE, ariaLabel: item.closeAriaLabel, onClick: item.clear },
                 [hIcon(closeIconSrc as IconSrc, { class: Cx.CLOSE_ICON })]
              )
            : h('span'),
      ]
   )
}
