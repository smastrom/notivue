/// <reference types="vitest" />

import { defineConfig } from 'vite'
import { alias } from './shared-config'

export default defineConfig({
   test: {
      include: ['config/*.test.ts'],
   },
   resolve: { alias },
})
