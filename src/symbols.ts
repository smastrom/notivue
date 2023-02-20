import type { InjectionKey } from 'vue'
import type { Store } from './types'

export const defaultSymbol = Symbol('') as InjectionKey<Store>
export const userSymbols: Record<string, InjectionKey<Store>> = {}
