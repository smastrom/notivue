import { inject, ref, computed } from 'vue'

import { keyboardInjectionKey } from './constants'
import { isSSR } from '@/core/utils'

import type { NotivueKeyboardData } from './types'

export function useNotivueKeyboard(): NotivueKeyboardData {
   if (isSSR) {
      return {
         elementsTabIndex: ref(-1),
         containersTabIndex: computed(() => ({})),
      }
   }

   return inject(keyboardInjectionKey) as NotivueKeyboardData
}
