import type { StoreItem, NotivueSlot, HiddenInternalItemData } from '@/types'

export const hiddenInternalKeys: (keyof HiddenInternalItemData)[] = [
   'timeoutId',
   'elapsed',
   'resumedAt',
   'transitionStyles',
   'animationClass',
   'onAnimationstart',
   'onAnimationend',
]

export function getSlotContext(item: StoreItem): NotivueSlot {
   return Object.fromEntries(
      Object.entries(item).filter(
         ([key]) => !hiddenInternalKeys.includes(key as keyof HiddenInternalItemData)
      )
   ) as NotivueSlot
}
