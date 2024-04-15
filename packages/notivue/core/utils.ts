import { toRaw, customRef, type Ref, type ToRefs } from 'vue'

import { NotificationTypeKeys as NType } from './constants'

import type {
   StoreItem,
   NotivueItem,
   HiddenInternalItemData as InternalKeys,
   NotificationType,
   NotivueConfigRequired,
   Obj,
   PushOptionsWithInternals,
} from 'notivue'

export const isSSR = typeof window === 'undefined'

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
      ...(pushOptions.type === 'promise' ? { duration: Infinity } : {}), // Enforce this
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

export function createConfigRefs<T extends Obj>(
   target: T,
   source: Record<string, any>,
   isRunning: Ref<boolean>
) {
   const conf = mergeDeep(target, source) as T

   function configRef<T>(value: T) {
      return customRef((track, trigger) => ({
         get() {
            track()
            return value
         },
         set(newValue) {
            if (!isRunning.value) return

            value = newValue
            trigger()
         },
      }))
   }

   for (const key in conf) conf[key] = configRef(conf[key]) as any
   return conf as ToRefs<T>
}

export function toRawConfig<T extends Obj>(config: ToRefs<T>) {
   return Object.entries(config).reduce(
      (acc, [key, { value }]) => ({ ...acc, [key]: toRaw(value) }),
      {}
   ) as T
}

export const isStatic = (type: NotificationType) =>
   type === NType.SUCCESS || type === NType.ERROR || type === NType.WARNING || type === NType.INFO

export const internalKeys: (keyof InternalKeys)[] = [
   'timeout',
   'resumedAt',
   'remaining',
   // Maybe in future releases these could be exposed
   'animationAttrs',
   'positionStyles',
]

export function getSlotItem(item: StoreItem) {
   return Object.fromEntries(
      Object.entries(item).filter(([key]) => !internalKeys.includes(key as keyof InternalKeys))
   ) as NotivueItem
}
