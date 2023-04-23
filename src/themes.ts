import type { Theme } from './types'

const layout: Theme = {
   '--nv-width': '375px',
   '--nv-spacing': '0.65rem',
   '--nv-radius': '0.75rem',
   '--nv-tip-width': '0px',
   '--nv-icon-size': '1.5rem',
   '--nv-title-size': '1rem',
   '--nv-message-size': '0.875rem',
   '--nv-close-size': '1.5rem',
}

const shadow = { '--nv-shadow': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }

export const light: Theme = {
   // Layout
   ...layout,
   ...shadow,
   '--nv-border-width': '0px',
   // Global Colors
   '--nv-global-background': '#fff',
   '--nv-global-border': '#dedede',
   '--nv-global-foreground': '#334155',
   // Scoped Colors
   '--nv-success-accent': '#28b780',
   '--nv-error-accent': '#e74c3c',
   '--nv-warning-accent': '#f59e0b',
   '--nv-info-accent': '#3e8eff',
   '--nv-promise-accent': '#64748b',
}

export const pastel: Theme = {
   // Layout
   ...layout,
   '--nv-shadow': '0 0.25rem 0.5rem rgba(0, 0, 40, 0.1)',
   // Success
   '--nv-success-background': '#e9faef',
   '--nv-success-accent': '#059669',
   '--nv-success-foreground': '#065f46',
   // Error
   '--nv-error-background': '#FEEFEF',
   '--nv-error-accent': '#E6523C',
   '--nv-error-foreground': '#E6523C',
   // Warning
   '--nv-warning-background': '#f1f5f9',
   '--nv-warning-accent': '#E79122',
   '--nv-warning-foreground': '#664522',
   // Info
   '--nv-info-background': '#DEF0FA',
   '--nv-info-accent': '#1F70AC',
   '--nv-info-foreground': '#1F70AC',
   // Promise
   '--nv-promise-background': '#f1f5f9',
   '--nv-promise-accent': '#334155',
   '--nv-promise-foreground': '#334155',
}

export const material: Theme = {
   // Layout
   ...layout,
   ...shadow,
   // Global Color
   '--nv-global-accent': '#fff',
   '--nv-global-border': '#dedede',
   '--nv-global-foreground': '#fff',
   // Scoped Colors
   '--nv-success-background': '#209E74',
   '--nv-error-background': '#E6523C',
   '--nv-info-background': '#0B9DE6',
   '--nv-warning-background': '#ffe556',
   '--nv-warning-accent': '#4f5358',
   '--nv-warning-foreground': '#4f5358',
   '--nv-warning-border': '#4f5358',
   '--nv-promise-accent': '#64748b',
   '--nv-promise-background': '#f1f5f9',
   '--nv-promise-foreground': '#334155',
}

export const dark: Theme = {
   // Layout
   ...layout,
   '--nv-border-width': '1px',
   // Global Colors
   '--nv-global-background': '#464646',
   '--nv-global-border': '#696969',
   '--nv-global-foreground': '#D0D0D0',
   // Scoped Colors
   '--nv-success-accent': '#8EF997',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}

export const slate: Theme = {
   // Layout
   ...layout,
   '--nv-border-width': '1px',
   // Global Colors
   '--nv-global-background': '#20252E',
   '--nv-global-border': '#353b45',
   '--nv-global-foreground': '#F7F7F7',
   // Scoped Colors
   '--nv-success-accent': '#34D399',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}
