import { CLASS_PREFIX as CX, NotificationTypes as NType } from './constants'
import { DefaultOptions } from './types'
import type { ReceiverOptions } from './types'

const success: ReceiverOptions = {
   title: 'Success',
   message: '',
   icon: true,
   close: true,
   duration: 4000 * 1000,
   ariaLive: 'polite',
   ariaRole: 'status',
   closeAriaLabel: 'Close',
}

const error: ReceiverOptions = {
   ...success,
   duration: 6000,
   title: 'Error',
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
   duration: 6000,
   title: 'Warning',
}

const info: ReceiverOptions = {
   ...success,
   title: 'Info',
}

export const options: DefaultOptions = {
   [NType.SUCCESS]: success,
   [NType.ERROR]: error,
   [NType.WARNING]: warning,
   [NType.INFO]: info,
   [NType.PROMISE]: promise,
   [NType.PROMISE_RESOLVE]: success,
   [NType.PROMISE_REJECT]: error,
} as DefaultOptions
