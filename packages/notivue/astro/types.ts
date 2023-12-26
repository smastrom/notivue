import type { ClearFunctions, PushPromiseReturn, NotificationType, PushOptions } from 'notivue'

export type PushAstroEvent = PushOptions & {
   type: Exclude<NotificationType, 'promise-resolve' | 'promise-reject'>
   resultEventName: string
}

export type MaybeAstroPushPromiseReturn<T> = T extends PushOptions & { type: 'promise' }
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
