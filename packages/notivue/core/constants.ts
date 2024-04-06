import { NotificationType as NTypeU, NotivueConfigRequired, NotificationOptions } from 'notivue'

export const CLASS_PREFIX = 'Notivue__'

export const DEFAULT_DURATION = 6000

export const NotificationTypeKeys: Record<string, NTypeU> = {
   SUCCESS: 'success',
   ERROR: 'error',
   WARNING: 'warning',
   INFO: 'info',
   PROMISE: 'promise',
   PROMISE_RESOLVE: 'promise-resolve',
   PROMISE_REJECT: 'promise-reject',
}

const success: NotificationOptions = {
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

export const DEFAULT_NOTIFICATION_OPTIONS = {
   [NotificationTypeKeys.SUCCESS]: success,
   [NotificationTypeKeys.ERROR]: error,
   [NotificationTypeKeys.WARNING]: warning,
   [NotificationTypeKeys.INFO]: info,
   [NotificationTypeKeys.PROMISE]: promise,
   [NotificationTypeKeys.PROMISE_RESOLVE]: success,
   [NotificationTypeKeys.PROMISE_REJECT]: error,
} as NotivueConfigRequired['notifications']

export const DEFAULT_CONFIG: NotivueConfigRequired = {
   pauseOnHover: true,
   pauseOnTouch: true,
   pauseOnTabChange: true,
   enqueue: false,
   position: 'top-center',
   teleportTo: 'body',
   notifications: DEFAULT_NOTIFICATION_OPTIONS,
   limit: Infinity,
   avoidDuplicates: false,
   animations: {
      enter: CLASS_PREFIX + 'enter',
      leave: CLASS_PREFIX + 'leave',
      clearAll: CLASS_PREFIX + 'clearAll',
   },
}
