import { ref, computed, type Ref, type CSSProperties } from 'vue'
import type { ReceiverProps } from './types'

type Params = {
   rootMargin: Ref<ReceiverProps['rootMargin']>
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

const hoverAreaStyles: CSSProperties = {
   ...brBox,
   pointerEvents: 'all',
}

export function useReceiverStyles({ rootMargin, maxWidth, position }: Params) {
   const is = (_position: string) => position.value.includes(_position)

   const containerStyles = computed<CSSProperties>(() => ({
      ...brBox,
      ...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
      alignItems: is('top') ? 'start' : 'end',
      justifyContent: is('right') ? 'end' : is('left') ? 'start' : 'center',
      width: '100%',
      display: 'flex',
   }))

   return { wrapperStyles, containerStyles, hoverAreaStyles }
}
