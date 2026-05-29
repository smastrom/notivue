import { NotificationType as NTypeU, NotivueConfigRequired } from 'notivue'

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

export const DEFAULT_NOTIFICATION_OPTIONS = {
   global: {
      title: '',
      message: '',
      duration: DEFAULT_DURATION,
      ariaLive: 'polite',
      ariaRole: 'status',
   },
   [NotificationTypeKeys.SUCCESS]: {},
   [NotificationTypeKeys.ERROR]: { ariaLive: 'assertive', ariaRole: 'alert' },
   [NotificationTypeKeys.WARNING]: { ariaLive: 'assertive', ariaRole: 'alert' },
   [NotificationTypeKeys.INFO]: {},
   [NotificationTypeKeys.LOADING]: {},
   [NotificationTypeKeys.LOADING_SUCCESS]: {},
   [NotificationTypeKeys.LOADING_ERROR]: { ariaLive: 'assertive', ariaRole: 'alert' },
   [NotificationTypeKeys.PROMISE]: {},
   [NotificationTypeKeys.PROMISE_RESOLVE]: {},
   [NotificationTypeKeys.PROMISE_REJECT]: {},
} as NotivueConfigRequired['notifications']

export const MOTION_VARS = {
   enterAnimation: '--nv-enter-animation',
   leaveAnimation: '--nv-leave-animation',
   clearAllAnimation: '--nv-clear-all-animation',
   transformTransition: '--nv-transform-transition',
} as const

export const DEFAULT_TRANSFORM_TRANSITION = 'transform 0.35s cubic-bezier(0.5, 1, 0.25, 1)'

export const MOTION_VARS_CSS = {
   enterAnimation: `var(${MOTION_VARS.enterAnimation})`,
   leaveAnimation: `var(${MOTION_VARS.leaveAnimation})`,
   clearAllAnimation: `var(${MOTION_VARS.clearAllAnimation})`,
   transformTransition: `var(${MOTION_VARS.transformTransition}, ${DEFAULT_TRANSFORM_TRANSITION})`,
} as const

export const DEFAULT_CONFIG: NotivueConfigRequired = {
   pauseOnHover: true,
   pauseOnTouch: true,
   pauseOnTabChange: true,
   enqueue: false,
   position: 'top-center',
   teleportTo: 'body',
   notifications: DEFAULT_NOTIFICATION_OPTIONS,
   limit: -1,
   avoidDuplicates: false,
}
