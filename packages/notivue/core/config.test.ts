import { test, describe, expect } from 'vitest'

import { defaultConfig } from './config'
import { mergeDeep } from './utils'
import { defaultNotificationOptions } from './options'
import { CLASS_PREFIX as CX } from './constants'

describe('Config Merge', () => {
   test('Returns default config', () => {
      expect(mergeDeep(defaultConfig, {})).toStrictEqual(defaultConfig)
   })

   test('Merges properties correctly', () => {
      const userConfig = {
         pauseOnHover: false,
         pauseOnTouch: false,
         pauseOnTabChange: false,
         position: 'bottom-center',
         teleportTo: 'html',
         class: 'CustomClass',

         options: {},
         animations: {
            enter: CX + 'enterCustom',
            leave: CX + 'leaveCustom',
         },
      } as const

      const result = mergeDeep(defaultConfig, userConfig)

      expect(result).toMatchObject(userConfig)

      expect(result.notifications).toStrictEqual(defaultNotificationOptions) // Default

      expect(result).toHaveProperty('animations', {
         enter: CX + 'enterCustom',
         leave: CX + 'leaveCustom',
         clearAll: CX + 'clearAll', // Default
      })
   })
})
