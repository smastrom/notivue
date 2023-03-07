import { createID } from './utils'
import { NotificationTypes as NType } from './constants'
import type {
   IncomingOptions,
   StaticPushOptions,
   PushPromise,
   PushFn,
   PromiseResultPushOptions,
   StoreItem,
} from './types'

type StoreFns = {
   setIncoming: (options: IncomingOptions) => void
   callItemMethod: (id: string, method: 'clear' | 'destroy') => void
   scheduleClearAll: () => void
   destroyAll: () => void
}

export function createPushFn({
   setIncoming,
   callItemMethod,
   scheduleClearAll,
   destroyAll,
}: StoreFns): PushFn {
   function create<T>(
      options: StaticPushOptions<T> | PromiseResultPushOptions<T>,
      status = NType.SUCCESS,
      id = createID()
   ) {
      setIncoming({ ...options, id, type: status })

      return {
         id,
         clear: () => callItemMethod(id, 'clear'),
         destroy: () => callItemMethod(id, 'destroy'),
      }
   }

   function push<T>(options: StaticPushOptions<T>) {
      return create<T>(options)
   }

   push.clearAll = scheduleClearAll

   push.destroyAll = destroyAll

   push.success = <T>(options: StaticPushOptions<T>) => create(options)

   push.error = <T>(options: StaticPushOptions<T>) => create(options, NType.ERROR)

   push.warning = <T>(options: StaticPushOptions<T>) => create(options, NType.WARNING)

   push.info = <T>(options: StaticPushOptions<T>) => create(options, NType.INFO)

   push.promise = ((options) => {
      const { id, clear, destroy } = create(options, NType.PROMISE)

      return {
         resolve: (options) => create(options, NType.PROMISE_RESOLVE, id),
         reject: (options) => create(options, NType.PROMISE_REJECT, id),
         clear,
         destroy,
      }
   }) satisfies PushPromise

   return push
}
