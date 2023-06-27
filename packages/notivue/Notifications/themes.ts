import type { NotivueTheme } from '@/types'

const layout: NotivueTheme = {
   '--nv-width': '360px',
   '--nv-spacing': '0.65rem',
   '--nv-radius': '0.5rem',
   '--nv-icon-size': '1.25rem',
   '--nv-title-size': '0.925rem',
   '--nv-message-size': '0.875rem',
   '--nv-tip-width': '0px',
   '--nv-y-align': 'center',
}

const shadow = { '--nv-shadow': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }

export const lightTheme: NotivueTheme = {
   ...layout,
   ...shadow,
   '--nv-border-width': '0',
   // Global
   '--nv-global-bg': '#FFF',
   '--nv-global-border': '#DEDEDE',
   '--nv-global-fg': '#334155',
   // Scoped
   '--nv-success-accent': '#28B780',
   '--nv-error-accent': '#E74C3C',
   '--nv-warning-accent': '#F59E0B',
   '--nv-info-accent': '#3E8EFF',
   '--nv-promise-accent': '#64748B',
}

export const pastelTheme: NotivueTheme = {
   // Layout
   ...layout,
   '--nv-shadow': '0 0.25rem 0.5rem rgba(0, 0, 40, 0.1)',
   // Success
   '--nv-success-bg': '#E9FAEF',
   '--nv-success-accent': '#059669',
   '--nv-success-fg': '#065F46',
   // Error
   '--nv-error-bg': '#FEEFEF',
   '--nv-error-accent': '#E6523C',
   '--nv-error-fg': '#E6523C',
   // Warning
   '--nv-warning-bg': '#FFF0D8',
   '--nv-warning-accent': '#F48533',
   '--nv-warning-fg': '#81471D',
   // Info
   '--nv-info-bg': '#DEF0FA',
   '--nv-info-accent': '#1F70AC',
   '--nv-info-fg': '#1F70AC',
   // Promise
   '--nv-promise-bg': '#F1F5F9',
   '--nv-promise-accent': '#334155',
   '--nv-promise-fg': '#334155',
}

export const materialTheme: NotivueTheme = {
   ...layout,
   ...shadow,
   // Global
   '--nv-global-accent': '#FFF',
   '--nv-global-border': '#DEDEDE',
   '--nv-global-fg': '#FFF',
   // Scoped
   '--nv-success-bg': '#209E74',
   '--nv-error-bg': '#E6523C',
   '--nv-info-bg': '#0B9DE6',
   '--nv-warning-bg': '#FFE556',
   '--nv-warning-accent': '#4F5358',
   '--nv-warning-fg': '#4F5358',
   '--nv-warning-border': '#4F5358',
   '--nv-promise-accent': '#64748B',
   '--nv-promise-bg': '#f1F5F9',
   '--nv-promise-fg': '#334155',
}

export const darkTheme: NotivueTheme = {
   ...layout,
   '--nv-border-width': '1px',
   // Global
   '--nv-global-bg': '#464646',
   '--nv-global-border': '#696969',
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
