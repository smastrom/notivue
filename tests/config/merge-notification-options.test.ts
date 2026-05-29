import type { NotivueConfig, NotivueConfigRequired, PushOptionsWithInternals } from 'notivue'

import { describe, expect, test } from 'vitest'

import { mergeNotificationOptions } from '@/core/utils'

import { DEFAULT_NOTIFICATION_OPTIONS } from '@/core/constants'

const baseConfig = DEFAULT_NOTIFICATION_OPTIONS as NotivueConfigRequired['notifications']

function merge<T extends Record<string, unknown> = Record<string, never>>(
   notifications: NotivueConfig['notifications'] = {},
   push: PushOptionsWithInternals<T>
) {
   return mergeNotificationOptions(
      { ...baseConfig, ...notifications } as NotivueConfigRequired['notifications'],
      push
   )
}

describe('mergeNotificationOptions', () => {
   test('Per-type options override global config', () => {
      const result = merge(
         {
            global: { title: 'global', duration: 1000 },
            success: { title: 'typed', duration: 2000 },
         },
         { id: '1', type: 'success' }
      )

      expect(result.title).toBe('typed')
      expect(result.duration).toBe(2000)
   })

   test('Push options override config', () => {
      const result = merge(
         {
            global: { title: 'global', duration: 1000 },
            success: { title: 'typed', duration: 2000 },
         },
         { id: '1', type: 'success', title: 'push', duration: 3000 }
      )

      expect(result.title).toBe('push')
      expect(result.duration).toBe(3000)
   })

   test('Loading notifications always use unlimited duration', () => {
      const result = merge(
         {
            global: { duration: 1000 },
            promise: { duration: 5000 },
         },
         { id: '1', type: 'loading', duration: 3000 }
      )

      expect(result.duration).toBe(-1)
      expect(result.type).toBe('loading')
   })

   test('Legacy promise* config overrides canonical loading* defaults', () => {
      const result = merge(
         {
            'promise-reject': { ariaLive: 'polite', ariaRole: 'status', title: 'legacy' },
         },
         { id: '1', type: 'loading-error' }
      )

      expect(result.ariaLive).toBe('polite')
      expect(result.ariaRole).toBe('status')
      expect(result.title).toBe('legacy')
   })

   test('Canonical loading* config applies when legacy alias is unset', () => {
      const result = merge(
         {
            'loading-error': { ariaLive: 'polite', ariaRole: 'status', title: 'canonical' },
         },
         { id: '1', type: 'loading-error' }
      )

      expect(result.ariaLive).toBe('polite')
      expect(result.title).toBe('canonical')
   })

   test('Legacy promise* config overrides canonical loading* config when both are set', () => {
      const result = merge(
         {
            'loading-error': { ariaLive: 'polite', ariaRole: 'status', title: 'canonical' },
            'promise-reject': { ariaLive: 'assertive', ariaRole: 'alert', title: 'legacy' },
         },
         { id: '1', type: 'loading-error' }
      )

      expect(result.ariaLive).toBe('assertive')
      expect(result.title).toBe('legacy')
   })

   test('Normalizes deprecated promise types to loading variants', () => {
      expect(merge({}, { id: '1', type: 'promise' }).type).toBe('loading')
      expect(merge({}, { id: '1', type: 'promise-resolve' }).type).toBe('loading-success')
      expect(merge({}, { id: '1', type: 'promise-reject' }).type).toBe('loading-error')
   })
})
