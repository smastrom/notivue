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

export function hMessage(message: string) {
   const lines = message.split('\n')

   if (lines.length > 1) {
      return lines.map((line, index) =>
         index === 0
            ? h('span', line)
            : [h('br'), line.replace(/\s/g, '').length > 0 && h('span', line)]
      )
   }

   return message
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
