import { reactive, toRaw, toRefs, type ToRefs } from 'vue'

import { NotificationTypeKeys as NKeys } from './constants'

import type {
   NotificationType,
   NotivueConfigRequired,
   Obj,
   PushOptionsWithInternals,
} from 'notivue'

export const isSSR = typeof window === 'undefined'

export function isMouse(event: PointerEvent) {
   return event.pointerType === 'mouse'
}

export function mergeDeep<T extends Obj>(target: T, source: Record<string, any>): T {
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
   configOptions: NotivueConfigRequired['notifications'],
   pushOptions: PushOptionsWithInternals<T>
) {
   pushOptions.props ||= {} as T

   return {
      ...configOptions[pushOptions.type],
      ...configOptions.global,
      ...pushOptions,
      ...(pushOptions.type === 'promise' ? { duration: Infinity } : {}), // Force duration infinity
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

export function createRefs<T extends Obj>(target: T, source: Record<string, any>) {
   return toRefs(reactive(mergeDeep(target, source))) as ToRefs<T>
}

export function toRawConfig<T extends Obj>(config: ToRefs<T>) {
   return Object.entries(config).reduce(
      (acc, [key, { value }]) => ({ ...acc, [key]: toRaw(value) }),
      {}
   ) as T
}

export const isStatic = (type: NotificationType) =>
   type === NKeys.SUCCESS || type === NKeys.ERROR || type === NKeys.WARNING || type === NKeys.INFO
