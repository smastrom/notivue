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

// Notify (public API; `push` kept as an alias for backwards compatibility)

export interface NotifyProps<T extends Obj = Obj> {
   props?: T
}

/** @deprecated Use NotifyProps */
export type PushProps<T extends Obj = Obj> = NotifyProps<T>

export interface NotifySpecificOptions {
   skipQueue?: boolean
   ariaLiveOnly?: boolean
}

/** @deprecated Use NotifySpecificOptions */
export type PushSpecificOptions = NotifySpecificOptions

export interface NotifyCallbacks {
   onAutoClear?: (item: NotivueItem) => void
   onManualClear?: (item: NotivueItem) => void
}

/** @deprecated Use NotifyCallbacks */
export type PushCallbacks = NotifyCallbacks

/** Defined by the user when calling notify() */
export type NotifyOptions<T extends Obj = Obj> = NotificationOptions &
   NotifyProps<T> &
   NotifySpecificOptions &
   NotifyCallbacks

/** @deprecated Use NotifyOptions */
export type PushOptions<T extends Obj = Obj> = NotifyOptions<T>

/** Added in background after calling notify() */
export type InternalNotifyOptions = { id: string; type: NotificationType }

/** @deprecated Use InternalNotifyOptions */
export type InternalPushOptions = InternalNotifyOptions

export type NotifyOptionsWithInternals<T extends Obj = Obj> = NotifyOptions<T> &
   InternalNotifyOptions

/** @deprecated Use NotifyOptionsWithInternals */
export type PushOptionsWithInternals<T extends Obj = Obj> = NotifyOptionsWithInternals<T>

/** Final shape of the store item */
export type StoreItem<T extends Obj = Obj> = DeepRequired<NotificationOptions> &
   Required<NotifyProps<T>> &
   InternalNotifyOptions &
   InternalItemData &
   NotifySpecificOptions &
   NotifyCallbacks

/** Portion of the store item exposed to slot */
export type NotivueItem<T extends Obj = Obj> = Omit<StoreItem<T>, keyof HiddenInternalItemData>

export type NotifyParameter<T extends Obj = Obj> =
   | NotifyOptions<T>
   | Exclude<NotificationOptions['message'], undefined> // NonNullable doesn't work?

/** @deprecated Use NotifyParameter */
export type PushParameter<T extends Obj = Obj> = NotifyParameter<T>

export type NotifyStatic = <T extends Obj = Obj>(
   options: NotifyParameter<T>
) => NotificationClearMethods

/** @deprecated Use NotifyStatic */
export type PushStatic = NotifyStatic

export type NotifyPromiseReturnMethod = <T extends Obj = Obj>(
   options: NotifyParameter<T>
) => NotificationClearMethods

/** @deprecated Use NotifyPromiseReturnMethod */
export type PushPromiseReturnMethod = NotifyPromiseReturnMethod

export interface NotifyPromiseReturn {
   resolve: NotifyPromiseReturnMethod
   success: NotifyPromiseReturnMethod
   reject: NotifyPromiseReturnMethod
   error: NotifyPromiseReturnMethod
}

/** @deprecated Use NotifyPromiseReturn */
export type PushPromiseReturn = NotifyPromiseReturn

export type NotifyPromise = <T extends Obj = Obj>(
   options: NotifyParameter<T>
) => NotificationClearMethods & NotifyPromiseReturn

/** @deprecated Use NotifyPromise */
export type PushPromise = NotifyPromise

export interface Notify {
   success: NotifyStatic
   error: NotifyStatic
   info: NotifyStatic
   warning: NotifyStatic
   promise: NotifyPromise
   load: NotifyPromise
   clearAll: () => void
   destroyAll: () => void
}

/** @deprecated Use Notify */
export type Push = Notify

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

export type NotifyClearMethods = NotificationClearMethods

/** @deprecated Use NotifyClearMethods */
export type PushClearMethods = NotifyClearMethods

// New v2.4.0 aliases

export type NotificationTypes = NotificationType

// Aliases prev 1.2.0

export type NotivueSlot = NotivueItem
export type UserNotifyOptions = NotifyOptions

/** @deprecated Use UserNotifyOptions */
export type UserPushOptions = UserNotifyOptions
export type ClearFunctions = NotificationClearMethods
export type ClearMethods = NotificationClearMethods
