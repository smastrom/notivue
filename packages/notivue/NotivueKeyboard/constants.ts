export const focusableEls =
   'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'

export const DEFAULT_PROPS = {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage:
      'You left the notifications stream. Press Tab or Control + N to navigate it again.',
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: true,
   maxAnnouncements: 2,
} as const
