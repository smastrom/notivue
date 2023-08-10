import { inject, ref } from 'vue'

import { keyboardInjectionKey } from './constants'
import { isSSR } from '@/core/utils'

import type { NotivueKeyboardData } from './types'

export function useNotivueKeyboard(): NotivueKeyboardData {
   if (isSSR) {
      return {
         tabIndex: ref(-1),
         ariaHidden: ref('false'),
      }
   }

   return inject(keyboardInjectionKey) as NotivueKeyboardData
}
