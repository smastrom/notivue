import type { Theme } from './types'

// TODO: Remove useless props once all themes are implemented
export const light: Theme = {
   // Layout
   '--ny-width': '375px',
   '--ny-y-align': 'top',
   '--ny-spacing': '0.75rem',
   '--ny-radius': '0.75rem',
   '--ny-border-width': '0px',
   '--ny-tip-width': '0px',
   '--ny-icon-size': '1.5rem',
   '--ny-title-size': '1rem',
   '--ny-message-size': '0.875rem',
   '--ny-close-size': '1.5rem',
   '--ny-shadow': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
   // Global Colors
   '--ny-global-background': '#fff',
   '--ny-global-border': '#dedede',
   '--ny-global-foreground': '#334155',
   // Scoped Colors
   '--ny-success-accent': '#28b780',
   '--ny-error-accent': '#e74c3c',
   '--ny-warning-accent': '#f59e0b',
   '--ny-info-accent': '#3e8eff',
   '--ny-promise-accent': '#64748b',
}

export const colorful: Theme = {}

export const dark: Theme = {}

export const colorfulDark: Theme = {}
