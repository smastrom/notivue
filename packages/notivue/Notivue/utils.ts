import type { StoreItem, NotivueSlot, HiddenInternalItemData } from '@/types'

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
