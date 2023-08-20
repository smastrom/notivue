import type { NotivueTheme } from 'notivue'

const layout: NotivueTheme = {
   '--nv-width': '360px',
   '--nv-spacing': '0.625rem',
   '--nv-radius': '0.625rem',
   '--nv-icon-size': '1.25rem',
   '--nv-title-size': '1rem',
   '--nv-message-size': '1rem',
   '--nv-tip-width': '0px',
   '--nv-y-align': 'center',
}

const shadow = {
   '--nv-shadow': 'rgba(0, 0, 0, 0.08) 0px 4px 6px -1px, rgba(0, 0, 0, 0.04) 0px 2px 4px -1px',
}

export const lightTheme: NotivueTheme = {
   ...layout,
   ...shadow,
   // Global
   '--nv-global-bg': '#FFF',
   '--nv-global-fg': '#171717',
   // Scoped
   '--nv-success-accent': '#28B780',
   '--nv-error-accent': '#E74C3C',
   '--nv-warning-accent': '#F59E0B',
   '--nv-info-accent': '#3E8EFF',
   '--nv-promise-accent': '#171717',
}

export const pastelTheme: NotivueTheme = {
   // Layout
   ...layout,
   ...shadow,
   // Success
   '--nv-success-bg': '#E9FAEF',
   '--nv-success-accent': '#059669',
   '--nv-success-fg': '#057452',
   // Error
   '--nv-error-bg': '#FEEFEF',
   '--nv-error-accent': '#E6523C',
   '--nv-error-fg': '#C5412C',
   // Warning
   '--nv-warning-bg': '#FFF0D8',
   '--nv-warning-accent': '#F48533',
   '--nv-warning-fg': '#81471D',
   // Info
   '--nv-info-bg': '#DEF0FA',
   '--nv-info-accent': '#1F70AC',
   '--nv-info-fg': '#1F70AC',
   // Promise
   '--nv-promise-bg': '#FFF',
   '--nv-promise-accent': '#334155',
   '--nv-promise-fg': '#334155',
}

export const materialTheme: NotivueTheme = {
   ...layout,
   ...shadow,
   // Global
   '--nv-global-accent': '#FFF',
   '--nv-global-fg': '#e7e7e7',
   // Scoped
   '--nv-success-bg': '#178570',
   '--nv-error-bg': '#C94430',
   '--nv-info-bg': '#117AAE',
   '--nv-warning-bg': '#FFE556',
   '--nv-warning-accent': '#4F5358',
   '--nv-warning-fg': '#4F5358',
   '--nv-warning-border': '#4F5358',
   '--nv-promise-accent': '#64748B',
   '--nv-promise-bg': '#FFF',
   '--nv-promise-fg': '#334155',
}

export const darkTheme: NotivueTheme = {
   ...layout,
   '--nv-border-width': '1px',
   // Global
   '--nv-global-bg': '#1F1F1F',
   '--nv-global-border': '#414141',
   '--nv-global-fg': '#D0D0D0',
   // Scoped
   '--nv-success-accent': '#8EF997',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}

export const slateTheme: NotivueTheme = {
   ...layout,
   '--nv-border-width': '1px',
   // Global
   '--nv-global-bg': '#20252E',
   '--nv-global-border': '#353b45',
   '--nv-global-fg': '#F7F7F7',
   // Scoped
   '--nv-success-accent': '#34D399',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}
