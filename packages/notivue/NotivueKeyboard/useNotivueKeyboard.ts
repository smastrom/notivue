import { ref, computed } from 'vue'

import type { NotivueKeyboardData } from 'notivue'

/**
 * @deprecated NotivueKeyboard now manages focus automatically.
 * This composable is no longer needed — remove it from your code.
 */
export function useNotivueKeyboard(): NotivueKeyboardData {
   return {
      elementsTabIndex: ref(0),
      containersTabIndex: computed(() => ({})),
   }
}
