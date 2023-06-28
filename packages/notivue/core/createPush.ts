import { NotificationTypeKeys as NKeys } from './constants'
import { createStore } from './createStore'

import type { NotificationType, Push, PushOptions } from '@/types'

export function createPush(items: ReturnType<typeof createStore>['items']): Push {
   let createCount = 0

   function push(options: PushOptions, type: NotificationType, id = `${createCount++}`) {
      if (typeof options === 'string') {
         options = { message: options }
      }

      items.push({ ...options, id, type })

      return { id, clear: () => items.playLeave(id), destroy: () => items.remove(id) }
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
      clearAll: () => items.playClearAll(),
      destroyAll: () => items.removeAll(),
   }
}

export function createPushSSR(): Push {
   return createPush({
      push: () => {},
      playLeave: () => {},
      remove: () => {},
      removeAll: () => {},
      playClearAll: () => {},
   } as any)
}
