import type {
   ClearFunctions,
   PushPromiseReturn,
   NotificationType,
   PushOptions,
   NotifyOptions,
} from 'notivue'

export type PushAstroEvent = NotifyOptions & {
   type: Exclude<
      NotificationType,
      'loading-success' | 'loading-error' | 'promise-resolve' | 'promise-reject'
   >
   resultEventName: string
}

/** `type: 'promise'` is a deprecated alias of `loading`. */
export type MaybeAstroPushPromiseReturn<T> = T extends PushOptions & { type: 'loading' | 'promise' }
   ? PushPromiseReturn
   : T extends PushOptions
     ? ClearFunctions
     : never

interface CustomEventMap {
   'notivue:push': CustomEvent<PushAstroEvent>
   'notivue:clear-all': CustomEvent
   'notivue:destroy-all': CustomEvent
}

declare global {
   interface WindowEventMap extends CustomEventMap {}
}
