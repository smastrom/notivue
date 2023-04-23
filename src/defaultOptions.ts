import { CLASS_PREFIX as CX, NotificationTypes as NType } from './constants'
import { DefaultOptions } from './types'
import type { ReceiverOptions } from './types'

const success: ReceiverOptions = {
   title: 'Success!',
   message: '',
   icon: true,
   close: true,
   duration: 3000 * 100,
   ariaLive: 'polite',
   ariaRole: 'status',
   closeAriaLabel: 'Close',
}

const error: ReceiverOptions = {
   ...success,
   duration: 6000,
   title: 'Error!',
   ariaLive: 'assertive',
   ariaRole: 'alert',
}

const promise: ReceiverOptions = {
   ...success,
   duration: Infinity,
   title: 'Loading...',
   close: false,
}

const warning: ReceiverOptions = {
   ...error,
   title: 'Warning!',
}

const info: ReceiverOptions = {
   ...success,
   title: 'Info!',
}

export const defaultOptions: DefaultOptions = {
   [NType.SUCCESS]: success,
   [NType.ERROR]: error,
   [NType.WARNING]: warning,
   [NType.INFO]: info,
   [NType.PROMISE]: promise,
   [NType.PROMISE_RESOLVE]: success,
   [NType.PROMISE_REJECT]: error,
} as DefaultOptions

export const defaultAnimations = {
   enter: CX + 'enter',
   leave: CX + 'leave',
   clearAll: CX + 'clearAll',
}
