export const focusableEls =
   'a[href]:not([tabindex="-1"]), area[href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]'

export const DEFAULT_PROPS = {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage:
      'You left the notifications stream. Press Tab or Control + N to navigate it again.',
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: false,
   maxAnnouncements: 2,
} as const
