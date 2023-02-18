import { inject } from 'vue';
import { userSyms, defaultSym } from './symbols';
import type { Receiver, PushFn } from './types';

export function useNotify(key?: string): PushFn {
   return (inject(key && key in userSyms ? userSyms[key] : defaultSym) as Receiver).push();
}
