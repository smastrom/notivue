export const DEFAULT_PROPS = {
   touchOnly: false,
   exclude: 'a, button',
   disabled: false,
   threshold: 0.5,
} as const

export const RETURN_DUR = 300

export const DEBOUNCE = {
   Mouse: 200,
   Touch: 800,
   TouchExternal: 1200,
}
