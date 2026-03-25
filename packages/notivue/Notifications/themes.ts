import type { NotivueTheme } from 'notivue'

/** Duplicate `--nv-promise-*` as `--nv-loading-*` when missing (deprecated alias support). */
function withLoadingColorAliases<T extends NotivueTheme>(theme: T): T {
   const out = { ...theme } as Record<string, string>
   for (const [k, v] of Object.entries(theme)) {
      if (k.startsWith('--nv-promise')) {
         const lk = k.replace('--nv-promise', '--nv-loading')
         if (out[lk] === undefined) out[lk] = v
      }
   }
   return out as T
}

const layout: NotivueTheme = {
   '--nv-width': '350px',
   '--nv-spacing': '0.625rem',
   '--nv-radius': '0.625rem',
   '--nv-icon-size': '1.25rem',
   '--nv-title-size': '0.925rem',
   '--nv-message-size': '0.925rem',
   '--nv-y-align': 'center',
}

const shadow = {
   '--nv-shadow': 'rgba(0, 0, 0, 0.06) 0px 4px 6px -1px, rgba(0, 0, 0, 0.03) 0px 2px 4px -1px',
}

export const lightTheme: NotivueTheme = withLoadingColorAliases({
   ...layout,
   ...shadow,

   '--nv-global-bg': '#FFF',
   '--nv-global-fg': '#171717',

   '--nv-success-accent': '#28B780',
   '--nv-error-accent': '#E74C3C',
   '--nv-warning-accent': '#F59E0B',
   '--nv-info-accent': '#3E8EFF',
   '--nv-promise-accent': '#171717',
})

export const pastelTheme: NotivueTheme = withLoadingColorAliases({
   ...layout,
   ...shadow,

   '--nv-success-bg': '#E9FAEF',
   '--nv-success-accent': '#059669',
   '--nv-success-fg': '#057452',

   '--nv-error-bg': '#FEEFEF',
   '--nv-error-accent': '#E6523C',
   '--nv-error-fg': '#C5412C',

   '--nv-warning-bg': '#FFF0D8',
   '--nv-warning-accent': '#F48533',
   '--nv-warning-fg': '#81471D',

   '--nv-info-bg': '#DEF0FA',
   '--nv-info-accent': '#1F70AC',
   '--nv-info-fg': '#1F70AC',

   '--nv-promise-bg': '#FFF',
   '--nv-promise-accent': '#334155',
   '--nv-promise-fg': '#334155',
})

export const materialTheme: NotivueTheme = withLoadingColorAliases({
   ...layout,
   ...shadow,

   '--nv-global-accent': '#FFF',
   '--nv-global-fg': '#FFF',

   '--nv-success-bg': '#178570',
   '--nv-error-bg': '#C94430',
   '--nv-info-bg': '#117AAE',

   '--nv-warning-bg': '#FFE556',
   '--nv-warning-fg': '#4F5358',
   '--nv-warning-accent': '#4F5358',

   '--nv-promise-bg': '#FFF',
   '--nv-promise-fg': '#334155',
   '--nv-promise-accent': '#64748B',
})

export const darkTheme: NotivueTheme = withLoadingColorAliases({
   ...layout,
   '--nv-border-width': '1px',

   '--nv-global-bg': '#1F1F1F',
   '--nv-global-border': '#414141',
   '--nv-global-fg': '#D0D0D0',

   '--nv-success-accent': '#8EF997',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
})

export const slateTheme: NotivueTheme = withLoadingColorAliases({
   ...layout,
   '--nv-border-width': '1px',

   '--nv-global-bg': '#20252E',
   '--nv-global-border': '#353b45',
   '--nv-global-fg': '#dfdfdf',

   '--nv-success-accent': '#34D399',
   '--nv-error-accent': '#FF7777',
   '--nv-warning-accent': '#FFE554',
   '--nv-info-accent': '#5FD4FF',
   '--nv-promise-accent': '#D0D0D0',
})
