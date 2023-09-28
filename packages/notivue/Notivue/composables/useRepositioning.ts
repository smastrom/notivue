import { useWindowSize } from './useWindowSize'
import { useResizeListObserver } from './useResizeListObserver'
import { useStore } from '@/core/useStore'

import { TransitionType as TType } from '@/core/constants'

export function useRepositioning() {
   const { elements, animations } = useStore()

   useWindowSize(() => animations.updatePositions(TType.IMMEDIATE))

   useResizeListObserver(elements.items.value, () => animations.updatePositions())
}
