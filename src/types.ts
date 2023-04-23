import type { VNode, Component, CSSProperties, Ref, ShallowRef } from 'vue'

export type PluginOptions = {
   additionalReceivers?: string[]
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
   class: string
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
) => ClearFn

export type PushPromise = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T> | ReceiverOptions['message']
) => {
   resolve: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFn
   reject: (options: PromiseResultPushOptions<T> | ReceiverOptions['message']) => ClearFn
   clear: ClearFn['clear']
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

export type ClearFn = { clear: () => void }

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
   | '--ny-width'
   | '--ny-spacing'
   | '--ny-radius'
   | '--ny-y-align'
   | '--ny-border-width'
   | '--ny-tip-width'
   | '--ny-icon-size'
   | '--ny-title-size'
   | '--ny-message-size'
   | '--ny-close-size'
   | '--ny-shadow'

type ThemeGlobalColorsVars =
   | '--ny-global-background'
   | '--ny-global-foreground'
   | '--ny-global-accent'
   | '--ny-global-border'

type SuccessColorsVars =
   | '--ny-success-foreground'
   | '--ny-success-background'
   | '--ny-success-border'
   | '--ny-success-accent'

type ErrorColorsVars =
   | '--ny-error-foreground'
   | '--ny-error-background'
   | '--ny-error-border'
   | '--ny-error-accent'

type WarningColorsVars =
   | '--ny-warning-foreground'
   | '--ny-warning-background'
   | '--ny-warning-border'
   | '--ny-warning-accent'

type InfoColorsVars =
   | '--ny-info-foreground'
   | '--ny-info-background'
   | '--ny-info-border'
   | '--ny-info-accent'

type PromiseColorsVars =
   | '--ny-promise-foreground'
   | '--ny-promise-background'
   | '--ny-promise-border'
   | '--ny-promise-accent'

type ThemeVars =
   | ThemeLayoutVars
   | ThemeGlobalColorsVars
   | SuccessColorsVars
   | ErrorColorsVars
   | WarningColorsVars
   | InfoColorsVars
   | PromiseColorsVars

export type Theme = Partial<Record<ThemeVars, string>>
