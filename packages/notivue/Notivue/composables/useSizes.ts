import { useStore } from '@/core/useStore'

import { useResizeListObserver } from './useResizeListObserver'
import { useWindowSize } from './useWindowSize'

export function useSizes() {
   const { elements, animations } = useStore()

   useWindowSize(() => animations.updatePositions({ isImmediate: true }))

   useResizeListObserver(elements.items.value, () => animations.updatePositions())
}
