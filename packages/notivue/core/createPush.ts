import { NotificationTypeKeys as NKeys } from './constants'
import { createStore } from './createStore'

import type { NotificationType, Push, PushOptions } from 'notivue'

export function createPush(
   items: ReturnType<typeof createStore>['items'],
   elements: ReturnType<typeof createStore>['elements']
): Push {
   let createCount = 0

   function push(options: PushOptions, type: NotificationType, id = `${createCount++}`) {
      if (typeof options === 'string') {
         options = { message: options }
      }

      items.pushProxy({ ...options, id, type })

      return {
         id,
         clear: () => items.clearProxy(id),
         destroy: () => items.clearProxy(id, true),
      }
   }

   return {
      success: (options) => push(options, NKeys.SUCCESS),
      error: (options) => push(options, NKeys.ERROR),
      warning: (options) => push(options, NKeys.WARNING),
      info: (options) => push(options, NKeys.INFO),
      promise: (options) => {
         const { id, clear, destroy } = push(options, NKeys.PROMISE)

         return {
            resolve: (options) => push(options, NKeys.PROMISE_RESOLVE, id),
            reject: (options) => push(options, NKeys.PROMISE_REJECT, id),
            clear,
            destroy,
         }
      },
      clearAll: () => elements.addClearAllClass(),
      destroyAll: () => items.reset(),
   }
}

export function createPushSSR(): Push {
   const noopProxy = new Proxy({}, { get: () => () => {} }) as any
   return createPush(noopProxy, noopProxy)
}
