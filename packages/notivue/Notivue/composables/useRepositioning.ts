import { useWindowSize } from './useWindowSize'
import { useResizeListObserver } from './useResizeListObserver'
import { useStore } from '@/core/useStore'

export function useRepositioning() {
   const { elements, animations } = useStore()

   useWindowSize(() => animations.updatePositions({ isImmediate: true }))

   useResizeListObserver(elements.items.value, () => animations.updatePositions())
}
