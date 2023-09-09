import { NotificationTypeKeys as NKeys } from './constants'
import { createProxiesSlice } from './createStore'

import type { NotificationType, Push, PushParameter } from 'notivue'

export function createPush(
   proxies: ReturnType<typeof createProxiesSlice>,
   { onDestroyAll, onClearAll }: { onDestroyAll: () => void; onClearAll: () => void }
): Push {
   let createCount = 0

   function push(options: PushParameter, type: NotificationType, id = `${createCount++}`) {
      if (typeof options === 'string') options = { message: options }

      proxies.push({ ...options, id, type })

      return {
         id,
         clear: () => proxies.clear(id),
         destroy: () => proxies.clear(id, true),
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
      clearAll: () => onClearAll(),
      destroyAll: () => onDestroyAll(),
   }
}

export function createPushSSR(): Push {
   const noop = new Proxy({}, { get: () => () => {} }) as any
   return createPush(noop, noop)
}
