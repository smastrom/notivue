import type { Component } from 'vue'

import type { NotificationType, NotivueItem } from 'notivue'

export interface NotificationsProps {
   item: NotivueItem
   icons?: NotivueIcons
   theme?: NotivueTheme
   closeAriaLabel?: string
   hideClose?: boolean
}

export type NotivueIcons = Partial<
   Record<NotificationType | 'close', Component | string | null | undefined>
>

export type ThemeNames = 'lightTheme' | 'pastelTheme' | 'materialTheme' | 'darkTheme' | 'slateTheme'

export type NotivueTheme = Partial<Record<ThemeVars, string>>

type ThemeLayoutVars =
   | '--nv-width'
   | '--nv-min-width'
   | '--nv-spacing'
   | '--nv-radius'
   | '--nv-border-width'
   | '--nv-icon-size'
   | '--nv-title-size'
   | '--nv-message-size'
   | '--nv-shadow'
   | '--nv-tip-width'
   | '--nv-y-align'

type ThemeGlobalColorsVars =
   | '--nv-global-bg'
   | '--nv-global-fg'
   | '--nv-global-accent'
   | '--nv-global-border'

type SuccessColorsVars =
   | '--nv-success-fg'
   | '--nv-success-bg'
   | '--nv-success-border'
   | '--nv-success-accent'

type ErrorColorsVars = '--nv-error-fg' | '--nv-error-bg' | '--nv-error-border' | '--nv-error-accent'

type WarningColorsVars =
   | '--nv-warning-fg'
   | '--nv-warning-bg'
   | '--nv-warning-border'
   | '--nv-warning-accent'

type InfoColorsVars = '--nv-info-fg' | '--nv-info-bg' | '--nv-info-border' | '--nv-info-accent'

type PromiseColorsVars =
   | '--nv-promise-fg'
   | '--nv-promise-bg'
   | '--nv-promise-border'
   | '--nv-promise-accent'

type ThemeVars =
   | ThemeLayoutVars
   | ThemeGlobalColorsVars
   | SuccessColorsVars
   | ErrorColorsVars
   | WarningColorsVars
   | InfoColorsVars
   | PromiseColorsVars
