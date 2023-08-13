export { notivue } from '@/core/notivue'
export {
   usePush,
   useNotivue,
   useNotivue as useNotivueConfig,
   useNotifications,
} from '@/core/useStore'

export { default as Notivue } from '@/Notivue/Notivue.vue'

export { default as NotivueSwipe } from '@/NotivueSwipe/NotivueSwipe.vue'

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

export * from './types'
