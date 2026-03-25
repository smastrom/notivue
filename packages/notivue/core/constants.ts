import { NotificationType as NTypeU, NotivueConfigRequired, NotificationOptions } from 'notivue'

export const CLASS_PREFIX = 'Notivue__'

export const DEFAULT_DURATION = 6000

/**
 * Canonical string literals for `NotificationType`. `LOADING*` is canonical; `PROMISE*` are deprecated aliases (normalized at runtime).
 */
export const NotificationTypeKeys = {
   SUCCESS: 'success',
   ERROR: 'error',
   WARNING: 'warning',
   INFO: 'info',
   LOADING: 'loading',
   LOADING_SUCCESS: 'loading-success',
   LOADING_ERROR: 'loading-error',
   /** @deprecated Deprecated alias of `LOADING`. */
   PROMISE: 'promise',
   /** @deprecated Deprecated alias of `LOADING_SUCCESS`. */
   PROMISE_RESOLVE: 'promise-resolve',
   /** @deprecated Deprecated alias of `LOADING_ERROR`. */
   PROMISE_REJECT: 'promise-reject',
} as const satisfies Record<string, NTypeU>

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

const loadingPending: NotificationOptions = {
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
   [NotificationTypeKeys.LOADING]: loadingPending,
   [NotificationTypeKeys.LOADING_SUCCESS]: success,
   [NotificationTypeKeys.LOADING_ERROR]: error,
   [NotificationTypeKeys.PROMISE]: loadingPending,
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
   transition: 'transform 0.35s cubic-bezier(0.5, 1, 0.25, 1)',
   animations: {
      enter: CLASS_PREFIX + 'enter',
      leave: CLASS_PREFIX + 'leave',
      clearAll: CLASS_PREFIX + 'clearAll',
   },
}
