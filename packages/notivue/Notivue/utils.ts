import type { NotivueItem } from 'notivue'

export const isMouse = (e: PointerEvent) => e.pointerType === 'mouse'

export function getAriaLabel(item: NotivueItem) {
   return `${item.title ? `${item.title}: ` : ''}${item.message}`
}
