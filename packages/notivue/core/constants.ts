import { NotificationType as NTypeU } from 'notivue'

export const FIXED_TIMEOUT_INCREMENT = 1200

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

export enum TransitionType {
   PUSH,
   HEIGHT,
   SILENT,
}
