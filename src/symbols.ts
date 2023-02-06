import type { InjectionKey } from 'vue';
import type { Receiver } from './types';

export const mainSym = Symbol('') as InjectionKey<Receiver>;
export const userSyms: Record<string, InjectionKey<Receiver>> = {};
export const notifySyms: InjectionKey<Receiver>[] = [mainSym];
