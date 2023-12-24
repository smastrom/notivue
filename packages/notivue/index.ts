export { createNotivue } from '@/core/createNotivue'

export { usePush, useNotivue, useNotifications } from '@/core/useStore'

export { default as Notivue } from '@/Notivue/Notivue.vue'
export { default as NotivueAstro } from './astro/Notivue.vue'

export { default as NotivueSwipe } from '@/NotivueSwipe/NotivueSwipe.vue'

export { push } from '@/core/createPush'
export { push as pushAstro } from './astro/push'

export { default as NotivueKeyboard } from '@/NotivueKeyboard/NotivueKeyboard.vue'
export { useNotivueKeyboard } from '@/NotivueKeyboard/useNotivueKeyboard'

export { default as Notifications } from '@/Notifications/Notifications.vue'
export {
   lightTheme,
   pastelTheme,
   materialTheme,
   darkTheme,
   slateTheme,
} from '@/Notifications/themes'
export { filledIcons, outlinedIcons } from '@/Notifications/icons'

export { DEFAULT_CONFIG } from '@/core/constants'

export * from './core/types'
export * from './Notivue/types'
export * from './NotivueSwipe/types'
export * from './NotivueKeyboard/types'
export * from './Notifications/types'
export * from './astro/types'
