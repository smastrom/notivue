import type { CSSProperties, Component } from 'vue'
import type { ContainersTabIndexMap } from '@/NotivueKeyboard/types'
import type { NotivueItem } from 'notivue'

export interface NotivueProps {
   class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
   /**
    * Notification containers reactive tabindex map. Only needed if using NotivueKeyboard.
    *
    * @default undefined
    */
   containersTabIndex?: ContainersTabIndexMap
   /**
    * Aria label for the list container. Only effective if using NotivueKeyboard.
    *
    * @default "Notifications"
    */
   listAriaLabel?: string
   /**
    * CSS styles for the list container, list items and notification containers.
    *
    * They have higher priority over the internal styles and will override them.
    *
    * ```ts
    * const styles = {
    *   list: {
    *     position: 'relative',
    *     height: '100%',
    *   },
    *   listItem: {
    *     // ...
    *   },
    *   itemContainer: {
    *     // ...
    *   },
    * }
    * ```
    *
    * @default undefined
    */
   styles?: Partial<Record<NotivueElements, CSSProperties>>
}

export interface NotivueComponentSlot {
   default(item: NotivueItem & { key?: string }): Component
}

// Elements

export type NotivueElements = 'list' | 'listItem' | 'itemContainer'
