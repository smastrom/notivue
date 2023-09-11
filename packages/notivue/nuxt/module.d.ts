import * as _nuxt_schema from '@nuxt/schema'

import { NotivueConfig } from 'notivue'

declare module '@nuxt/schema' {
   interface NuxtConfig {
      notivue?: NotivueConfig
   }
   interface NuxtOptions {
      strapi?: NotivueConfig
   }
   interface PublicRuntimeConfig {
      notivue?: NotivueConfig
   }
}

declare const _default: _nuxt_schema.NuxtModule<NotivueConfig>

export { _default as default }
