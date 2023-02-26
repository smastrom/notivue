import { computed, type Ref, type CSSProperties } from 'vue'
import { useReducedMotion } from './useReducedMotion'
import { EASING } from './constants'
import type { ReceiverProps } from './types'

type Param = {
   rootPadding: Ref<ReceiverProps['rootPadding']>
   maxWidth: Ref<ReceiverProps['maxWidth']>
   position: Ref<ReceiverProps['position']>
   gap: Ref<ReceiverProps['gap']>
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

export function useReceiverStyles({ rootPadding, maxWidth, position, gap }: Param) {
   const isReduced = useReducedMotion()

   const xAlignment = computed(() => {
      const [, x] = position.value.split('-')
      return x === 'left' ? 'flex-start' : x === 'right' ? 'flex-end' : 'center'
   })

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
      transitionProperty: 'transform',
      position: 'absolute',
      display: 'flex',
      padding: `0 ${rootPadding.value[1]}px 0 ${rootPadding.value[3]}px`,
      width: '100%',
      justifyContent: xAlignment.value,
      ...(position.value.startsWith('top')
         ? { top: rootPadding.value[0] + 'px' }
         : { bottom: rootPadding.value[2] + 'px' }),
      ...(isReduced.value ? { transitionDuration: NO_DUR } : {}),
   }))

   const boxStyles = computed<CSSProperties>(() => ({
      ...boxSizing,
      pointerEvents: 'auto',
      maxWidth: '100%',
      padding: `0 0 ${gap.value}px 0`,
      ...(isReduced.value ? { animationDuration: NO_DUR } : {}),
   }))

   return { wrapperStyles, containerStyles, rowStyles, boxStyles }
}
