import { computed, type CSSProperties } from 'vue'

import { useNotivue } from '@/core/useStore'

import type { NotivueElements } from 'notivue'

/**
 * The follwing styles are not defined in a CSS file because
 * they are needed whether user uses default or custom components.
 *
 * Hence if users choose to only use custom components they can
 * remove the /notifications.css import and have no CSS at all.
 */

const boxSizing: CSSProperties = { boxSizing: 'border-box' }

const baseStyles: Record<NotivueElements, CSSProperties> = {
   ol: {
      ...boxSizing,
      display: 'flex',
      justifyContent: 'center',
      listStyle: 'none',
      margin: '0 auto',
      maxWidth: 'var(--nv-root-width, 100%)',
      padding: '0',
      pointerEvents: 'none',
      position: 'fixed',
      zIndex: 'var(--nv-z, 500)',
   },
   li: {
      ...boxSizing,
      display: 'flex',
      margin: '0',
      position: 'absolute',
      transitionProperty: 'transform',
      width: '100%',
   },
   item: {
      ...boxSizing,
      maxWidth: '100%',
      padding: `0 0 var(--nv-gap, 0.75rem) 0`,
      pointerEvents: 'auto',
   },
}

export function useNotivueStyles() {
   const { isTopAlign, position } = useNotivue()

   /**
    * Simulates overflow-hidden only on the opposite side of the current vertical align.
    * This will not clip enter animations but will contain the stream vertically.
    */
   const offset = computed<CSSProperties>(() => {
      const isTop = isTopAlign.value

      // IMPORTANT: Order of values must match 'top right bottom left'
      const inset = [
         `var(--nv-root-top, ${isTop ? '1.25rem' : '0px'})`,
         'var(--nv-root-right, 1.25rem)',
         `var(--nv-root-bottom, ${isTop ? '0px' : '1.25rem'})`,
         'var(--nv-root-left, 1.25rem)',
      ]

      const clipPath = inset.map((v) => `calc(-1 * ${v})`)
      isTop ? clipPath.splice(2, 1, '0px') : clipPath.splice(0, 1, '0px')

      return { inset: inset.join(' '), clipPath: `inset(${clipPath.join(' ')})` }
   })

   const xAlignment = computed<CSSProperties>(() => ({
      [isTopAlign.value ? 'top' : 'bottom']: '0',
      justifyContent: `var(--nv-root-x-align, ${
         position.value.endsWith('left')
            ? 'flex-start'
            : position.value.endsWith('right')
            ? 'flex-end'
            : 'center'
      })`,
   }))

   return computed<Record<NotivueElements, CSSProperties>>(() => ({
      ol: { ...baseStyles.ol, ...offset.value },
      li: { ...baseStyles.li, ...xAlignment.value },
      item: baseStyles.item,
   }))
}
