import type { VNode, Component, CSSProperties, Ref, ShallowRef } from 'vue'

declare module 'vue' {
   interface ComponentCustomProperties {
      $push: PushFn
   }
}

export type PluginOptions = {
   register?: string[]
}

// Receiver Props

export type NotificationTypes =
   | 'success'
   | 'error'
   | 'info'
   | 'warning'
   | 'promise'
   | 'promise-resolve'
   | 'promise-reject'

export type IconSrc = (() => Component) | string

export type DefaultRenderFnParam = {
   item: StoreItem
   theme: Theme | undefined
   icons: Record<string, IconSrc> | undefined
}

export type DefaultRenderFn = (param: DefaultRenderFnParam) => VNode

export type ReceiverProps = {
   disabled: boolean
   method: 'unshift' | 'push'
   limit: number
   pauseOnHover: boolean
   position: Position
   id: string
   zIndex: number
   gap: string
   class: string | { [key: string]: boolean } | string[]
   options: Partial<Record<NotificationTypes, Partial<ReceiverOptions>>>
   use: DefaultRenderFn
   animations: Partial<{ enter: string; leave: string; clearAll: string }>
   theme?: Record<`--${string}`, string>
   icons?: Partial<Record<NotificationTypes | 'close', IconSrc>>
}

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

export type ScopedPushStyles = {
   style?: CSSProperties
   class?: string
}

export type DefaultOptions = {
   [K in NotificationTypes]: ReceiverOptions
} & {
   [key: string]: never
}

// Receiver Internal

type InternalData = {
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

export type MergedOptions = Required<ReceiverOptions> & IncomingOptions

export type InternalPushOptions = { id: string; type: NotificationTypes }

// Store

export type StoreItem = InternalData & MergedOptions

export type StoreRefs = {
   items: Ref<StoreItem[]>
   incoming: ShallowRef<IncomingOptions>
   clearAllScheduler: Ref<number>
   push: PushFn
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

export type Store = StoreRefs & StoreFns

// Push - Incoming

export type _PushOptions = Partial<ReceiverOptions & ScopedPushStyles> // To be removed

export type IncomingOptions<T = unknown> = Partial<ReceiverOptions> &
   InternalPushOptions &
   ScopedPushStyles &
   (MaybeRenderStatic<T> | MaybeRenderPromiseResult<T extends Record<string, unknown> ? T : never>)

export type StaticPushOptions<T> = Partial<ReceiverOptions & ScopedPushStyles> &
   MaybeRenderStatic<T>

export type PromiseResultPushOptions<T> = Partial<ReceiverOptions> & MaybeRenderPromiseResult<T>

export type PushStaticParam<T> = StaticPushOptions<T> | ReceiverOptions['message']

export type PushPromiseParam<T> = PromiseResultPushOptions<T> | ReceiverOptions['message']

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

// Push - Returned

export type CtxProps = Omit<InternalPushOptions, 'id'> & {
   duration: ReceiverOptions['duration']
   title: ReceiverOptions['title']
   message: ReceiverOptions['message']
   close: () => void
}

export type PushStatic = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => ClearFns

export type PushPromise = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => {
   resolve: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFns
   reject: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFns
   clear: ClearFns['clear']
   destroy: ClearFns['destroy']
}

export type PushFn = PushStatic & {
   error: PushStatic
   success: PushStatic
   warning: PushStatic
   info: PushStatic
   promise: PushPromise
   clearAll: () => void
   destroyAll: () => void
}

export type ClearFns = { clear: () => void; destroy: () => void }

// CSS

export type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'

// Theme

type ThemeLayoutVars =
   | '--nv-width'
   | '--nv-spacing'
   | '--nv-radius'
   | '--nv-border-width'
   | '--nv-tip-width'
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
