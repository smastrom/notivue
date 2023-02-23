import { h, isVNode, type Ref } from 'vue'
import { defaultOptions } from './defaultOptions'
import { CLASS_PREFIX } from './constants'
import type { UserOptions, MergedOptions, ReceiverProps, InternalPushOptions } from './types'

export const isSSR = typeof window === 'undefined'

export function createID() {
   return performance.now().toString()
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
