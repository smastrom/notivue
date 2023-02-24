import { h, isVNode, type Raw, type VNode } from 'vue'
import { defaultOptions } from './defaultOptions'
import type { UserOptions, MergedOptions, ReceiverProps, InternalPushOptions } from './types'

export const isSSR = typeof window === 'undefined'

export function createID() {
   return performance.now().toString()
}

export function hIcon(icon: unknown, props = {}) {
   if (isVNode(icon)) {
      return h(icon, props)
   }
   if (typeof icon === 'object') {
      return h(icon as Raw<VNode>, props)
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
