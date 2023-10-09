import { shallowRef } from 'vue'

import type { NotivueConfigRequired, Obj, PushOptionsWithInternals, ToMappedRefs } from 'notivue'

export const isSSR = typeof window === 'undefined'

export function isMouse(event: PointerEvent) {
   return event.pointerType === 'mouse'
}

export function toShallowRefs<T extends Record<string, any>>(object: T) {
   return Object.entries(object).reduce(
      (acc, [option, value]) => ({
         ...acc,
         [option]: shallowRef(value),
      }),
      {}
   ) as ToMappedRefs<typeof object>
}

export function mergeDeep<T>(target: T, source: Record<string, any>): T {
   const merged: T = { ...target }

   for (const key in source) {
      if (source.hasOwnProperty(key)) {
         if (source[key] && typeof source[key] === 'object') {
            merged[key as keyof T] = mergeDeep(target[key as keyof T], source[key]) as T[keyof T]
         } else {
            merged[key as keyof T] = source[key]
         }
      }
   }

   return merged
}

export function mergeNotificationOptions<T extends Obj = Obj>(
   mergedConfigOptions: NotivueConfigRequired['notifications'],
   optionsFromPush: PushOptionsWithInternals<T>
) {
   if (!optionsFromPush.props) {
      optionsFromPush.props = {} as T
   }

   return {
      ...(mergedConfigOptions[optionsFromPush.type] ?? mergedConfigOptions.success),
      ...mergedConfigOptions.global,
      ...optionsFromPush,
   }
}
