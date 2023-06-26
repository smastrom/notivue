import { watch } from 'vue'

import { useWindowSize } from './useWindowSize'
import { useResizeObserver } from './useResizeObserver'
import { useConfig, useItems, useElements } from '@/core/useStore'

import { TransitionType as TType } from '@/core/constants'

/** Set of watchers that aggressively reposition notifications. */
export function useRepositioning() {
   const config = useConfig()
   const items = useItems()
   const elements = useElements()

   // 1. Items 'length' change
   watch(
      () => items.data.value.length,
      () => items.updatePositions(TType.PUSH),
      { flush: 'post' }
   )

   // 2. Window resize (below 1100px)
   useWindowSize(() => items.updatePositions(TType.SILENT))

   // 3. Elements 'height' change
   useResizeObserver(elements.items.value, () => items.updatePositions(TType.HEIGHT))

   // 4. 'position' option change
   watch(config.isTopAlign, () => items.updatePositions(TType.SILENT))
}
