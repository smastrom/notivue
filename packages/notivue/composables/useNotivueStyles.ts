import { computed, type CSSProperties } from 'vue'

import { useReducedMotion } from './useReducedMotion'
import { useConfig } from './useStore'
import { NO_DUR, EASING } from '../core/constants'

/**
 * The follwing styles are defined here and not in a CSS file
 * because they are needed whether user uses default or custom components.
 *
 * If user chooses to only use custom components they can simply
 * remove the /notifications.css import.
 */

const boxSizing: CSSProperties = { boxSizing: 'border-box' }
const noMargin: CSSProperties = { margin: '0' }
const flex: CSSProperties = { display: 'flex' }
const absolute: CSSProperties = { position: 'absolute' }

const flexCenter: CSSProperties = {
   ...flex,
   justifyContent: 'center',
   width: '100%',
}

export const visuallyHidden: CSSProperties = {
   ...absolute,
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: '1px',
   overflow: 'hidden',
   whiteSpace: 'nowrap',
   width: '1px',
}

const staticStyles: Record<string, CSSProperties> = {
   wrapper: {
      ...boxSizing,
      ...flexCenter,
      zIndex: 'var(--nv-z, 500)' as any,
      position: 'fixed',
      height: '100%',
      pointerEvents: 'none',
      top: '0px',
   },
   container: {
      ...boxSizing,
      ...flexCenter,
      ...noMargin,
      position: 'relative',
      maxWidth: 'var(--nv-root-container, 100%)',
      listStyle: 'none',
      padding: '0',
   },
   row: {
      ...boxSizing,
      ...noMargin,
      ...flex,
      ...absolute,
      padding: '0 var(--nv-root-right, 1.25rem) 0 var(--nv-root-left, 1.25rem)',
      transitionTimingFunction: EASING,
      transitionDuration: '300ms',
      transitionProperty: 'transform',
      width: '100%',
   },
   box: {
      ...boxSizing,
      padding: `0 0 var(--nv-gap, 0.75rem) 0`,
      pointerEvents: 'auto',
      maxWidth: '100%',
   },
}

export function useNotivueStyles() {
   const isReduced = useReducedMotion()
   const config = useConfig()

   const yCoords = computed<CSSProperties>(() =>
      config.isTopAlign.value
         ? { top: 'var(--nv-root-top, 1.25rem)' }
         : { bottom: 'var(--nv-root-bottom, 1.25rem)' }
   )

   const xAlignment = computed<CSSProperties>(() => {
      const is = (value: string) => config.position.value.endsWith(value)

      return {
         justifyContent: `var(--nv-root-x-align, ${
            is('left') ? 'start' : is('right') ? 'end' : 'center'
         })`,
      }
   })

   const dynamicStyles = computed(() => ({
      row: {
         ...yCoords.value,
         ...xAlignment.value,
         ...(isReduced.value ? { transitionDuration: NO_DUR } : {}),
      },
      box: isReduced.value ? { animationDuration: NO_DUR } : {},
   }))

   return { staticStyles, dynamicStyles }
}
