import { computed, type Ref, type CSSProperties } from 'vue'
import { EASING } from './constants'
import type { ReceiverProps } from './types'

type Params = {
   rootPadding: Ref<ReceiverProps['rootPadding']>
   maxWidth: Ref<ReceiverProps['maxWidth']>
   position: Ref<ReceiverProps['position']>
}

const brBox: CSSProperties = { boxSizing: 'border-box' }

const wrapperStyles: CSSProperties = {
   ...brBox,
   position: 'fixed',
   width: '100%',
   height: '100%',
   display: 'flex',
   justifyContent: 'center',
   pointerEvents: 'none',
}

export function useReceiverStyles({ rootPadding, maxWidth, position }: Params) {
   const xSpacing = computed(() => rootPadding.value[1] + rootPadding.value[3])

   const xAlignment = computed(() => {
      const [, y] = position.value.split('-')
      return y === 'left' ? 'flex-start' : y === 'right' ? 'flex-end' : 'center'
   })

   const containerStyles = computed<CSSProperties>(() => ({
      ...brBox,
      ...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
      position: 'relative',
      justifyContent: 'center',
      width: '100%',
      display: 'flex',
   }))

   const itemStyles = computed<CSSProperties>(() => ({
      ...brBox,
      transition: `all 300ms ${EASING}`,
      position: 'absolute',
      display: 'flex',
      width: `calc(100% - ${xSpacing.value}px)`,
      justifyContent: xAlignment.value,
   }))

   return { wrapperStyles, containerStyles, itemStyles }
}
