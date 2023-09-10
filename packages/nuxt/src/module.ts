import { defineNuxtModule, addComponent, addImports, addPluginTemplate } from '@nuxt/kit'
import { defu } from 'defu'

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
   },
   setup(moduleOptions, nuxt) {
      nuxt.options.runtimeConfig.public.notivue = defu(
         nuxt.options.runtimeConfig.public.notivue || {},
         moduleOptions
      )

      nuxt.hook('prepare:types', (opts) => {
         opts.references.push({ types: 'notivue' })
      })

      nuxt.options.build.transpile.push('notivue')

      if (nuxt.options.vite.optimizeDeps) {
         nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || []
         nuxt.options.vite.optimizeDeps.exclude.push('notivue')
      }

      ;['usePush', 'useNotivue', 'useNotifications', 'useNotivueKeyboard'].forEach((name) =>
         addImports({ name, as: name, from: 'notivue' })
      )
      ;['Notivue', 'Notifications', 'NotivueSwipe', 'NotivueKeyboard'].forEach((name) =>
         addComponent({ name, export: name, filePath: 'notivue' })
      )

      addPluginTemplate({
         filename: 'notivue.mjs',
         getContents() {
            return `
            import { createNotivue } from 'notivue'
            import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
            
            export default defineNuxtPlugin(({ vueApp }) => {
               const options = useRuntimeConfig().public.notivue
            
               createNotivue(vueApp, options)
            })
            `
         },
      })
   },
})