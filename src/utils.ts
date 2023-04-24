import { h, type VNode, type Component } from 'vue'
import type {
   ReceiverProps,
   IncomingOptions,
   MergedOptions,
   NotificationType as NTypeU,
   DefaultOptions,
} from './types'
import { CLASS_PREFIX as CX } from './constants'

export const isSSR = typeof window === 'undefined'

export function createID() {
   return performance.now().toString()
}

export function hIcon(icon: (() => Component) | string, props = {}) {
   switch (typeof icon) {
      case 'function':
         return h(icon(), props)
      case 'string':
         return h('span', props, icon)
      default:
         return null
   }
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

   message.split(newLineRegex).forEach((line, index) => {
      if (newLineRegex.test(line)) {
         nodes.push(h('br'))
      } else {
         nodes.push(...hLine(line))
      }
   })

   return nodes
}

export function mergeOptions(
   defaultOptions: DefaultOptions,
   receiverProps: ReceiverProps['options'],
   pushOptions: IncomingOptions
): MergedOptions {
   const mergedGlobals = { ...receiverProps.global, ...receiverProps[pushOptions.type] }

   return {
      ...defaultOptions[pushOptions.type],
      ...mergedGlobals,
      ...pushOptions,
   }
}

export function getDefaultAnims(isTop: boolean) {
   return {
      ...{ enter: CX + 'enter' + (isTop ? '' : '-bottom') },
      ...{ leave: CX + 'leave' + (isTop ? '' : '-bottom') },
      clearAll: CX + 'clearAll',
   }
}
