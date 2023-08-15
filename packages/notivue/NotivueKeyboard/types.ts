import type { ComputedRef, Ref } from 'vue'

export type TabIndexValue = 0 | -1
export type ContainersTabIndexMap = Record<string, TabIndexValue>

export interface NotivueKeyboardData {
   /**
    * Reactive tab index value for the custom notification focusable elements tabindex.
    *
    * Meant to be added to the custom notification elements via `:tabindex="elementsTabIndex"`.
    */
   elementsTabIndex: Ref<TabIndexValue>
   /**
    * Reactive map of tab index values for the notification containers.
    *
    * Meant to be passed as prop to Notivue via `:containersTabIndex="containersTabIndex"`.
    */
   containersTabIndex: ComputedRef<ContainersTabIndexMap>
}

export interface NotivueKeyboardProps {
   /**
    * Key to combine with Shift to enter or exit the stream.
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
    * Text to be announced when leaving the stream
    *
    * @default "You're exiting the notifications stream. Press CTRL + N to navigate it again."
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
    * @default true
    */
   renderAnnouncement?: boolean
}
