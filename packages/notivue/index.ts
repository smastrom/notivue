export { notify, push } from '@/core/createNotify'
export { notify as notifyAstro, push as pushAstro } from './astro/push'

export { updateConfig } from '@/core/createStore'
export { createNotivue } from '@/core/createNotivue'
export { createNotivue as createNotivueAstro } from './astro/createNotivue'

export { startInstance, stopInstance } from '@/core/createInstance'

export { useNotivue, useNotifications, useNotivueInstance } from '@/core/useStore'

/** @deprecated Import `notify` from `notivue` instead of `useNotify()` or `usePush()`. */
export { useNotify, usePush } from '@/core/useStore'
export { useNotivueKeyboard } from '@/NotivueKeyboard/useNotivueKeyboard'

export { default as Notivue } from '@/Notivue/Notivue.vue'
export { default as NotivueAstro } from './astro/Notivue.vue'
export { default as NotivueSwipe } from '@/NotivueSwipe/NotivueSwipe.vue'
/** @deprecated Use `NotivueSwipe`. */
export { default as NotificationSwipe } from '@/NotivueSwipe/NotivueSwipe.vue'
export { default as NotivueKeyboard } from '@/NotivueKeyboard/NotivueKeyboard.vue'

export { default as Notifications } from '@/Notifications/Notification.vue'
export { default as Notification } from '@/Notifications/Notification.vue'
export { default as NotificationProgress } from '@/Notifications/NotificationProgress.vue'
export { default as NotificationsProgress } from '@/Notifications/NotificationProgress.vue'

export {
   lightTheme,
   pastelTheme,
   materialTheme,
   darkTheme,
   slateTheme,
} from '@/Notifications/themes'

export { filledIcons, outlinedIcons } from '@/Notifications/icons'

export { DEFAULT_CONFIG } from '@/core/constants'
export { toCanonicalNotificationType } from '@/core/utils'

export * from '@/core/types'
export * from '@/Notivue/types'
export * from '@/NotivueSwipe/types'
export * from '@/NotivueKeyboard/types'
export * from '@/Notifications/types'
export * from './astro/types'
