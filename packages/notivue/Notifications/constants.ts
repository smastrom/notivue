import { CLASS_PREFIX as CX } from '@/core/constants'
import { filledIcons } from './icons'
import { lightTheme } from './themes'

export const Classes = {
   NOTIFICATION: CX + 'notification',
   ICON: CX + 'icon',
   CONTENT: CX + 'content',
   TITLE: CX + 'content-title',
   MESSAGE: CX + 'content-message',
   CLOSE: CX + 'close',
   CLOSE_ICON: CX + 'close-icon',
}

export const DEFAULT_NOTIFICATIONS_PROPS = {
   icons: () => filledIcons,
   theme: () => lightTheme,
   hideClose: false,
   closeAriaLabel: 'Close',
} as const
