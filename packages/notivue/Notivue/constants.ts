export const DEFAULT_PROPS = {
   listAriaLabel: 'Notifications',
} as const

export const DEFAULT_IMPL_PROPS = {
   ...DEFAULT_PROPS,
   teleportTo: null,
} as const
