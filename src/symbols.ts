import type { InjectionKey } from 'vue'
import type { Receiver } from './types'

export const defaultSymbol = Symbol('') as InjectionKey<Receiver>
export const userSymbols: Record<string, InjectionKey<Receiver>> = {}
