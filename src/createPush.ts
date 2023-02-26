import { createID } from './utils'
import { NType } from './constants'
import type {
   IncomingOptions,
   StaticPushOptions,
   PushPromise,
   PushFn,
   PromiseResultPushOptions,
} from './types'

type Param = {
   setIncoming: (options: IncomingOptions) => void
   clearItem: (id: string) => void
   setClearTrigger: () => void
   destroyAll: () => void
}

export function createPush({ setIncoming, clearItem, setClearTrigger, destroyAll }: Param): PushFn {
   function create<T>(
      options: StaticPushOptions<T> | PromiseResultPushOptions<T>,
      status = NType.SUCCESS,
      id = createID()
   ) {
      setIncoming({ ...options, id, type: status })

      return { id, clear: () => clearItem(id) }
   }

   function push<T>(options: StaticPushOptions<T>) {
      return create<T>(options)
   }

   push.clearAll = setClearTrigger

   push.destroyAll = destroyAll

   push.success = <T>(options: StaticPushOptions<T>) => create(options)

   push.error = <T>(options: StaticPushOptions<T>) => create(options, NType.ERROR)

   push.warning = <T>(options: StaticPushOptions<T>) => create(options, NType.WARNING)

   push.info = <T>(options: StaticPushOptions<T>) => create(options, NType.INFO)

   push.promise = ((options) => {
      const { clear, id } = create(options, NType.PROMISE)

      return {
         resolve: (options) => create(options, NType.PROMISE_RESOLVE, id),
         reject: (options) => create(options, NType.PROMISE_REJECT, id),
         clear,
      }
   }) satisfies PushPromise

   return push
}
