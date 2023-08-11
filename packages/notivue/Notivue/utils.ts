import type { StoreItem, NotivueSlot, HiddenInternalItemData } from 'notivue'

export const hiddenInternalKeys: (keyof HiddenInternalItemData)[] = [
   'timeout',
   'elapsed',
   'resumedAt',
   'positionStyles',
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

export function getAriaLabel(item: NotivueSlot) {
   return `${item.title ? `${item.title}: ` : ''}${item.message}`
}
