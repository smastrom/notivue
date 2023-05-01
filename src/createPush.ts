import { NotificationType as NType } from './constants'
import type {
   StaticPushOptions,
   PushPromise,
   PromiseResultPushOptions,
   PushStaticOptions,
   PushPromiseOptions,
   CreatePush,
} from './types'

export const createPush = (({ setIncoming, callItemMethod, clearAll, destroyAll }) => {
   let createCount = 0

   function create<T>(
      options: PushStaticOptions<T> | PushPromiseOptions<T>,
      status = NType.SUCCESS,
      id = `${createCount++}`
   ) {
      if (typeof options === 'string') {
         options = { message: options }
      }

      setIncoming({
         ...(options as StaticPushOptions<T> | PromiseResultPushOptions<T>),
         id,
         type: status,
      })

      return {
         id,
         clear: () => callItemMethod(id, 'clear'),
         destroy: () => callItemMethod(id, 'destroy'),
      }
   }

   function push<T>(options: PushStaticOptions<T>) {
      return create<T>(options)
   }

   push.success = <T>(options: PushStaticOptions<T>) => create(options)

   push.error = <T>(options: PushStaticOptions<T>) => create(options, NType.ERROR)

   push.warning = <T>(options: PushStaticOptions<T>) => create(options, NType.WARNING)

   push.info = <T>(options: PushStaticOptions<T>) => create(options, NType.INFO)

   push.promise = ((options) => {
      const { id, clear, destroy } = create(options, NType.PROMISE)

      return {
         resolve: (options) => create(options, NType.PROMISE_RESOLVE, id),
         reject: (options) => create(options, NType.PROMISE_REJECT, id),
         clear,
         destroy,
      }
   }) satisfies PushPromise

   push.clearAll = clearAll

   push.destroyAll = destroyAll

   return push
}) satisfies CreatePush
