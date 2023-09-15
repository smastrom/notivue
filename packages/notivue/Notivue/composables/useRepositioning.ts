import { watch } from 'vue'

import { useWindowSize } from './useWindowSize'
import { useResizeObserver } from './useResizeObserver'
import { useStore } from '@/core/useStore'

import { TransitionType as TType } from '@/core/constants'

/** Set of watchers that aggressively reposition notifications. */
export function useRepositioning() {
   const { elements, animations, config, items } = useStore()

   // 1. Items length change
   watch(
      () => items.getLength(),
      (newLength) => {
         if (newLength > 0) animations.updatePositions(TType.PUSH)
      }
   )

   // 2. Window resize (below 1100px)
   useWindowSize(() => animations.updatePositions(TType.SILENT))

   // 3. Elements 'height' change
   useResizeObserver(elements.items.value, () => animations.updatePositions(TType.HEIGHT))

   // 4. 'position' option change
   watch(config.isTopAlign, () => animations.updatePositions(TType.SILENT))
}
