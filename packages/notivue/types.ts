import type { Component, CSSProperties } from 'vue'

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

export type NotificationOptionsField = Record<NotificationType | 'global', NotificationOptions>

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
   notifications: NotificationOptionsField
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

export interface ExposedInternalItemData {
   clear: () => void
   destroy: () => void
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

/** Defined by the user when calling push() */
export type UserPushOptions<T extends Obj = Obj> = Partial<NotificationOptions> & PushProps<T>

/** Added in background after calling push() */
export type InternalPushOptions = { id: string; type: NotificationType }

export type UserPushOptionsWithInternals<T extends Obj = Obj> = UserPushOptions<T> &
   InternalPushOptions

/** Final shape of the store item */
export type StoreItem<T extends Obj = Obj> = DeepRequired<NotificationOptions> &
   Required<PushProps<T>> &
   InternalPushOptions &
   InternalItemData

/** Portion of the store item exposed to slot */
export type NotivueSlot<T extends Obj = Obj> = Omit<StoreItem<T>, keyof HiddenInternalItemData>

// Push

export type PushOptions<T extends Obj = Obj> = UserPushOptions<T> | NotificationOptions['message']

export type PushStatic = <T extends Obj = Obj>(options: PushOptions<T>) => ClearFunctions

export type PushPromise = <T extends Obj = Obj>(
   options: PushOptions<T>
) => ClearFunctions & {
   resolve: <T extends Obj = Obj>(options: PushOptions<T>) => ClearFunctions
   reject: <T extends Obj = Obj>(options: PushOptions<T>) => ClearFunctions
}

export interface ClearFunctions {
   clear: () => void
   destroy: () => void
}

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
   // New
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
