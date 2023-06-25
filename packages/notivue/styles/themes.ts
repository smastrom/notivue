import type { Theme } from '../types'

const layout: Theme = {
   '--nv-width': '360px',
   '--nv-spacing': '0.65rem',
   '--nv-radius': '0.5rem',
   '--nv-icon-size': '1.5rem',
   '--nv-title-size': '0.925rem',
   '--nv-message-size': '0.875rem',
   '--nv-close-size': '1.5rem',
}

const shadow = { '--nv-shadow': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }

export const light: Theme = {
   ...layout,
   ...shadow,
   '--nv-border-width': '0px',
   // Global
   '--nv-global-background': '#FFF',
   '--nv-global-border': '#DEDEDE',
   '--nv-global-foreground': '#334155',
   // Scoped
   '--nv-success-accent': '#28B780',
   '--nv-error-accent': '#E74C3C',
   '--nv-warning-accent': '#F59E0B',
   '--nv-info-accent': '#3E8EFF',
   '--nv-promise-accent': '#64748B',
}

export const pastel: Theme = {
   // Layout
   ...layout,
   '--nv-shadow': '0 0.25rem 0.5rem rgba(0, 0, 40, 0.1)',
   // Success
   '--nv-success-background': '#E9FAEF',
   '--nv-success-accent': '#059669',
   '--nv-success-foreground': '#065F46',
   // Error
   '--nv-error-background': '#FEEFEF',
   '--nv-error-accent': '#E6523C',
   '--nv-error-foreground': '#E6523C',
   // Warning
   '--nv-warning-background': '#FFF0D8',
   '--nv-warning-accent': '#F48533',
   '--nv-warning-foreground': '#81471D',
   // Info
   '--nv-info-background': '#DEF0FA',
   '--nv-info-accent': '#1F70AC',
   '--nv-info-foreground': '#1F70AC',
   // Promise
   '--nv-promise-background': '#F1F5F9',
   '--nv-promise-accent': '#334155',
   '--nv-promise-foreground': '#334155',
}

export const material: Theme = {
   ...layout,
   ...shadow,
   // Global
   '--nv-global-accent': '#FFF',
   '--nv-global-border': '#DEDEDE',
   '--nv-global-foreground': '#FFF',
   // Scoped
   '--nv-success-background': '#209E74',
   '--nv-error-background': '#E6523C',
   '--nv-info-background': '#0B9DE6',
   '--nv-warning-background': '#FFE556',
   '--nv-warning-accent': '#4F5358',
   '--nv-warning-foreground': '#4F5358',
   '--nv-warning-border': '#4F5358',
   '--nv-promise-accent': '#64748B',
   '--nv-promise-background': '#f1F5F9',
   '--nv-promise-foreground': '#334155',
}

export const dark: Theme = {
   ...layout,
   '--nv-border-width': '1px',
   // Global
   '--nv-global-background': '#464646',
   '--nv-global-border': '#696969',
   '--nv-global-foreground': '#D0D0D0',
   // Scoped
   '--nv-success-accent': '#8EF997',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}

export const slate: Theme = {
   ...layout,
   '--nv-border-width': '1px',
   // Global
   '--nv-global-background': '#20252E',
   '--nv-global-border': '#353b45',
   '--nv-global-foreground': '#F7F7F7',
   // Scoped
   '--nv-success-accent': '#34D399',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
}
