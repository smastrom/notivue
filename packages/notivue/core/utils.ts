import { toRaw, customRef, type Ref, type ToRefs } from 'vue'

import { NotificationTypeKeys as NType } from './constants'

import type {
   StoreItem,
   NotivueItem,
   HiddenInternalItemData as InternalKeys,
   NotificationType,
   NotificationOptions,
   NotivueConfigRequired,
   Obj,
   PushOptionsWithInternals,
} from 'notivue'

export const isSSR = typeof window === 'undefined'

export function isUnlimited(value: number | null | undefined): boolean {
   return value == null || value === Infinity || value === -1
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

/** @internal */
const NOTIFICATION_TYPE_LEGACY: Partial<Record<NotificationType, NotificationType>> = {
   loading: 'promise',
   'loading-success': 'promise-resolve',
   'loading-error': 'promise-reject',
}

/** Map `promise*` discriminators to canonical `loading*` at store ingress. */
export function toCanonicalNotificationType(type: NotificationType): NotificationType {
   switch (type) {
      case 'promise':
         return 'loading'
      case 'promise-resolve':
         return 'loading-success'
      case 'promise-reject':
         return 'loading-error'
      default:
         return type
   }
}

function notificationTypeConfigSlice(
   configOptions: NotivueConfigRequired['notifications'],
   canonical: NotificationType
): NotificationOptions {
   const legacy = NOTIFICATION_TYPE_LEGACY[canonical]
   const fromLegacy = legacy ? configOptions[legacy] : undefined
   const fromCanon = configOptions[canonical]
   return { ...fromLegacy, ...fromCanon } as NotificationOptions
}

export function mergeNotificationOptions<T extends Obj = Obj>(
   configOptions: NotivueConfigRequired['notifications'],
   pushOptions: PushOptionsWithInternals<T>
) {
   pushOptions.props ||= {} as T
   const type = toCanonicalNotificationType(pushOptions.type)

   return {
      ...configOptions.global,
      ...notificationTypeConfigSlice(configOptions, type),
      ...pushOptions,
      ...(type === 'loading' ? { duration: -1 } : {}),
      type,
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
   // Omitted from the slot payload for now
   'animationAttrs',
   'positionStyles',
]

export function getSlotItem(item: StoreItem) {
   return Object.fromEntries(
      Object.entries(item).filter(([key]) => !internalKeys.includes(key as keyof InternalKeys))
   ) as NotivueItem
}
