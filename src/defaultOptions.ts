import { markRaw } from 'vue'
import { NType } from './constants'
import { icons } from './icons'
import type { ReceiverOptions } from './types'

export const success: ReceiverOptions = {
   title: 'Success!',
   message: '',
   icon: markRaw(icons.success),
   close: true,
   duration: 4000 * 1000,
   ariaLive: 'polite',
   ariaRole: 'status',
}

const error: ReceiverOptions = {
   ...success,
   icon: markRaw(icons.error),
   duration: 6000,
   title: 'Error!',
   ariaLive: 'assertive',
   ariaRole: 'alert',
}

const promise: ReceiverOptions = {
   ...success,
   icon: markRaw(icons.promise),
   title: 'Loading...',
   close: false,
}

const warning: ReceiverOptions = {
   ...error,
   icon: markRaw(icons.warning),
   title: 'Warning!',
}

const info: ReceiverOptions = {
   ...success,
   icon: markRaw(icons.info),
   title: 'Info!',
}

export const defaultOptions: Record<`${NType}`, ReceiverOptions> = {
   [NType.SUCCESS]: success,
   [NType.ERROR]: error,
   [NType.WARNING]: warning,
   [NType.INFO]: info,
   [NType.PROMISE]: promise,
   [NType.PROMISE_RESOLVE]: success,
   [NType.PROMISE_REJECT]: error,
}
