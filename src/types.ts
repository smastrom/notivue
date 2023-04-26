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
   position: Position
   id: string
   class: string | { [key: string]: boolean } | string[]
   options: NotivueOptions
   animations: NotivueAnimations
   use: DefaultRenderFn
   theme?: Theme
   icons?: Icons
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

type InternalItemOptions = {
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

export type MergedOptions = Required<ReceiverOptions> & IncomingPushOptions

export type InternalPushOptions = { id: string; type: NotificationType }

// Store

export type StoreItem = InternalItemOptions & MergedOptions

export type StoreRefs = {
   items: Ref<StoreItem[]>
   incoming: ShallowRef<IncomingPushOptions>
   clearAllScheduler: Ref<number>
   isEnabled: Ref<boolean>
   hasItems: ComputedRef<boolean>
}

export type StoreFns = {
   createItem: (options: StoreItem) => void
   getItem: (id: string) => StoreItem | undefined
   updateItem: (id: string, options: Partial<StoreItem>) => void
   removeItem: (id: string) => void
   destroyAll: () => void
   updateAll: (onUpdate: (item: StoreItem) => StoreItem) => void
   animateItem: (id: string, className: string, onEnd: () => void) => void
}

export type CreatePushParam = {
   setIncoming: (options: IncomingPushOptions) => void
   callItemMethod: (id: string, method: 'clear' | 'destroy') => void
   scheduleClearAll: () => void
   enable: () => void
   disable: () => void
   count: ComputedRef<number>
} & Pick<StoreFns, 'destroyAll'> &
   Pick<StoreRefs, 'isEnabled' | 'hasItems'>

export type Store = { push: Push } & StoreRefs & StoreFns

// Push - Function

export type PushStatic = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => ClearFunctions

export type PushPromise = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => ClearFunctions & {
   resolve: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFunctions
   reject: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFunctions
}

export type Push = PushStatic & {
   error: PushStatic
   success: PushStatic
   warning: PushStatic
   info: PushStatic
   promise: PushPromise
   clearAll: () => void
   destroyAll: () => void
   enable: () => void
   disable: () => void
   isEnabled: Ref<boolean>
   hasItems: ComputedRef<boolean>
   count: Ref<number>
}

// Push - Param

export type PushStaticParam<T> = StaticPushOptions<T> | ReceiverOptions['message']

export type PushPromiseParam<T> = PromiseResultPushOptions<T> | ReceiverOptions['message']

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

export type MaybeRenderStatic<T> = {
   render?: {
      component?: () => Component
      props?: (props: { notivueProps: CtxProps }) => Partial<CtxProps & T>
   }
}

export type MaybeRenderPromiseResult<T = {}> = {
   render?: {
      component?: () => Component
      props?: (props: {
         notivueProps: CtxProps
         prevProps: Omit<T, keyof CtxProps>
      }) => Record<string, unknown>
   }
}

export type CtxProps = Pick<InternalPushOptions, 'type'> & {
   duration: ReceiverOptions['duration']
   message: ReceiverOptions['message']
   clear: () => void
}

// Push - Return

export type ClearFunctions = { clear: () => void; destroy: () => void }

// Default Component

export type DefaultRenderFnParam = {
   item: StoreItem
   theme: Theme | undefined
   icons: Record<string, IconSrc> | undefined
}

export type DefaultRenderFn = (param: DefaultRenderFnParam) => VNode

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

type ThemeVars =
   | ThemeLayoutVars
   | ThemeGlobalColorsVars
   | SuccessColorsVars
   | ErrorColorsVars
   | WarningColorsVars
   | InfoColorsVars
   | PromiseColorsVars

export type Theme = Partial<Record<ThemeVars, string>>

export type Themes = 'light' | 'pastel' | 'material' | 'dark' | 'slate'

// Icons

export type IconSrc = (() => Component) | string

export type Icons = Partial<Record<NotificationType | 'close', IconSrc>>

// Aliases, mentioned in the docs, not used internally

export type NotivueIcons = Icons
export type NotivueTheme = Theme
export type PushOptions<T = {}> = StaticPushOptions<T>
export type PushReturn = ClearFunctions
