import type { VNode, Component, Raw, CSSProperties, Ref, ShallowRef } from 'vue'
import { NType } from './constants'

export type PluginOptions = {
   additionalReceivers?: string[]
}

// Receiver Props

export type ReceiverProps = {
   disabled: boolean
   method: 'unshift' | 'push'
   limit: number
   pauseOnHover: boolean
   position: Position
   maxWidth: number
   id: string
   rootPadding: number[]
   gap: number
   options: Partial<Record<`${NType}`, Partial<ReceiverOptions>>>
   theme: Record<`--${string}`, string>
   animations: Partial<Animations>
}

type Animations = {
   enter: string
   leave: string
   clearAll: string
}

export type ReceiverOptions = {
   icon: Raw<Component> | false
   title: string | false
   message: string | false
   close: boolean
   duration: number
   ariaLive: 'polite' | 'assertive'
   ariaRole: 'alert' | 'status'
}

// Receiver Internal

type InternalData = {
   timeoutId: number | undefined
   createdAt: number
   clear: () => void
   elapsed?: number
   stoppedAt?: number
   style?: CSSProperties
   animClass?: string
   onAnimationstart?: (event: AnimationEvent) => void
   onAnimationend?: (event: AnimationEvent) => void
   customRenderFn?: () => VNode
   prevProps?: CtxProps & Record<string, unknown>
   prevComponent?: Raw<Component>
}

export type MergedOptions = Required<ReceiverOptions> & IncomingOptions

export type InternalPushOptions = { id: string; type: `${NType}` }

// Store

export type StoreItem = InternalData & MergedOptions

export type StoreRefs = {
   items: Ref<StoreItem[]>
   incoming: ShallowRef<IncomingOptions>
   clearTrigger: Ref<boolean>
}

export type StoreFunctions = {
   createPush: () => PushFn
   createItem: (options: StoreItem) => void
   getItem: (id: string) => StoreItem | undefined
   updateItem: (id: string, options: Partial<StoreItem>) => void
   removeItem: (id: string) => void
   destroyAll: () => void
   updateAll: (onUpdate: (item: StoreItem) => StoreItem) => void
   animateItem: (id: string, className: string, onEnd: () => void) => void
   resetClearTrigger: () => void
}

export type Store = StoreRefs & StoreFunctions

// Push - Incoming

export type _PushOptions = Partial<ReceiverOptions>

export type IncomingOptions<T = unknown> = Partial<ReceiverOptions> &
   InternalPushOptions &
   (MaybeRenderStatic<T> | MaybeRenderPromiseResult<T extends Record<string, unknown> ? T : never>)

export type StaticPushOptions<T> = Partial<ReceiverOptions> & MaybeRenderStatic<T>

export type MaybeRenderStatic<T> = {
   render?: {
      component?: Raw<Component>
      props?: (props: { notifyProps: CtxProps }) => Partial<CtxProps & T>
   }
}

export type PromiseResultPushOptions<T> = Partial<ReceiverOptions> & MaybeRenderPromiseResult<T>

export type MaybeRenderPromiseResult<T = {}> = {
   render?: {
      component?: Raw<Component>
      props?: (props: {
         notifyProps: CtxProps
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
   options: StaticPushOptions<T>
) => ClearFn

export type PushPromise = <T extends Record<string, unknown>>(
   options: StaticPushOptions<T>
) => {
   resolve: (options: PromiseResultPushOptions<T>) => ClearFn
   reject: (options: PromiseResultPushOptions<T>) => ClearFn
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

type Vars =
   | '--VNWidth'
   | '--VNBackground'
   | '--VNBorder'
   | '--VNBorderRadius'
   | '--VNBoxShadow'
   | '--VNTitleColor'
   | '--VNMessageColor'
   | '--VNSuccessColor'
   | '--VNSuccessBackground'
   | '--VNErrorColor'
   | '--VNErrorBackground'
   | '--VNWarningColor'
   | '--VNWarningBackground'
   | '--VNInfoColor'
   | '--VNInfoBackground'
   | '--VNPromiseColor'
   | '--VNPromiseBackground'
   | '--VNCloseColor'

export type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'

export type Theme = Record<Vars, string>
