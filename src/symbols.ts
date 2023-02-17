import type { InjectionKey } from 'vue';
import type { Receiver } from './types';

export const defaultSym = Symbol('') as InjectionKey<Receiver>;
export const userSyms: Record<string, InjectionKey<Receiver>> = {};
export const notifySyms: InjectionKey<Receiver>[] = [defaultSym];
