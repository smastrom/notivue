import type { NotivueItem } from 'notivue'

export function getAriaLabel(item: NotivueItem) {
   return `${item.title ? `${item.title}: ` : ''}${item.message}`
}
