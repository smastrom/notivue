import { reactive, toRaw, toRefs, type ToRefs } from 'vue'

import type {
   DeepPartial,
   DeepRequired,
   NotivueConfigRequired,
   Obj,
   PushOptionsWithInternals,
} from 'notivue'

export const isSSR = typeof window === 'undefined'

export function isMouse(event: PointerEvent) {
   return event.pointerType === 'mouse'
}

export function mergeDeep<T>(target: T, source: Record<string, any>): T {
   const merged: T = { ...target }

   for (const key in source) {
      if (source.hasOwnProperty(key)) {
         if (isPlainObject(source[key])) {
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
      ...(optionsFromPush.type === 'promise' ? { duration: Infinity } : {}), // Force duration infinity
   }
}

// https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/isPlainObject.js
function isPlainObject(value: unknown) {
   if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false
   }

   const prototype = Object.getPrototypeOf(value)
   return prototype === null || Object.getPrototypeOf(prototype) === null
}

export function createRefs<T>(source: DeepRequired<T>, target: DeepPartial<T>) {
   return toRefs(reactive(mergeDeep(source, target))) as ToRefs<DeepRequired<T>>
}

export function toRawConfig<T extends Obj>(config: ToRefs<T>) {
   return Object.entries(config).reduce(
      (acc, [key, { value }]) => ({ ...acc, [key]: toRaw(value) }),
      {}
   ) as T
}
