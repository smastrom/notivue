import type { InjectionKey } from 'vue'
import type { NotivueInstance, NotivueStore } from 'notivue'

export const notivueInstanceInjectionKey = Symbol() as InjectionKey<NotivueInstance>
export const notivueInjectionKey = Symbol() as InjectionKey<NotivueStore>
