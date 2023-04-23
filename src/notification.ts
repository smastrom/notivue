import { h } from 'vue'
import { Classes as Cx } from './constants'
import { createID, hIcon, hMessage } from './utils'
import { icons as filledIcons } from './icons'
import { light } from './themes'
import type { IconSrc, DefaultRenderFnParam } from './types'

export function notification({ item, theme = light, icons = filledIcons }: DefaultRenderFnParam) {
   return h(
      'div',
      {
         class: `${Cx.NOTIFICATION} ${item.class ?? ''}`,
         style: { ...theme, ...(item.style ?? {}) },
         'data-notivue': item.type,
      },
      [
         item.icon && icons?.[item.type]
            ? hIcon(icons[item.type], { class: Cx.ICON, key: `icon_${item.type}_${item.id}` })
            : h('span'),

         h('div', { class: Cx.CONTENT }, [
            item.title && h('h3', { class: Cx.TITLE }, item.title),
            item.message && h('p', { class: Cx.MESSAGE }, hMessage(item.message)),
         ]),

         item.close && icons?.close
            ? h(
                 'button',
                 { class: Cx.CLOSE, 'aria-label': item.closeAriaLabel, onClick: item.clear },
                 [hIcon(icons.close as IconSrc, { class: Cx.CLOSE_ICON })]
              )
            : h('span'),
      ]
   )
}
