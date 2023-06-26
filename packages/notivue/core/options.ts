import { NotificationType as NType } from './constants'

import type {
   Obj,
   NotificationOptions,
   NotificationType,
   UserPushOptionsWithInternals,
} from '@/types'

export const success: NotificationOptions = {
   title: '',
   message: '',
   duration: 4000,
   icon: true,
   close: true,
   ariaLive: 'polite',
   ariaRole: 'status',
   closeAriaLabel: 'Close',
   class: '',
}

const error: NotificationOptions = {
   ...success,
   duration: 6000,
   ariaLive: 'assertive',
   ariaRole: 'alert',
}

const promise: NotificationOptions = {
   ...success,
   duration: Infinity,
   close: false,
}

const warning: NotificationOptions = {
   ...error,
   ariaLive: 'polite',
}

const info: NotificationOptions = {
   ...success,
}

export const defaultNotificationOptions = {
   [NType.SUCCESS]: success,
   [NType.ERROR]: error,
   [NType.WARNING]: warning,
   [NType.INFO]: info,
   [NType.PROMISE]: promise,
   [NType.PROMISE_RESOLVE]: success,
   [NType.PROMISE_REJECT]: error,
} as Record<NotificationType, NotificationOptions>

export function mergeNotificationOptions<T extends Obj = Obj>(
   optionsFromConfig: Record<string, NotificationOptions>,
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
