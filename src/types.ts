import type { VNode, Ref, Component, Raw, CSSProperties } from 'vue'
import { NType } from './constants'

export type PluginOptions = {
   additionalReceivers?: string[]
}

export type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'

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

export type InternalPushOptions = {
   id: string
   type: `${NType}`
}

export type UserOptions<T = NotifyProps> = Partial<ReceiverOptions> & MaybeRender<T>

export type MergedOptions<T = NotifyProps> = ReceiverOptions & InternalPushOptions & MaybeRender<T>

type AnimationHandler = ((event: AnimationEvent) => void) | undefined

export type Notification = InternalPushOptions &
   ReceiverOptions & {
      timeoutId: number | undefined
      id: string
      createdAt: number
      stoppedAt: number
      elapsed: number
      clear: () => void
      style: CSSProperties
      animClass: string | undefined
      onAnimationstart: AnimationHandler
      onAnimationend: AnimationHandler
      props: Record<string, any>
      component?: Component
      h?: () => VNode
   }

type MaybeRender<T> = {
   render?: {
      component?: Raw<Component>
      props?: (props: T) => Record<string, any>
   }
}

export type Receiver = {
   items: Notification[]
   incoming: Ref<UserOptions & InternalPushOptions>
   runClear: Ref<boolean>
   push: () => PushFn
}

type NotifyProps = {
   notifyProps: {
      type: InternalPushOptions['type']
      close: () => void
      title?: ReceiverOptions['title']
      message?: ReceiverOptions['message']
   }
}

type WithPrevProps = Partial<
   UserOptions<NotifyProps & { prevProps?: Record<string, any> | undefined }>
>

export type PushFn = {
   (options: Partial<UserOptions>): ClearFns
   promise: (options: Partial<UserOptions>) => {
      resolve: (options: WithPrevProps) => void
      reject: (options: WithPrevProps) => void
      clear: ClearFns['clear']
      clearAll: ClearFns['clearAll']
      destroyAll: ClearFns['destroyAll']
   }
   error: (options: Partial<UserOptions>) => ClearFns
   success: (options: Partial<UserOptions>) => ClearFns
   warning: (options: Partial<UserOptions>) => ClearFns
   info: (options: Partial<UserOptions>) => ClearFns
   clearAll: ClearFns['clearAll']
   destroyAll: ClearFns['destroyAll']
}

export type ClearFns = { clear: () => void; clearAll: () => void; destroyAll: () => void }

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

export type Theme = Record<Vars, string>
