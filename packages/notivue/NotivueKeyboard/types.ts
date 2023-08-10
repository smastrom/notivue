import type { ComputedRef, Ref } from 'vue'

export type TabIndexValue = 0 | -1
export type AriaHiddenValue = 'true' | 'false'
export type ContainerTabIndexMap = Record<string, TabIndexValue>

export interface NotivueKeyboardData {
   tabIndex: Ref<TabIndexValue>
   ariaLiveHidden: Ref<AriaHiddenValue>
   containersTabIndex: ComputedRef<ContainerTabIndexMap>
}
