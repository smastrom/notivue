import { unref } from 'vue'

import { NotificationTypeKeys as NType } from './constants'
import { createPushProxies } from './createStore'

import type { NotificationType, Push, PushOptions, PushParameter } from 'notivue'

export const push = createPushMock()

export function setPush(p: Push) {
   Object.assign(push, p)
}

export function createPush(proxies: ReturnType<typeof createPushProxies>): Push {
   let createCount = 0

   function push(options: PushParameter, type: NotificationType, id = `${createCount++}`) {
      if (typeof unref(options) === 'string') {
         options = { message: options } as PushOptions
      }

      proxies.push({ ...(options as PushOptions), id, type })

      return {
         id,
         clear: () => proxies.clear(id),
         destroy: () => proxies.clear(id, { isDestroy: true }),
      }
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
            success: (options) => push(options, NType.PROMISE_RESOLVE, id),
            error: (options) => push(options, NType.PROMISE_REJECT, id),
            clear,
            destroy,
         }
      },
      load(options) {
         return this.promise(options)
      },
      clearAll: () => proxies.clearAll(),
      destroyAll: () => proxies.destroyAll(),
   }
}

export function createPushMock(): Push {
   const noop = new Proxy({}, { get: () => () => {} }) as any
   return createPush(noop)
}
