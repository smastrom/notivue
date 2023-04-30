import type { VNode, Component, CSSProperties, Ref, ShallowRef, ComputedRef } from 'vue'

export type PluginOptions = {
   register?: string[]
}

// Props

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

export type NotivueOptions = Partial<Record<NotificationType | 'global', Partial<ReceiverOptions>>>

export type NotivueAnimations = Partial<{ enter: string; leave: string; clearAll: string }>

export type ReceiverOptions = {
   icon: boolean
   title: string | false
   message: string
   close: boolean
   duration: number
   ariaLive: 'polite' | 'assertive'
   ariaRole: 'alert' | 'status'
   closeAriaLabel: string
}

export type ReceiverProps = {
   pauseOnHover: boolean
   pauseOnTouch: boolean
   position: Position
   id: InternalPushOptions['id']
   class: string | { [key: string]: boolean } | string[]
   options: NotivueOptions
   animations: NotivueAnimations
   use: DefaultRenderFn
   theme?: Theme
   icons?: Icons
   teleportTo?: string | HTMLElement
}

export type ScopedPushStyles = {
   style?: CSSProperties
   class?: string
}

// Item Internal

export type DefaultOptions = {
   [K in NotificationType]: ReceiverOptions
} & {
   [key: string]: never
}

type InternalOptions = {
   timeoutId: number | undefined
   createdAt: number
   clear: () => void
   destroy: () => void
   elapsed?: number
   stoppedAt?: number
   transitionStyles?: CSSProperties
   animationClass?: string
   onAnimationstart?: (event: AnimationEvent) => void
   onAnimationend?: (event: AnimationEvent) => void
   customComponent?: () => VNode
   prevProps?: CtxProps & Record<string, unknown>
   prevComponent?: () => Component
}

export type InternalPushOptions = { id: string; type: NotificationType }

export type MergedOptions = Required<ReceiverOptions> & IncomingPushOptions

// Store

export type StoreItem = InternalOptions & MergedOptions

export type StoreRefs = {
   items: Ref<StoreItem[]>
   incoming: ShallowRef<IncomingPushOptions>
   isEnabled: Ref<boolean>
   clearAllTrigger: Ref<number>
}

export type StoreComputed = {
   count: ComputedRef<number>
   hasItems: ComputedRef<boolean>
}

export type StoreMethods = {
   createItem: (options: StoreItem) => void
   getItem: (id: InternalPushOptions['id']) => StoreItem | undefined
   updateItem: (id: InternalPushOptions['id'], options: Partial<StoreItem>) => void
   removeItem: (id: InternalPushOptions['id']) => void
   updateAll: (onUpdate: (item: StoreItem) => StoreItem) => void
   destroyAll: () => void
}

export type InternalStoreMethods = {
   setIncoming: (options: IncomingPushOptions) => void
   callItemMethod: (id: InternalPushOptions['id'], method: 'clear' | 'destroy') => void
   clearAll: () => void
   enable: () => void
   disable: () => void
}

export type Store = { push: Push } & StoreMethods & StoreRefs & Omit<StoreComputed, 'count'>

// Push - Create

export type CreatePush = (
   param: InternalStoreMethods &
      Pick<StoreMethods, 'destroyAll'> &
      Pick<StoreRefs, 'isEnabled'> &
      Pick<StoreComputed, 'count'>
) => Push

// Push - Function

export type PushStatic = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => ClearFunctions

type ResolveReject<T> = (
   options: PromiseResultPushOptions<T> | ReceiverOptions['message']
) => ClearFunctions

export type PushPromise = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => ClearFunctions & {
   resolve: ResolveReject<T>
   reject: ResolveReject<T>
}

export type PushMethods = {
   success: PushStatic
   error: PushStatic
   info: PushStatic
   warning: PushStatic
   promise: PushPromise
}

export type Push = PushStatic &
   PushMethods &
   Pick<InternalStoreMethods, 'enable' | 'disable' | 'clearAll'> &
   Pick<StoreMethods, 'destroyAll'> &
   Pick<StoreRefs, 'isEnabled'> &
   Pick<StoreComputed, 'count'>

// Push - Param

export type PushStaticOptions<T> = StaticPushOptions<T> | ReceiverOptions['message']

export type PushPromiseOptions<T> = PromiseResultPushOptions<T> | ReceiverOptions['message']

// Push - Param - Options

export type IncomingPushOptions<T = unknown> = Partial<ReceiverOptions> &
   InternalPushOptions &
   ScopedPushStyles &
   (MaybeRenderStatic<T> | MaybeRenderPromiseResult<T extends Record<string, unknown> ? T : never>)

export type StaticPushOptions<T> = Partial<ReceiverOptions & ScopedPushStyles> &
   MaybeRenderStatic<T>

export type PromiseResultPushOptions<T> = Partial<ReceiverOptions & ScopedPushStyles> &
   MaybeRenderPromiseResult<T>

// Push - Param - Options - Custom Render

export type MaybeRender<T> = {
   render?: {
      component?: () => Component
      props: T
   }
}

export type MaybeRenderStatic<T> = MaybeRender<
   (props: { notivueProps: CtxProps }) => Partial<CtxProps & T>
>

export type MaybeRenderPromiseResult<T = {}> = MaybeRender<
   (props: {
      notivueProps: CtxProps
      prevProps: Omit<T, keyof CtxProps>
   }) => Record<string, unknown>
>

export type CtxProps = Pick<InternalPushOptions, 'type'> & {
   duration: ReceiverOptions['duration']
   message: ReceiverOptions['message']
   clear: () => void
}

// Push - Return

export type ClearFunctions = { clear: () => void; destroy: () => void }

// Default Component

export type DefaultRenderFn = (item: StoreItem, theme?: Theme, icons?: Icons) => VNode

// Theme

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

export type Theme = Partial<Record<ThemeVars, string>>

export type Themes = 'light' | 'pastel' | 'material' | 'dark' | 'slate'

// Icons

export type IconSrc = (() => Component) | string

export type Icons = Partial<Record<NotificationType | 'close', IconSrc>>

// Aliases, mentioned in the docs, not used internally

export type NotivueIcons = Icons
export type NotivueTheme = Theme
export type NotivueProps = ReceiverProps

export type PushOptions<T = {}> = StaticPushOptions<T>
export type PushReturn = ClearFunctions
