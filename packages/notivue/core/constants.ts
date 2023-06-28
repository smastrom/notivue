import { NotificationType as NTypeU } from '@/types'

export const FIXED_TIMEOUT_INCREMENT = 800

export const CLASS_PREFIX = 'Notivue__'

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
