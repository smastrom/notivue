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

export type NotivueIcons = Partial<Record<NotificationType | 'close', Component | string>>

// Config

export interface NotivueConfigRequired {
   pauseOnHover: boolean
   pauseOnTouch: boolean
   position: Position
   class: string
   notifications: Record<NotificationType, NotificationOptions>
   animations: Partial<{ enter: string; leave: string; clearAll: string }>
   teleportTo: string | HTMLElement
   theme: NotivueTheme
   icons: NotivueIcons
}

export type NotivueConfig = DeepPartial<NotivueConfigRequired>

export interface NotificationOptions {
   icon: boolean
   title: string
   message: string
   close: boolean
   duration: number
   ariaLive: 'polite' | 'assertive'
   ariaRole: 'alert' | 'status'
   closeAriaLabel: string
   class: string
}

// Store Item

export interface ExposedInternalItemData {
   clear: () => void
   destroy: () => void
   createdAt: number
}

export interface HiddenInternalItemData {
   timeoutId: number | undefined
   elapsed: number
   updatedAt: number
   transitionStyles?: CSSProperties
   animationClass?: string
   onAnimationstart?: (event: AnimationEvent) => void
   onAnimationend?: (event: AnimationEvent) => void
}

/** Options added internally when creating a notification. */
export type InternalItemData = ExposedInternalItemData & HiddenInternalItemData

export interface InlinePushStyles {
   style?: CSSProperties
}

export interface PushProps<T extends Obj = Obj> {
   props?: T
}

/** Defined by the user when calling push() */
export type UserPushOptions<T extends Obj = Obj> = Partial<NotificationOptions> &
   InlinePushStyles &
   PushProps<T>

/** Added in background after calling push() */
export type InternalPushOptions = { id: string; type: NotificationType }

export type UserPushOptionsWithInternals<T extends Obj = Obj> = UserPushOptions<T> &
   InternalPushOptions

/** Final shape of the store item */
export type StoreItem<T extends Obj = Obj> = DeepRequired<NotificationOptions> &
   Required<PushProps<T>> &
   InlinePushStyles &
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

export type NotivueElements = 'wrapper' | 'container' | 'row' | 'box'

// Themes

export type NotivueTheme = Partial<Record<ThemeVars, string>>

export type Themes = 'light' | 'pastel' | 'material' | 'dark' | 'slate'

type ThemeLayoutVars =
   | '--nv-width'
   | '--nv-spacing'
   | '--nv-radius'
   | '--nv-border-width'
   | '--nv-icon-size'
   | '--nv-title-size'
   | '--nv-message-size'
   | '--nv-close-size'
   | '--nv-shadow'

type ThemeGlobalColorsVars =
   | '--nv-global-background'
   | '--nv-global-foreground'
   | '--nv-global-accent'
   | '--nv-global-border'

type SuccessColorsVars =
   | '--nv-success-foreground'
   | '--nv-success-background'
   | '--nv-success-border'
   | '--nv-success-accent'

type ErrorColorsVars =
   | '--nv-error-foreground'
   | '--nv-error-background'
   | '--nv-error-border'
   | '--nv-error-accent'

type WarningColorsVars =
   | '--nv-warning-foreground'
   | '--nv-warning-background'
   | '--nv-warning-border'
   | '--nv-warning-accent'

type InfoColorsVars =
   | '--nv-info-foreground'
   | '--nv-info-background'
   | '--nv-info-border'
   | '--nv-info-accent'

type PromiseColorsVars =
   | '--nv-promise-foreground'
   | '--nv-promise-background'
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
