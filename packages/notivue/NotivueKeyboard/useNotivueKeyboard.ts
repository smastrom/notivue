import type { NotivueKeyboardData } from 'notivue'

import { ref, computed } from 'vue'

/**
 * @deprecated NotivueKeyboard now manages focus automatically.
 * This composable is no longer needed — remove it from your code.
 */
export function useNotivueKeyboard(): NotivueKeyboardData {
   return {
      elementsTabIndex: ref(-1),
      containersTabIndex: computed(() => ({})),
   }
}
