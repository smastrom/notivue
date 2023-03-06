export const NOTIFICATIONS_LIMIT = 10

export const FIXED_INCREMENT = 250

export const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const COMPONENT_NAME = 'Notsy'

export const CLASS_PREFIX = COMPONENT_NAME + '__'

export enum NType {
   SUCCESS = 'success',
   ERROR = 'error',
   WARNING = 'warning',
   INFO = 'info',
   PROMISE = 'promise',
   PROMISE_RESOLVE = 'promise-resolve',
   PROMISE_REJECT = 'promise-reject',
}

export enum TType {
   PUSH,
   HEIGHT,
   SILENT,
}
