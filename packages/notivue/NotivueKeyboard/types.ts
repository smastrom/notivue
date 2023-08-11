import type { ComputedRef, Ref } from 'vue'

export type TabIndexValue = 0 | -1
export type ContainerTabIndexMap = Record<string, TabIndexValue>

export interface NotivueKeyboardData {
   tabIndex: Ref<TabIndexValue>
   containersTabIndex: ComputedRef<ContainerTabIndexMap>
}
