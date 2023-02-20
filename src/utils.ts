import { h, isVNode, type Ref } from 'vue'
import { defaultOptions } from './defaultOptions'
import { CLASS_PREFIX } from './constants'
import type { UserOptions, MergedOptions, ReceiverProps, InternalPushOptions } from './types'

export const isSSR = typeof window === 'undefined'

export function createID() {
   return crypto ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9)
}

export function hIcon(icon: unknown) {
   if (isVNode(icon)) {
      return icon
   }
   if (typeof icon === 'object') {
      return h(icon as object, { class: CLASS_PREFIX + 'icon' })
   }
   return null
}

export function mergeOptions(
   receiverOptions: ReceiverProps['options'],
   pushOptions: UserOptions & InternalPushOptions
): MergedOptions {
   return {
      ...defaultOptions[pushOptions.type],
      ...receiverOptions[pushOptions.type],
      ...pushOptions,
   }
}

/**
 * This calculates proper transform-origin just right after the root
 * element has been mounted, in order to avoid undesidered flying animations.
 * Prevents this to happen https://github.com/vuejs/vue/issues/11654.
 */
export function getOrigin(el: HTMLElement, position: Ref<ReceiverProps['position']>) {
   const is = (_position: string) => position.value.includes(_position)
   const item = el.children[0].children[0]?.children[0]

   if (!item) {
      return 'center top'
   }

   const { left, right, top, width } = item.getBoundingClientRect()
   const wOffset = Math.abs(width - item.clientWidth)
   const xOffset = is('left')
      ? `${left + wOffset}px`
      : is('right')
      ? `${right - wOffset}px`
      : 'center'
   const yOffset = is('bottom') ? `${top}px` : 'top'

   return `${xOffset} ${yOffset}`
}
