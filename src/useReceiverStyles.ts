import { computed, type Ref, type CSSProperties } from 'vue'
import { useReducedMotion } from './useReducedMotion'
import { EASING } from './constants'
import type { ReceiverProps } from './types'

type Param = {
   rootPadding: Ref<ReceiverProps['rootPadding']>
   maxWidth: Ref<ReceiverProps['maxWidth']>
   position: Ref<ReceiverProps['position']>
}

const boxSizing: CSSProperties = { boxSizing: 'border-box' }

const NO_DUR = '0ms !important'

const flexCenter: CSSProperties = {
   display: 'flex',
   justifyContent: 'center',
   width: '100%',
}

const wrapperStyles: CSSProperties = {
   ...boxSizing,
   ...flexCenter,
   zIndex: 2147483647,
   position: 'fixed',
   height: '100%',
   pointerEvents: 'none',
}

export function useReceiverStyles({ rootPadding, maxWidth, position }: Param) {
   const isReduced = useReducedMotion()

   const xSpacing = computed(() => rootPadding.value[1] + rootPadding.value[3])

   const xAlignment = computed(() => {
      const [, x] = position.value.split('-')
      return x === 'left' ? 'flex-start' : x === 'right' ? 'flex-end' : 'center'
   })

   const isTop = computed(() => position.value.split('-')[0] === 'top')

   const containerStyles = computed<CSSProperties>(() => ({
      ...boxSizing,
      ...flexCenter,
      ...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
      position: 'relative',
   }))

   const rowStyles = computed<CSSProperties>(() => ({
      ...boxSizing,
      transitionTimingFunction: EASING,
      transitionDuration: '250ms',
      transitionProperty: 'all',
      position: 'absolute',
      display: 'flex',
      width: `calc(100% - ${xSpacing.value}px)`,
      justifyContent: xAlignment.value,
      ...(isTop.value
         ? { top: rootPadding.value[0] + 'px' }
         : { bottom: rootPadding.value[2] + 'px' }),
      ...(isReduced.value ? { transitionDuration: NO_DUR } : {}),
   }))

   const boxStyles = computed<CSSProperties>(() =>
      isReduced.value ? { animationDuration: NO_DUR } : {}
   )

   return { wrapperStyles, containerStyles, rowStyles, boxStyles }
}
