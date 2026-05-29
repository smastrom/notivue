import type { NotivueInstance, NotivueStore } from 'notivue'
import type { InjectionKey } from 'vue'

export const notivueInstanceInjectionKey = Symbol() as InjectionKey<NotivueInstance>
export const notivueInjectionKey = Symbol() as InjectionKey<NotivueStore>
