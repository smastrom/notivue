import type { Component } from 'vue'
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
}

export interface NotivueComponentSlot {
   default(item: NotivueItem & { key?: string }): Component
}
