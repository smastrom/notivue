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

const newLineRegex = /(\n)/g
const strongRegex = /\*\*([^*]+)\*\*/g

function hLine(text: string) {
   let match
   let currentIndex = 0

   const nodes: VNode[] = []

   while ((match = strongRegex.exec(text))) {
      const [_match, innerText] = match
      const startIndex = match.index
      const endIndex = startIndex + _match.length

      if (startIndex > currentIndex) {
         nodes.push(h('span', text.slice(currentIndex, startIndex)))
      }

      nodes.push(h('strong', innerText))

      currentIndex = endIndex
   }

   if (currentIndex < text.length) {
      nodes.push(h('span', text.slice(currentIndex)))
   }

   return nodes
}

export function hMessage(message: string) {
   const nodes: VNode[] = []

   message.split(newLineRegex).forEach((line) => {
      if (newLineRegex.test(line)) {
         nodes.push(h('br'))
      } else {
         nodes.push(...hLine(line))
      }
   })

   return nodes
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
