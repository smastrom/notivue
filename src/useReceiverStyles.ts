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

const noDuration = '0ms !important'

const wrapperStyles: CSSProperties = {
   ...boxSizing,
   zIndex: 2147483647,
   position: 'fixed',
   width: '100%',
   height: '100%',
   display: 'flex',
   justifyContent: 'center',
   pointerEvents: 'none',
}

export function useReceiverStyles({ rootPadding, maxWidth, position }: Param) {
   const isReduced = useReducedMotion()

   const xSpacing = computed(() => rootPadding.value[1] + rootPadding.value[3])

   const xAlignment = computed(() => {
      const [, y] = position.value.split('-')
      return y === 'left' ? 'flex-start' : y === 'right' ? 'flex-end' : 'center'
   })

   const containerStyles = computed<CSSProperties>(() => ({
      ...boxSizing,
      ...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
      position: 'relative',
      height: '100vh',
      justifyContent: 'center',
      width: '100%',
      display: 'flex',
   }))

   const rowStyles = computed<CSSProperties>(() => ({
      ...boxSizing,
      transitionProperty: 'all',
      transitionTimingFunction: EASING,
      transitionDuration: '300ms',
      position: 'absolute',
      display: 'flex',
      width: `calc(100% - ${xSpacing.value}px)`,
      justifyContent: xAlignment.value,
      ...(isReduced.value ? { transitionDuration: noDuration } : {}),
   }))

   const boxStyles = computed<CSSProperties>(() =>
      isReduced.value ? { animationDuration: noDuration } : {}
   )

   return { wrapperStyles, containerStyles, rowStyles, boxStyles }
}
