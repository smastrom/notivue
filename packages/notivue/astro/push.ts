import type { Push, PushOptions } from 'notivue'
import type { PushAstroEvent, MaybeAstroPushPromiseReturn } from './types'

export function pushEvent<T extends Omit<PushAstroEvent, 'resultEventName'>>(
   detail: T
): MaybeAstroPushPromiseReturn<T> {
   const eventId = Date.now()

   // Prepare to listen for the result of the notification that will be created by NotivueAstro...
   let pushResult = {} as MaybeAstroPushPromiseReturn<T>
   const resultEventName = `notivue:id:${eventId}`

   // ...upon receival, save the result and remove the listener
   window.addEventListener(
      resultEventName,
      ((e: CustomEvent<MaybeAstroPushPromiseReturn<T>>) => {
         pushResult = e.detail
      }) as EventListener,
      { once: true }
   )

   // Dispatch the incoming push options to NotivueAstro to create the notification
   window.dispatchEvent(
      new CustomEvent('notivue:push', {
         detail: {
            ...detail,
            type: detail.type,
            resultEventName,
         },
      })
   )

   // Return the result
   return pushResult
}

export const push = {
   success: (options: PushOptions) => pushEvent({ ...options, type: 'success' }),
   info: (options: PushOptions) => pushEvent({ ...options, type: 'info' }),
   error: (options: PushOptions) => pushEvent({ ...options, type: 'error' }),
   warning: (options: PushOptions) => pushEvent({ ...options, type: 'warning' }),
   promise: (options: PushOptions) => pushEvent({ ...options, type: 'promise' }),
   load: (options: PushOptions) => pushEvent({ ...options, type: 'promise' }),
   clearAll() {
      window.dispatchEvent(new CustomEvent('notivue:clear-all'))
   },
   destroyAll() {
      window.dispatchEvent(new CustomEvent('notivue:destroy-all'))
   },
} as Push
