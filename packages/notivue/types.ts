import type { VNode, Component, CSSProperties } from 'vue'

// Utils

export type DeepRequired<T> = { [K in keyof T]: DeepRequired<T[K]> } & Required<T>
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

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

export type Icons = Partial<Record<string, Component | string>>
export type ClassName = string | { [key: string]: boolean } | string[]

// Config

export interface NotivueConfig {
   pauseOnHover: boolean
   pauseOnTouch: boolean
   position: Position
   class: ClassName
   options: Record<string, NotificationOptions>
   animations: Partial<{ enter: string; leave: string; clearAll: string }>
   teleportTo: string | HTMLElement
   theme: Theme
   icons: Icons
}

export interface NotificationOptions {
   icon: boolean
   title: string | false
   message: string
   close: boolean
   duration: number
   ariaLive: 'polite' | 'assertive'
   ariaRole: 'alert' | 'status'
   closeAriaLabel: string
   class: ClassName
   props: Record<string, any>
}

// Store Item

/** Options added internally when creating a notification. */
export interface InternalNotificationOptions {
   timeoutId: number | undefined
   clear: () => void
   destroy: () => void
   elapsed: number
   updatedAt: number
   createdAt: number
   transitionStyles?: CSSProperties
   animationClass?: string
   onAnimationstart?: (event: AnimationEvent) => void
   onAnimationend?: (event: AnimationEvent) => void
}

export interface InlinePushStyles {
   style?: CSSProperties
}

export type InternalPushOptions = { id: string; type: string } // Added by push() in background

export type UserPushOptions = Partial<NotificationOptions> & InlinePushStyles // Defined when calling push()

export type UserPushOptionsWithInternals = UserPushOptions & InternalPushOptions // Added after calling push() and passed to store.push()

export type StoreItem = DeepRequired<Omit<UserPushOptionsWithInternals, 'style'>> &
   InlinePushStyles &
   InternalNotificationOptions // Merged by store.push()

// Push - Params

export type PushStaticOptions = UserPushOptions | NotificationOptions['message']

export type PushCustomOptions = UserPushOptions & {
   type: InternalPushOptions['type']
}

export type PushPromiseOptions = UserPushOptions | NotificationOptions['message']

// Push - Methods

export type PushStatic = (options: PushStaticOptions) => ClearFunctions
export type PushCustom = (options: PushCustomOptions) => ClearFunctions

export type PushPromise = (
   options: UserPushOptions | NotificationOptions['message']
) => ClearFunctions & {
   resolve: ResolveReject
   reject: ResolveReject
}

type ResolveReject = (options: UserPushOptions | NotificationOptions['message']) => ClearFunctions

export interface ClearFunctions {
   clear: () => void
   destroy: () => void
}

// Push - Object

export interface Push {
   success: PushStatic
   error: PushStatic
   info: PushStatic
   warning: PushStatic
   promise: PushPromise
   custom: PushCustom
   clearAll: () => void
   destroyAll: () => void
}

// Themes

export type Theme = Partial<Record<ThemeVars, string>>

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

type PromiseResolveColorsVars =
   | '--nv-promise-resolve-foreground'
   | '--nv-promise-resolve-background'
   | '--nv-promise-resolve-border'
   | '--nv-promise-resolve-accent'

type PromiseRejectColorsVars =
   | '--nv-promise-reject-foreground'
   | '--nv-promise-reject-background'
   | '--nv-promise-reject-border'
   | '--nv-promise-reject-accent'

type ThemeVars =
   | ThemeLayoutVars
   | ThemeGlobalColorsVars
   | SuccessColorsVars
   | ErrorColorsVars
   | WarningColorsVars
   | InfoColorsVars
   | PromiseColorsVars
   | PromiseResolveColorsVars
   | PromiseRejectColorsVars

export type DefaultOptions = {
   [K in NotificationType]: NotificationOptions
} & {
   [key: string]: never
}

// Aliases, mentioned in the docs, not used internally

export type NotivueIcons = Icons
export type NotivueTheme = Theme
