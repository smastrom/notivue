import { NotificationTypeKeys as NKeys } from './constants'

import type {
   Obj,
   NotificationOptions,
   UserPushOptionsWithInternals,
   NotificationOptionsField,
} from '@/types'

export const success: NotificationOptions = {
   title: '',
   message: '',
   duration: 6000,
   ariaLive: 'polite',
   ariaRole: 'status',
   closeAriaLabel: 'Close',
}

const error: NotificationOptions = {
   ...success,
   ariaLive: 'assertive',
   ariaRole: 'alert',
}

const promise: NotificationOptions = {
   ...success,
   duration: Infinity,
}

const warning: NotificationOptions = {
   ...error,
   ariaLive: 'polite',
}

const info: NotificationOptions = {
   ...success,
}

export const defaultNotificationOptions = {
   global: {},
   [NKeys.SUCCESS]: success,
   [NKeys.ERROR]: error,
   [NKeys.WARNING]: warning,
   [NKeys.INFO]: info,
   [NKeys.PROMISE]: promise,
   [NKeys.PROMISE_RESOLVE]: success,
   [NKeys.PROMISE_REJECT]: error,
} as NotificationOptionsField

export function mergeNotificationOptions<T extends Obj = Obj>(
   optionsFromConfig: NotificationOptionsField,
   optionsFromPush: UserPushOptionsWithInternals<T>
) {
   if (!optionsFromPush.props) {
      optionsFromPush.props = {} as T
   }

   return {
      ...(optionsFromConfig[optionsFromPush.type] ?? optionsFromConfig.success),
      ...optionsFromConfig.global,
      ...optionsFromPush,
   }
}
