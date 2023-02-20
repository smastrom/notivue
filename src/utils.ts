import { h, isVNode, type VNode } from 'vue'
import { NType } from './constants'
import type { ReceiverProps, IncomingOptions, ReceiverOptions, MergedOptions } from './types'

export const isSSR = typeof window === 'undefined'

export function createID() {
   return performance.now().toString()
}

export function hIcon(icon: unknown, props = {}) {
   if (isVNode(icon) || typeof icon === 'object') {
      return h(icon as VNode, props)
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
   defaultOptions: Required<Record<`${NType}`, ReceiverOptions>>,
   receiverProps: ReceiverProps['options'],
   pushOptions: IncomingOptions
): MergedOptions {
   return {
      ...defaultOptions[pushOptions.type],
      ...receiverProps[pushOptions.type],
      ...pushOptions,
   }
}
