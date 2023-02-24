import { createID } from './utils'
import { NType } from './constants'
import type { Receiver, UserOptions, PushFn } from './types'

type Options = Partial<UserOptions>

export function createPush(setIncoming, clearItem, clearAll, destroyAll): PushFn {
   function create(options: Options, status = NType.SUCCESS, id = createID()) {
      setIncoming({ ...options, id, type: status })

      return { id, clear: () => clearItem(id), clearAll, destroyAll }
   }

   function push(options: Options) {
      return create(options)
   }

   push.clearAll = clearAll

   push.destroyAll = destroyAll

   push.success = (options: Options) => create(options)

   push.error = (options: Options) => create(options, NType.ERROR)

   push.warning = (options: Options) => create(options, NType.WARNING)

   push.info = (options: Options) => create(options, NType.INFO)

   push.promise = ((options) => {
      const { clear, clearAll, id } = create(options, NType.PROMISE)

      return {
         resolve: (options) => create(options, NType.PROMISE_RESOLVE, id),
         reject: (options) => create(options, NType.PROMISE_REJECT, id),
         clear,
         clearAll,
      }
   }) satisfies PushFn['promise']

   return push
}
