import { describe, expect, test } from 'vitest'

import { createConfig } from '@/core/createStore'
import {
   DEFAULT_CONFIG as defaultConf,
   DEFAULT_NOTIFICATION_OPTIONS as defaultNot,
} from '@/core/constants'

import type { ConfigSlice, NotivueConfig, NotivueConfigRequired } from 'notivue'

type ConfigPairs<K extends keyof NotivueConfig> = [K, NotivueConfig[K]]

describe('Update method', () => {
   test('Should update primitive properties', () => {
      const newConf: ConfigPairs<keyof NotivueConfig>[] = [
         ['pauseOnTouch', false],
         ['pauseOnHover', false],
         ['pauseOnTabChange', false],
         ['enqueue', true],
         ['position', 'bottom-right'],
         ['teleportTo', 'vitest_body'],
         ['limit', Math.random() * 100],
      ]

      const config = createConfig({})

      for (const [key, value] of newConf) {
         expect(config[key].value).not.toBe(value)

         config.update({ [key]: value })

         expect(config[key].value).toBe(value)
      }
   })

   describe('Should merge object properties', () => {
      test('Animations', () => {
         const animations = { enter: 'Vitest_Enter', leave: 'Vitest_Leave' }

         const config = createConfig({})

         config.update({ animations })

         expect(config.animations.value).toStrictEqual({
            ...animations,
            clearAll: defaultConf.animations.clearAll,
         })
      })

      test('Notification options', () => {
         const newConf: NotivueConfig['notifications'] = {
            global: { duration: Math.random() * 100 },
            success: { title: 'Vitest' },
            error: { ariaLive: 'Vitest' } as unknown as { ariaLive: 'polite' },
            info: { message: 'Vitest' },
            warning: { ariaLive: 'Vitest' } as unknown as { ariaLive: 'polite' },
            promise: { ariaRole: 'Vitest' } as unknown as { ariaRole: 'status' },
            'promise-resolve': { duration: Math.random() * 100 },
            'promise-reject': { duration: Math.random() * 100 },
         }

         const config = createConfig({}) as ConfigSlice

         config.update({ notifications: newConf })

         expect(config.notifications.value).toStrictEqual({
            global: { ...defaultNot.global, ...newConf.global },
            success: { ...defaultNot.success, ...newConf.success },
            error: { ...defaultNot.error, ...newConf.error },
            info: { ...defaultNot.info, ...newConf.info },
            warning: { ...defaultNot.warning, ...newConf.warning },
            promise: { ...defaultNot.promise, ...newConf.promise },
            'promise-resolve': { ...defaultNot['promise-resolve'], ...newConf['promise-resolve'] },
            'promise-reject': { ...defaultNot['promise-reject'], ...newConf['promise-reject'] },
         })
      })
   })

   test('Should update using function', () => {
      const userConf = {
         pauseOnHover: false,
         teleportTo: 'vitest_body',
         limit: 20000,
         animations: { enter: 'Vitest_Enter', leave: 'Vitest_Leave', clearAll: 'Vitest_ClearAll' },
         notifications: {
            global: { duration: 3000 },
            error: { duration: 4000 },
            info: { duration: 5000 },
         },
      }

      const c = createConfig(userConf) as ConfigSlice

      let prevConf = {} as NotivueConfigRequired

      c.update((curr) => {
         expect(curr).toStrictEqual({
            ...defaultConf,
            ...userConf,
            notifications: {
               ...defaultConf.notifications,
               global: { ...defaultConf.notifications.global, ...userConf.notifications.global },
               error: { ...defaultConf.notifications.error, ...userConf.notifications.error },
               info: { ...defaultConf.notifications.info, ...userConf.notifications.info },
            },
         })

         prevConf = curr

         const { notifications: currNot } = curr

         return {
            pauseOnHover: !curr.pauseOnHover,
            pauseOnTouch: !curr.pauseOnTouch,
            pauseOnTabChange: !curr.pauseOnTabChange,
            enqueue: !curr.enqueue,
            position: (curr.position + '-left') as unknown as NotivueConfig['position'],
            teleportTo: curr.teleportTo + '_body',
            animations: {
               enter: curr.animations.enter + '_Enter',
               leave: curr.animations.leave + '_Leave',
            },
            limit: curr.limit * 2,
            notifications: {
               global: { duration: currNot.global.duration * 2 },
               info: { duration: currNot.info.duration * 2 },
               error: { duration: currNot.error.duration * 2 },

               success: { duration: currNot.success.duration * 2 },
               warning: { duration: currNot.warning.duration * 2 },
               promise: { duration: 100 },
               'promise-resolve': { duration: 100 },
               'promise-reject': { duration: currNot['promise-reject'].duration * 2 },
            },
         }
      })

      const { notifications: prevNot } = prevConf

      expect(c.pauseOnHover.value).toBe(!prevConf.pauseOnHover)
      expect(c.pauseOnTouch.value).toBe(!prevConf.pauseOnTouch)
      expect(c.pauseOnTabChange.value).toBe(!prevConf.pauseOnTabChange)
      expect(c.enqueue.value).toBe(!prevConf.enqueue)
      expect(c.position.value).toBe(prevConf.position + '-left')
      expect(c.teleportTo.value).toBe(prevConf.teleportTo + '_body')
      expect(c.limit.value).toBe(prevConf.limit * 2)
      expect(c.animations.value).toStrictEqual({
         enter: prevConf.animations.enter + '_Enter',
         leave: prevConf.animations.leave + '_Leave',
         clearAll: prevConf.animations.clearAll,
      })
      expect(c.notifications.value).toStrictEqual({
         global: { ...prevNot.global, duration: prevNot.global.duration * 2 },
         info: { ...prevNot.info, duration: prevNot.info.duration * 2 },
         error: { ...prevNot.error, duration: prevNot.error.duration * 2 },

         success: { ...prevNot.success, duration: defaultNot.success.duration * 2 },
         warning: { ...prevNot.warning, duration: defaultNot.warning.duration * 2 },
         promise: { ...prevNot.promise, duration: 100 },

         'promise-resolve': { ...prevNot['promise-resolve'], duration: 100 },
         'promise-reject': {
            ...prevNot['promise-reject'],
            duration: prevNot['promise-reject'].duration * 2,
         },
      })
   })
})
