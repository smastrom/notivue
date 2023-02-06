import type { InjectionKey } from 'vue';
import type { ReceiverStore } from './types';

export const mainSym = Symbol('') as InjectionKey<ReceiverStore>;
export const userSyms: Record<string, InjectionKey<ReceiverStore>> = {};
export const notifySyms: InjectionKey<ReceiverStore>[] = [mainSym];
