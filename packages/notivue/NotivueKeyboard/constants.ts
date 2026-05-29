export const focusableEls =
   'a[href]:not([tabindex^="-"]), area[href]:not([tabindex^="-"]), input:not([disabled]):not([tabindex^="-"]), select:not([disabled]):not([tabindex^="-"]), textarea:not([disabled]):not([tabindex^="-"]), button:not([disabled]):not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])'

export const DEFAULT_PROPS = {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage:
      'You left the notifications stream. Press Tab or Control + N to navigate it again.',
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: false,
   maxAnnouncements: 2,
} as const
