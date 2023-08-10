import type { Ref } from 'vue'

export type TabIndexValue = 0 | -1
export type AriaHiddenValue = 'true' | 'false'

export interface NotivueKeyboardData {
   tabIndex: Ref<TabIndexValue>
   ariaHidden: Ref<AriaHiddenValue>
}
