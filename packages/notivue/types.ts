import type { Component, ComputedRef, CSSProperties } from 'vue'

import { createStore } from './core/createStore'

// Utils

export type DeepRequired<T> = { [K in keyof T]: DeepRequired<T[K]> } & Required<T>
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
export type Obj = Record<string, any>

// Shared

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

export type NotivueIcons = Partial<
   Record<NotificationType | 'close', Component | string | null | undefined>
>

// Config

export type NotificationTypesOptions = Record<NotificationType | 'global', NotificationOptions>

export interface NotivueConfigRequired {
   /** Whether to pause all notifications when hovering over them with mouse. */
   pauseOnHover: boolean
   /** Whether to pause all notifications when tapping on them with touch devices. */
   pauseOnTouch: boolean
   /** Whether to pause all notifications when switching tabs or window. */
   pauseOnTabChange: boolean
   /** Wheter to enqueue notifications when limit is reached. */
   enqueue: boolean
   /** Position of notifications, one of 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'. */
   position: Position
   /** Notification options for each type. */
   notifications: NotificationTypesOptions
   /** Animation classes for `enter`, `leave` and `clearAll`. */
   animations: Partial<{ enter: string; leave: string; clearAll: string }>
   /** Tag or element to which the stream will be teleported. */
   teleportTo: string | HTMLElement
   /** Notifications limit. Defaults to `Infinity`. */
   limit: number
}

export type NotivueConfig = DeepPartial<NotivueConfigRequired>

export interface NotificationOptions {
   /** String to use as default title, an empty string doesn't render the title. */
   title: string
   /** String to use as default message. */
   message: string
   /** Duration of the notification. */
   duration: number
   /** Value of `aria-live` attribute. */
   ariaLive: 'polite' | 'assertive'
   /** Value of `role` attribute. */
   ariaRole: 'alert' | 'status'
}

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
   positionStyles?: CSSProperties
   animationClass?: string
   onAnimationstart?: (event: AnimationEvent) => void
   onAnimationend?: (event: AnimationEvent) => void
}

/** Options added internally when creating a notification. */
export type InternalItemData = ExposedInternalItemData & HiddenInternalItemData

export interface PushProps<T extends Obj = Obj> {
   props?: T
}

export interface PushSpecificOptions {
   skipQueue?: boolean
   ariaLiveOnly?: boolean
}

/** Defined by the user when calling push() */
export type PushOptions<T extends Obj = Obj> = Partial<NotificationOptions> &
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

// Push

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

// Elements

export type NotivueElements = 'ol' | 'li' | 'item'

// Themes

export type ThemeNames = 'lightTheme' | 'pastelTheme' | 'materialTheme' | 'darkTheme' | 'slateTheme'

export type NotivueTheme = Partial<Record<ThemeVars, string>>

type ThemeLayoutVars =
   | '--nv-width'
   | '--nv-spacing'
   | '--nv-radius'
   | '--nv-border-width'
   | '--nv-icon-size'
   | '--nv-title-size'
   | '--nv-message-size'
   | '--nv-shadow'
   | '--nv-tip-width'
   | '--nv-y-align'

type ThemeGlobalColorsVars =
   | '--nv-global-bg'
   | '--nv-global-fg'
   | '--nv-global-accent'
   | '--nv-global-border'

type SuccessColorsVars =
   | '--nv-success-fg'
   | '--nv-success-bg'
   | '--nv-success-border'
   | '--nv-success-accent'

type ErrorColorsVars = '--nv-error-fg' | '--nv-error-bg' | '--nv-error-border' | '--nv-error-accent'

type WarningColorsVars =
   | '--nv-warning-fg'
   | '--nv-warning-bg'
   | '--nv-warning-border'
   | '--nv-warning-accent'

type InfoColorsVars = '--nv-info-fg' | '--nv-info-bg' | '--nv-info-border' | '--nv-info-accent'

type PromiseColorsVars =
   | '--nv-promise-fg'
   | '--nv-promise-bg'
   | '--nv-promise-border'
   | '--nv-promise-accent'

type ThemeVars =
   | ThemeLayoutVars
   | ThemeGlobalColorsVars
   | SuccessColorsVars
   | ErrorColorsVars
   | WarningColorsVars
   | InfoColorsVars
   | PromiseColorsVars

// Exported Composables

export type NotivueStore = ReturnType<typeof createStore>
export type NotivueReactiveConfig = NotivueStore['config']

export interface NotivueComputedEntries {
   entries: ComputedRef<NotivueItem[]>
   queue: ComputedRef<NotivueItem[]>
}

// Aliases prev 1.2.0

export type NotivueSlot = NotivueItem
export type UserPushOptions = PushOptions
export type ClearFunctions = NotificationClearMethods
export type ClearMethods = NotificationClearMethods
export type NotificationOptionsField = NotificationTypesOptions
