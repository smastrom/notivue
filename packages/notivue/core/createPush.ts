import { NotificationType as NType } from './constants'
import { createStore } from './createStore'

import type { NotificationType, Push, PushOptions, UserPushOptions } from '@/types'

export function createPush(items: ReturnType<typeof createStore>['items']): Push {
   let createCount = 0

   function push(options: PushOptions, type: NotificationType, id = `${createCount++}`) {
      if (typeof options === 'string') {
         options = { message: options } as UserPushOptions
      }

      items.push({ ...options, id, type })

      return { id, clear: () => items.playLeave(id), destroy: () => items.remove(id) }
   }

   return {
      success: (options) => push(options, NType.SUCCESS),
      error: (options) => push(options, NType.ERROR),
      warning: (options) => push(options, NType.WARNING),
      info: (options) => push(options, NType.INFO),
      promise: (options) => {
         const { id, clear, destroy } = push(options, NType.PROMISE)

         return {
            resolve: (options) => push(options, NType.PROMISE_RESOLVE, id),
            reject: (options) => push(options, NType.PROMISE_REJECT, id),
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
