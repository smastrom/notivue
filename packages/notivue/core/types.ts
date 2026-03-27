import type { Ref, ComputedRef, CSSProperties, ToRefs } from 'vue'

import {
   createItems,
   createTimeouts,
   createElements,
   createQueue,
   createAnimations,
} from './createStore'

// —— Utilities

export type DeepRequired<T> = {
   [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

export type DeepPartial<T> = {
   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type Obj = Record<string, any>

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

// —— Stream: kinds, layout, `createNotivue` config, config patches

/** `data-notivue` value per item. Legacy `promise*` literals are normalized when enqueued. */
export type NotificationType =
   | 'success'
   | 'error'
   | 'info'
   | 'warning'
   | 'loading'
   | 'loading-success'
   | 'loading-error'
   /** @deprecated Alias of `'loading'`. */
   | 'promise'
   /** @deprecated Alias of `'loading-success'`. */
   | 'promise-resolve'
   /** @deprecated Alias of `'loading-error'`. */
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
   /** Default title (`''` hides the title). */
   title?: string | Ref<string>
   message?: string | Ref<string>
   duration?: number
   ariaLive?: 'polite' | 'assertive'
   ariaRole?: 'alert' | 'status'
}

export type NotificationTypesOptions = Record<NotificationType | 'global', NotificationOptions>

export interface NotivueConfig {
   pauseOnHover?: boolean
   pauseOnTouch?: boolean
   pauseOnTabChange?: boolean
   enqueue?: boolean
   /** Stream anchor; see `Position`. */
   position?: Position
   notifications?: Partial<NotificationTypesOptions>
   animations?: NotivueAnimations
   /** Must match `transform <duration> <timing-function>`. */
   transition?: string
   teleportTo?: string | HTMLElement | false
   /** Use `-1` for unlimited. @default -1 */
   limit?: number
   avoidDuplicates?: boolean
}

export type NotivueConfigRequired = DeepRequired<NotivueConfig> & {
   notifications: DeepRequired<NotificationTypesOptions>
}

/** `updateConfig` / `config.update`: partial config or updater from merged config. */
export type NotivueConfigUpdateParam =
   | NotivueConfig
   | ((config: NotivueConfigRequired) => NotivueConfig)

/** @deprecated Use `NotivueConfigUpdateParam`. */
export type UpdateParam = NotivueConfigUpdateParam

// —— Store item (internal + slot-facing)

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

export type InternalItemData = ExposedInternalItemData & HiddenInternalItemData

// —— `notify()` / `push`

export interface NotifyProps<T extends object = Obj> {
   props?: T
}

/** @deprecated Use `NotifyProps`. */
export type PushProps<T extends object = Obj> = NotifyProps<T>

export interface NotifySpecificOptions {
   skipQueue?: boolean
   ariaLiveOnly?: boolean
}

/** @deprecated Use `NotifySpecificOptions`. */
export type PushSpecificOptions = NotifySpecificOptions

export interface NotifyCallbacks {
   /** Runs when the notification's duration expires (timeout). */
   onTimedOut?: (item: NotivueItem) => void
   /** Runs when the user dismisses the notification or `clear()` is called. */
   onClear?: (item: NotivueItem) => void
   /** Runs when `destroy()` is called. */
   onDestroy?: (item: NotivueItem) => void

   /** @deprecated Use `onTimedOut`. */
   onAutoClear?: (item: NotivueItem) => void
   /** @deprecated Use `onClear`. */
   onManualClear?: (item: NotivueItem) => void
}

/** @deprecated Use `NotifyCallbacks`. */
export type PushCallbacks = NotifyCallbacks

export type NotifyOptions<T extends object = Obj> = Prettify<
   NotificationOptions & NotifyProps<T> & NotifySpecificOptions & NotifyCallbacks
>

/** @deprecated Use `NotifyOptions`. */
export type PushOptions<T extends object = Obj> = NotifyOptions<T>

export type InternalNotifyOptions = { id: string; type: NotificationType }

/** @deprecated Use `InternalNotifyOptions`. */
export type InternalPushOptions = InternalNotifyOptions

export type NotifyOptionsWithInternals<T extends object = Obj> = NotifyOptions<T> &
   InternalNotifyOptions

/** @deprecated Use `NotifyOptionsWithInternals`. */
export type PushOptionsWithInternals<T extends object = Obj> = NotifyOptionsWithInternals<T>

export type StoreItem<T extends object = Obj> = DeepRequired<NotificationOptions> &
   Required<NotifyProps<T>> &
   InternalNotifyOptions &
   InternalItemData &
   NotifySpecificOptions &
   NotifyCallbacks

export type NotivueItem<T extends object = Obj> = Prettify<
   Omit<StoreItem<T>, keyof HiddenInternalItemData>
>

export type NotifyParameter<T extends object = Obj> =
   | NotifyOptions<T>
   | Exclude<NotificationOptions['message'], undefined>

/** @deprecated Use `NotifyParameter`. */
export type PushParameter<T extends object = Obj> = NotifyParameter<T>

/** Shared arity for methods that only take options and return clear handles. */
type NotifyOptionsToClearMethods = <T extends object = Obj>(
   options: NotifyParameter<T>
) => NotificationClearMethods

export type NotifyStatic = NotifyOptionsToClearMethods

/** @deprecated Use `NotifyStatic`. */
export type PushStatic = NotifyStatic

export type NotifyPromiseReturnMethod = NotifyOptionsToClearMethods

/** @deprecated Use `NotifyPromiseReturnMethod`. */
export type PushPromiseReturnMethod = NotifyPromiseReturnMethod

/** Handle from `notify.loading()`; prefer `success` / `error` (`resolve` / `reject` are aliases). */
export interface NotifyLoadingReturn {
   success: NotifyPromiseReturnMethod
   error: NotifyPromiseReturnMethod
   resolve: NotifyPromiseReturnMethod
   reject: NotifyPromiseReturnMethod
}

/** @deprecated Use `NotifyLoadingReturn`. */
export type NotifyLoadReturn = NotifyLoadingReturn
/** @deprecated Use `NotifyLoadingReturn`. */
export type NotifyPromiseReturn = NotifyLoadingReturn
/** @deprecated Use `NotifyLoadingReturn`. */
export type PushPromiseReturn = NotifyLoadingReturn

export type NotifyLoading = <T extends object = Obj>(
   options: NotifyParameter<T>
) => NotificationClearMethods & NotifyLoadingReturn

/** @deprecated Use `NotifyLoading`. */
export type NotifyLoad = NotifyLoading
/** @deprecated Use `NotifyLoading`. */
export type NotifyPromise = NotifyLoading
/** @deprecated Use `NotifyLoading`. */
export type PushPromise = NotifyLoading

export interface Notify {
   success: NotifyStatic
   error: NotifyStatic
   info: NotifyStatic
   warning: NotifyStatic
   loading: NotifyLoading
   /** @deprecated Use `loading`. */
   load: NotifyLoading
   /** @deprecated Use `loading`. */
   promise: NotifyLoading
   clearAll: () => void
   destroyAll: () => void
}

/** @deprecated Use `Notify`. */
export type Push = Notify

// —— Store slices

export type ConfigSlice = ToRefs<NotivueConfigRequired> & {
   update: (newConfig: NotivueConfigUpdateParam) => void
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

export type UseNotivueReturn = Prettify<
   ConfigSlice & {
      isStreamPaused: ComputedRef<boolean>
      /** @deprecated Create computed property instead: `computed(() => config.position.value.startsWith('top'))`. */
      isTopAlign: ComputedRef<boolean>
   }
>

// —— Extra public names (historical / ergonomics)

/** @deprecated Use `NotificationOptions`. */
export type NotivueNotificationOptions = NotificationOptions
/** @deprecated Use `Position`. */
export type NotivuePosition = Position
/** @deprecated Use `NotificationType`. */
export type NotivueNotificationType = NotificationType
/** @deprecated Use `NotificationClearMethods`. */
export type NotifyClearMethods = NotificationClearMethods

/** @deprecated Use `NotificationClearMethods`. */
export type PushClearMethods = NotificationClearMethods

/** @deprecated Use `NotificationType`. */
export type NotificationTypes = NotificationType

/** @deprecated Use `NotivueItem`. */
export type NotivueSlot = NotivueItem
/** @deprecated Use `NotifyOptions`. */
export type UserNotifyOptions = NotifyOptions

/** @deprecated Use `NotifyOptions`. */
export type UserPushOptions = NotifyOptions

/** @deprecated Use `NotificationClearMethods`. */
export type ClearFunctions = NotificationClearMethods
/** @deprecated Use `NotificationClearMethods`. */
export type ClearMethods = NotificationClearMethods
