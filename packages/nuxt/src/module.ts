import { defineNuxtModule, createResolver, addPlugin, addComponent, addImports } from '@nuxt/kit'
import defu from 'defu'

import type { NotivueConfig } from 'notivue'

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

export default defineNuxtModule<NotivueConfig>({
   meta: {
      name: '@nuxtjs/notivue',
      configKey: 'notivue',
      compatibility: {
         nuxt: '^3.0.0',
      },
   },
   defaults: {},
   setup(moduleOptions, nuxt) {
      nuxt.options.runtimeConfig.public.notivue = defu(
         nuxt.options.runtimeConfig.public.notivue,
         moduleOptions
      )

      const { resolve } = createResolver(import.meta.url)

      ;['usePush', 'useNotivue', 'useNotifications', 'useNotivueKeyboard'].forEach((name) =>
         addImports({ name, as: name, from: 'notivue' })
      )
      ;['Notivue', 'Notifications', 'NotivueSwipe', 'NotivueKeyboard'].forEach((name) =>
         addComponent({ name, export: name, filePath: 'notivue' })
      )

      addPlugin(resolve('./runtime/plugin'))
   },
})
