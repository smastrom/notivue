import type { InjectionKey } from 'vue'
import type { NotivueKeyboardData } from 'notivue'

export const keyboardInjectionKey = Symbol('') as InjectionKey<NotivueKeyboardData>

export const focusableEls =
   'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'

export const DEFAULT_PROPS = {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage: "You're leaving the notifications stream. Press Control + N to navigate it again.",
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: true,
   maxAnnouncements: 2,
} as const
