import type { StoreItem, NotivueSlot, HiddenInternalItemData } from 'notivue'

export const hiddenInternalKeys: (keyof HiddenInternalItemData)[] = [
   'timeout',
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
