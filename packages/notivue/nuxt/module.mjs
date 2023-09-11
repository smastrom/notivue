import {
   defineNuxtModule,
   addPluginTemplate,
   addImports,
   addComponent,
   createResolver,
} from '@nuxt/kit'
import { defu } from 'defu'

const module = defineNuxtModule({
   meta: {
      name: 'nuxt/notivue',
      configKey: 'notivue',
   },

   async setup(moduleOptions, nuxt) {
      nuxt.options.runtimeConfig.public.notivue = defu(
         nuxt.options.runtimeConfig.public.notivue || {},
         moduleOptions
      )

      const { resolve } = createResolver(import.meta.url)

      addPluginTemplate({
         filename: 'notivue.client.mjs',
         getContents() {
            return `
                  import { createNotivue } from 'notivue'
                  import { defineNuxtPlugin, useRuntimeConfig } from '#app'
   
                  export default defineNuxtPlugin(({ vueApp }) => {
                     const options = useRuntimeConfig().public?.notivue || {}
   
                     createNotivue(vueApp, options)
                  })           
                  `
         },
      })
      ;['usePush', 'useNotivue', 'useNotifications', 'useNotivueKeyboard'].forEach((name) =>
         addImports({ name, as: name, from: 'notivue' })
      )

      for (const name of ['Notivue', 'NotivueKeyboard']) {
         await addComponent({ name, filePath: resolve(`runtime/${name}.vue`) })
      }

      for (const name of ['Notifications', 'NotivueSwipe']) {
         await addComponent({ name, export: name, filePath: 'notivue' })
      }
   },
})

export { module as default }
