import type { InjectionKey } from 'vue'
import type { Store } from './types'

export const storeSymbol = Symbol('') as InjectionKey<Store>
