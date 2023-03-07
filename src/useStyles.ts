import { computed, type Ref, type ComputedRef, type CSSProperties } from 'vue'
import { useReducedMotion } from './useReducedMotion'
import { EASING } from './constants'
import type { ReceiverProps } from './types'

const NO_DUR = '0ms !important'

const boxSizing: CSSProperties = { boxSizing: 'border-box' }

const flexCenter: CSSProperties = {
   display: 'flex',
   justifyContent: 'center',
   width: '100%',
}

export const staticStyles: Record<string, CSSProperties> = {
   wrapper: {
      ...boxSizing,
      ...flexCenter,
      position: 'fixed',
      height: '100%',
      pointerEvents: 'none',
   },
   container: {
      ...boxSizing,
      ...flexCenter,
      position: 'relative',
      maxWidth: 'var(--vn-root-container, 100%)',
   },
   row: {
      ...boxSizing,
      padding: '0 var(--vn-root-right, 1.25rem) 0 var(--vn-root-left, 1.25rem)',
      transitionTimingFunction: EASING,
      transitionDuration: '250ms',
      transitionProperty: 'transform',
      position: 'absolute',
      display: 'flex',
      width: '100%',
   },
   box: {
      ...boxSizing,
      pointerEvents: 'auto',
      maxWidth: '100%',
   },
}

export function useDynamicStyles(
   position: Ref<ReceiverProps['position']>
): ComputedRef<Record<string, CSSProperties>> {
   const isReduced = useReducedMotion()

   const yCoords = computed<CSSProperties>(() =>
      position.value.startsWith('top')
         ? { top: 'var(--vn-root-top, 1.25rem)' }
         : { bottom: 'var(--vn-root-bottom, 1.25rem)' }
   )

   const xAlignment = computed<CSSProperties>(() => {
      const is = (value: string) => position.value.endsWith(value)

      return {
         justifyContent: `var(--vn-root-x-align, ${
            is('Left') ? 'start' : is('Right') ? 'end' : 'center'
         })`,
      }
   })

   return computed(() => ({
      row: {
         ...yCoords.value,
         ...xAlignment.value,
         ...(isReduced.value ? { transitionDuration: NO_DUR } : {}),
      },
      box: isReduced.value ? { animationDuration: NO_DUR } : {},
   }))
}
