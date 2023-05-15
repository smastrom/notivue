import type { InjectionKey } from 'vue'
import type { Store } from './types'

export const storeInjectionKey = Symbol('') as InjectionKey<Store>
