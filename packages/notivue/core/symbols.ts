import { createStore } from './createStore'

import type { InjectionKey } from 'vue'

export const storeInjectionKey = Symbol('') as InjectionKey<ReturnType<typeof createStore>>
