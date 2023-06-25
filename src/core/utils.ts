import { shallowRef, type Ref } from 'vue'
import { DeepPartial } from '../types'

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

export function mergeDeep<T extends Record<string, any>>(target: T, source: T | DeepPartial<T>): T {
   const merged = { ...target }

   for (const key in source) {
      if (source.hasOwnProperty(key)) {
         if (source[key] && typeof source[key] === 'object') {
            // @ts-ignore
            merged[key] = mergeDeep(target[key], source[key])
         } else {
            // @ts-ignore
            merged[key] = source[key]
         }
      }
   }

   return merged
}
