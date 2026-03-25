import { unref } from 'vue'

import { NotificationTypeKeys as NType } from './constants'
import { createNotifyProxies } from './createStore'

import type { NotificationType, Notify, NotifyOptions, NotifyParameter } from 'notivue'

export const notify = createNotifyMock()

/** @deprecated Use `notify` */
export const push = notify

export function setNotify(n: Notify) {
   Object.assign(notify, n)
}

/** @deprecated Use setNotify */
export const setPush = setNotify

export function createNotify(proxies: ReturnType<typeof createNotifyProxies>): Notify {
   let createCount = 0

   function dispatch(options: NotifyParameter, type: NotificationType, id = `${createCount++}`) {
      if (typeof unref(options) === 'string') {
         options = { message: options } as NotifyOptions
      }

      proxies.notify({ ...(options as NotifyOptions), id, type })

      return {
         id,
         clear: () => proxies.clear(id),
         destroy: () => proxies.clear(id, { isDestroy: true }),
      }
   }

   function loading(options: NotifyParameter) {
      const { id, clear, destroy } = dispatch(options, NType.LOADING)

      return {
         success: (o: NotifyParameter) => dispatch(o, NType.LOADING_SUCCESS, id),
         error: (o: NotifyParameter) => dispatch(o, NType.LOADING_ERROR, id),
         resolve: (o: NotifyParameter) => dispatch(o, NType.LOADING_SUCCESS, id),
         reject: (o: NotifyParameter) => dispatch(o, NType.LOADING_ERROR, id),
         clear,
         destroy,
      }
   }

   return {
      success: (options) => dispatch(options, NType.SUCCESS),
      error: (options) => dispatch(options, NType.ERROR),
      warning: (options) => dispatch(options, NType.WARNING),
      info: (options) => dispatch(options, NType.INFO),
      loading,
      /** @deprecated Deprecated alias of `loading`. */
      load(options: NotifyParameter) {
         return loading(options)
      },
      /** @deprecated Deprecated alias of `loading`. */
      promise(options: NotifyParameter) {
         return loading(options)
      },
      clearAll: () => proxies.clearAll(),
      destroyAll: () => proxies.destroyAll(),
   }
}

export function createNotifyMock(): Notify {
   const noop = new Proxy({}, { get: () => () => {} }) as any
   return createNotify(noop)
}

/** @deprecated Use createNotifyMock */
export const createPushMock = createNotifyMock

/** @deprecated Use createNotify */
export const createPush = createNotify
