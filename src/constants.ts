import { NotificationType as NTypeU } from './types'

export const FIXED_INCREMENT = 800

export const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const COMPONENT_NAME = 'Notivue'

export const CLASS_PREFIX = COMPONENT_NAME + '__'

export const NotificationType: Record<string, NTypeU> = {
   SUCCESS: 'success',
   ERROR: 'error',
   WARNING: 'warning',
   INFO: 'info',
   PROMISE: 'promise',
   PROMISE_RESOLVE: 'promise-resolve',
   PROMISE_REJECT: 'promise-reject',
}

export const Classes = {
   NOTIFICATION: CLASS_PREFIX + 'notification',
   ICON: CLASS_PREFIX + 'icon',
   CONTENT: CLASS_PREFIX + 'content',
   TITLE: CLASS_PREFIX + 'content-title',
   MESSAGE: CLASS_PREFIX + 'content-message',
   CLOSE: CLASS_PREFIX + 'close',
   CLOSE_ICON: CLASS_PREFIX + 'close-icon',
}

export enum TransitionTypes {
   PUSH,
   HEIGHT,
   SILENT,
}
