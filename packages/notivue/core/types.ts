import type { Ref, ComputedRef, CSSProperties } from 'vue'

import {
   createItemsSlice,
   createConfigSlice,
   createTimeoutsSlice,
   createElementsSlice,
   createQueueSlice,
   createAnimationsSlice,
} from './createStore'

// Utils

type DeepRequired<T> = {
   [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

export type DeepPartial<T> = {
   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type Obj = Record<string, any>

// Config

export type NotificationType =
   | 'success'
   | 'error'
   | 'info'
   | 'warning'
   | 'promise'
   | 'promise-resolve'
   | 'promise-reject'

export type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'

export type NotivueAnimations = { enter?: string; leave?: string; clearAll?: string }

export interface NotificationOptions {
   /** String to use as default title, an empty string doesn't render the title. */
   title?: string | Ref<string>
   /** String to use as default message. */
   message?: string | Ref<string>
   /** Duration of the notification. */
   duration?: number
   /** Value of `aria-live` attribute. */
   ariaLive?: 'polite' | 'assertive'
   /** Value of `role` attribute. */
   ariaRole?: 'alert' | 'status'
}

export interface NotivueConfig {
   /** Whether to pause all notifications when hovering over them with mouse. */
   pauseOnHover?: boolean
   /** Whether to pause all notifications when tapping on them with touch devices. */
   pauseOnTouch?: boolean
   /** Whether to pause all notifications when switching tabs or window. */
   pauseOnTabChange?: boolean
   /** Wheter to enqueue notifications when limit is reached. */
   enqueue?: boolean
   /** Position of notifications, one of 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'. */
   position?: Position
   /** Notification options for each type. */
   notifications?: Partial<Record<NotificationType | 'global', NotificationOptions>>
   /** Animation classes for `enter`, `leave` and `clearAll`. */
   animations?: NotivueAnimations
   /** Tag or element to which the stream will be teleported. */
   teleportTo?: string | HTMLElement
   /** Notifications limit. Defaults to `Infinity`. */
   limit?: number
}

export type NotivueConfigRequired = DeepRequired<NotivueConfig>

// Store Item

export interface NotificationClearMethods {
   clear: () => void
   destroy: () => void
}

export interface ExposedInternalItemData extends NotificationClearMethods {
   createdAt: number
}

export interface HiddenInternalItemData {
   timeout: number | undefined | (() => void) | void
   elapsed: number
   resumedAt: number
   animationAttrs: Partial<{ class: string; onAnimationend: () => void }>
   positionStyles: CSSProperties
}

/** Options added internally when creating a notification. */
export type InternalItemData = ExposedInternalItemData & HiddenInternalItemData

// Push

export interface PushProps<T extends Obj = Obj> {
   props?: T
}

export interface PushSpecificOptions {
   skipQueue?: boolean
   ariaLiveOnly?: boolean
   onAutoClear?: (item: NotivueSlot) => void
   onManualClear?: (item: NotivueSlot) => void
}

/** Defined by the user when calling push() */
export type PushOptions<T extends Obj = Obj> = NotificationOptions &
   PushProps<T> &
   PushSpecificOptions

/** Added in background after calling push() */
export type InternalPushOptions = { id: string; type: NotificationType }

export type PushOptionsWithInternals<T extends Obj = Obj> = PushOptions<T> & InternalPushOptions

/** Final shape of the store item */
export type StoreItem<T extends Obj = Obj> = DeepRequired<NotificationOptions> &
   Required<PushProps<T>> &
   InternalPushOptions &
   InternalItemData &
   PushSpecificOptions

/** Portion of the store item exposed to slot */
export type NotivueItem<T extends Obj = Obj> = Omit<StoreItem<T>, keyof HiddenInternalItemData>

export type PushParameter<T extends Obj = Obj> = PushOptions<T> | NotificationOptions['message']

export type PushStatic = <T extends Obj = Obj>(
   options: PushParameter<T>
) => NotificationClearMethods

export interface PushPromiseReturn {
   resolve: <T extends Obj = Obj>(options: PushParameter<T>) => NotificationClearMethods
   reject: <T extends Obj = Obj>(options: PushParameter<T>) => NotificationClearMethods
}

export type PushPromise = <T extends Obj = Obj>(
   options: PushParameter<T>
) => NotificationClearMethods & PushPromiseReturn

export interface Push {
   success: PushStatic
   error: PushStatic
   info: PushStatic
   warning: PushStatic
   promise: PushPromise
   clearAll: () => void
   destroyAll: () => void
}

export type ConfigSlice = ReturnType<typeof createConfigSlice>
export type AnimationsSlice = ReturnType<typeof createAnimationsSlice>
export type TimeoutsSlice = ReturnType<typeof createTimeoutsSlice>
export type QueueSlice = ReturnType<typeof createQueueSlice>
export type ItemsSlice = ReturnType<typeof createItemsSlice>
export type ElementsSlice = ReturnType<typeof createElementsSlice>

export type NotivueStore = {
   config: ConfigSlice
   animations: AnimationsSlice
   timeouts: TimeoutsSlice
   queue: QueueSlice
   items: ItemsSlice
   elements: ElementsSlice
   push: Push
}

export interface NotivueComputedEntries {
   entries: ComputedRef<NotivueItem[]>
   queue: ComputedRef<NotivueItem[]>
}

// Aliases prev 1.2.0

export type NotivueSlot = NotivueItem
export type UserPushOptions = PushOptions
export type ClearFunctions = NotificationClearMethods
export type ClearMethods = NotificationClearMethods
