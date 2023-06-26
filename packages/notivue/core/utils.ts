import { shallowRef, type Ref } from 'vue'

import type { DeepPartial, HiddenInternalItemData, StoreItem, NotivueSlot, Obj } from '../types'

export const isSSR = typeof window === 'undefined'

export function isMouse(event: PointerEvent) {
   return event.pointerType === 'mouse'
}

export function toWritableRefs<T extends Record<string, any>>(object: T) {
   return Object.entries(object).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: shallowRef(value) }),
      {} as {
         [K in keyof T]: Ref<T[K]>
      }
   )
}

export function mergeDeep<T extends Record<string, any>>(target: T, source: DeepPartial<T>): T {
   const merged: T = { ...target }

   for (const key in source) {
      if (source.hasOwnProperty(key)) {
         if (source[key] && typeof source[key] === 'object') {
            merged[key as keyof T] = mergeDeep(
               target[key as keyof T],
               source[key] as DeepPartial<T[keyof T]>
            ) as T[keyof T]
         } else {
            merged[key as keyof T] = source[key] as T[keyof T]
         }
      }
   }

   return merged
}

const internalKeys: (keyof HiddenInternalItemData)[] = [
   'timeoutId',
   'elapsed',
   'updatedAt',
   'transitionStyles',
   'animationClass',
   'onAnimationstart',
   'onAnimationend',
]

export function getSlotContext(item: StoreItem): NotivueSlot {
   return Object.fromEntries(
      Object.entries(item).filter(
         ([key]) => !internalKeys.includes(key as keyof HiddenInternalItemData)
      )
   ) as NotivueSlot
}
