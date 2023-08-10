import type { InjectionKey } from 'vue'
import type { NotivueKeyboardData } from './types'

export const keyboardInjectionKey = Symbol('') as InjectionKey<NotivueKeyboardData>

export const focusableEls =
   'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
