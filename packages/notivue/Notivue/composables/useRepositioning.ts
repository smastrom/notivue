import { watch } from 'vue'

import { useWindowSize } from './useWindowSize'
import { useResizeObserver } from './useResizeObserver'
import { useStore } from '@/core/useStore'

import { TransitionType as TType } from '@/core/constants'

/** Set of watchers that aggressively reposition notifications. */
export function useRepositioning() {
   const { elements, animations, config } = useStore()

   // 1. Window resize (below 1100px)
   useWindowSize(() => animations.updatePositions(TType.SILENT))

   // 2. Elements 'height' change
   useResizeObserver(elements.items.value, () => animations.updatePositions(TType.HEIGHT))

   // 3. 'position' option change
   watch(config.isTopAlign, () => animations.updatePositions(TType.SILENT))
}
