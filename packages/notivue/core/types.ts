import type { Ref, ComputedRef, CSSProperties, ToRefs } from 'vue'

import {
   createItems,
   createTimeouts,
   createElements,
   createQueue,
   createAnimations,
} from './createStore'

// Utils

export type DeepRequired<T> = {
   [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

export type DeepPartial<T> = {
   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type Obj = Record<string, any>

// Config

export type UpdateParam = NotivueConfig | ((config: NotivueConfigRequired) => NotivueConfig)

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

export interface NotivueAnimations {
   enter?: string
   leave?: string
   clearAll?: string
}

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

export type NotificationTypesOptions = Record<NotificationType | 'global', NotificationOptions>

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
   notifications?: Partial<NotificationTypesOptions>
   /** Animation classes for `enter`, `leave` and `clearAll`. */
   animations?: NotivueAnimations
   /** Transition property applied when repositioning notifications. Must match the following pattern:
    *
    * `transform <duration> <timing-function>`
    *
    * @example
    *
    * ```ts
    * transition: 'transform 0.35s cubic-bezier(0.5, 1, 0.25, 1)'
    * ```
    */
   transition?: string
   /** Tag or element to which the stream will be teleported. */
   teleportTo?: string | HTMLElement | false
   /** Notifications limit. Defaults to `Infinity`. */
   limit?: number
   /** Whether to prevent duplicate notifications if already displayed. Duplicates will be announced again and their duration replaces the current one. */
   avoidDuplicates?: boolean
}

export type NotivueConfigRequired = DeepRequired<NotivueConfig> & {
   notifications: DeepRequired<NotificationTypesOptions>
}

// Store Item

export interface NotificationClearMethods {
   clear: () => void
   destroy: () => void
}

export interface ExposedInternalItemData extends NotificationClearMethods {
   createdAt: number
   duplicateCount: number
}

export interface HiddenInternalItemData {
   timeout: number | undefined | (() => void) | void
   resumedAt: number
   remaining: number
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
}

export interface PushCallbacks {
   onAutoClear?: (item: NotivueItem) => void
   onManualClear?: (item: NotivueItem) => void
}

/** Defined by the user when calling push() */
export type PushOptions<T extends Obj = Obj> = NotificationOptions &
   PushProps<T> &
   PushSpecificOptions &
   PushCallbacks

/** Added in background after calling push() */
export type InternalPushOptions = { id: string; type: NotificationType }

export type PushOptionsWithInternals<T extends Obj = Obj> = PushOptions<T> & InternalPushOptions

/** Final shape of the store item */
export type StoreItem<T extends Obj = Obj> = DeepRequired<NotificationOptions> &
   Required<PushProps<T>> &
   InternalPushOptions &
   InternalItemData &
   PushSpecificOptions &
   PushCallbacks

/** Portion of the store item exposed to slot */
export type NotivueItem<T extends Obj = Obj> = Omit<StoreItem<T>, keyof HiddenInternalItemData>

export type PushParameter<T extends Obj = Obj> =
   | PushOptions<T>
   | Exclude<NotificationOptions['message'], undefined> // NonNullable doesn't work?

export type PushStatic = <T extends Obj = Obj>(
   options: PushParameter<T>
) => NotificationClearMethods

export type PushPromiseReturnMethod = <T extends Obj = Obj>(
   options: PushParameter<T>
) => NotificationClearMethods

export interface PushPromiseReturn {
   resolve: PushPromiseReturnMethod
   success: PushPromiseReturnMethod
   reject: PushPromiseReturnMethod
   error: PushPromiseReturnMethod
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
   load: PushPromise
   clearAll: () => void
   destroyAll: () => void
}

export type ConfigSlice = ToRefs<NotivueConfigRequired> & {
   update: (newConfig: UpdateParam) => void
}

export type AnimationsSlice = ReturnType<typeof createAnimations>
export type TimeoutsSlice = ReturnType<typeof createTimeouts>
export type QueueSlice = ReturnType<typeof createQueue>
export type ItemsSlice = ReturnType<typeof createItems>
export type ElementsSlice = ReturnType<typeof createElements>

export interface NotivueInstance {
   isRunning: Readonly<Ref<boolean>>
   startInstance: () => void
   stopInstance: () => void
}

export interface NotivueStore {
   config: ConfigSlice
   animations: AnimationsSlice
   timeouts: TimeoutsSlice
   queue: QueueSlice
   items: ItemsSlice
   elements: ElementsSlice
}

export interface NotivueComputedEntries {
   entries: ComputedRef<NotivueItem[]>
   queue: ComputedRef<NotivueItem[]>
}

// New v2.1.0 aliases

export type UseNotivueReturn = ConfigSlice & {
   isStreamPaused: Readonly<Ref<boolean>>
   isTopAlign: ComputedRef<boolean>
}

export type NotivueNotificationOptions = NotificationOptions
export type NotivuePosition = Position
export type NotivueNotificationType = NotificationType

// New v2.1.1 aliases

export type PushClearMethods = NotificationClearMethods

// New v2.4.0 aliases

export type NotificationTypes = NotificationType

// Aliases prev 1.2.0

export type NotivueSlot = NotivueItem
export type UserPushOptions = PushOptions
export type ClearFunctions = NotificationClearMethods
export type ClearMethods = NotificationClearMethods
