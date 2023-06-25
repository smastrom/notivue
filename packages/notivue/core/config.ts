import { computed } from 'vue'

import { defaultNotificationOptions } from './options'
import { toWritableRefs, mergeDeep } from './utils'

import { CLASS_PREFIX as CX } from './constants'

import type { _NotivueConfig, DeepPartial } from '../types'

export const defaultConfig: _NotivueConfig = {
   pauseOnHover: true,
   pauseOnTouch: true,
   position: 'top-center',
   teleportTo: 'body',
   class: '',
   notifications: defaultNotificationOptions,
   animations: { enter: CX + 'enter', leave: CX + 'leave', clearAll: CX + 'clearAll' },
   theme: {},
   icons: {},
}

export function getConfig(userConfig: DeepPartial<_NotivueConfig>) {
   const reactiveConfig = toWritableRefs(mergeDeep(defaultConfig, userConfig))

   return {
      ...reactiveConfig,
      isTopAlign: computed(() => reactiveConfig.position.value.startsWith('top')),
   }
}
