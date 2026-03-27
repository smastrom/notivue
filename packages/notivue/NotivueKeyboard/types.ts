import type { Component, ComputedRef, Ref } from 'vue'

/** @deprecated No longer used. */
export type TabIndexValue = 0 | -1

/** @deprecated No longer used. */
export type ContainersTabIndexMap = Record<string, TabIndexValue>

/** @deprecated No longer used. `useNotivueKeyboard()` is no longer needed. */
export interface NotivueKeyboardData {
   elementsTabIndex: Ref<TabIndexValue>
   containersTabIndex: ComputedRef<ContainersTabIndexMap>
}

export interface NotivueKeyboardProps {
   /**
    * Custom function to determine if a notification container is a candidate
    * for keyboard navigation. Receives the container element.
    *
    * By default, a container is a candidate if it contains at least one
    * focusable element (buttons, links, inputs, selects, textareas, or elements with `tabindex="0"`).
    *
    * @default undefined
    */
   isCandidate?: (container: HTMLElement) => boolean
   /**
    * Key to combine with Control to enter or exit the stream.
    *
    * @default "n"
    */
   comboKey?: string
   /**
    * Whether to focus next candidate or exit the stream after pressing
    * any button or link inside a notification.
    *
    * @default true
    */
   handleClicks?: boolean
   /**
    * Text to be announced when leaving the stream.
    *
    * @default "You left the notifications stream. Press Tab or Control + N to navigate it again."
    */
   leaveMessage?: string
   /**
    * Text to be announced when attempting to navigate the stream but no candidates are available.
    *
    * @default "No notifications to navigate"
    */
   emptyMessage?: string
   /**
    * Whether to render the enter/leave notification or just announce it via screen reader.
    *
    * @default false
    */
   renderAnnouncement?: boolean
   /**
    * Maximum times to announce that the user is leaving the stream.
    *
    * @default 3
    */
   maxAnnouncements?: number
}

export interface NotivueKeyboardSlot {
   default(): Component
}
