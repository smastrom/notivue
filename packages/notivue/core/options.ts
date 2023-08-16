import { DEFAULT_DURATION, NotificationTypeKeys as NKeys } from './constants'

import type {
   Obj,
   NotificationOptions,
   PushOptionsWithInternals,
   NotivueConfigRequired,
} from 'notivue'

export const success: NotificationOptions = {
   title: '',
   message: '',
   duration: DEFAULT_DURATION,
   ariaLive: 'polite',
   ariaRole: 'status',
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
   [NKeys.SUCCESS]: success,
   [NKeys.ERROR]: error,
   [NKeys.WARNING]: warning,
   [NKeys.INFO]: info,
   [NKeys.PROMISE]: promise,
   [NKeys.PROMISE_RESOLVE]: success,
   [NKeys.PROMISE_REJECT]: error,
} as NotivueConfigRequired['notifications']

export function mergeNotificationOptions<T extends Obj = Obj>(
   mergedConfigOptions: NotivueConfigRequired['notifications'],
   optionsFromPush: PushOptionsWithInternals<T>
) {
   if (!optionsFromPush.props) {
      optionsFromPush.props = {} as T
   }

   return {
      ...(mergedConfigOptions[optionsFromPush.type] ?? mergedConfigOptions.success),
      ...mergedConfigOptions.global,
      ...optionsFromPush,
   }
}
