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
      compatibility: {
         nuxt: '>=3.5.0',
      },
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

                  function nullToInf(obj) {
                     if (obj == null) return 1 / 0

                     if (typeof obj === 'object') {
                        for (let key in obj) obj[key] = nullToInf(obj[key])
                     }

                     return obj
                  }                  
   
                  export default defineNuxtPlugin(({ vueApp }) => {
                     const options = useRuntimeConfig().public?.notivue || {}
                     const deserializedOpts = nullToInf(JSON.parse(JSON.stringify(options)))
   
                     createNotivue(vueApp, deserializedOpts)
                  })           
                  `
         },
      })

      for (const name of ['usePush', 'useNotivue', 'useNotifications', 'useNotivueKeyboard']) {
         addImports({ name, as: name, from: 'notivue' })
      }

      for (const name of ['Notivue', 'NotivueKeyboard']) {
         await addComponent({ name, filePath: resolve(`runtime/${name}.vue`) })
      }

      for (const name of ['Notifications', 'NotivueSwipe']) {
         await addComponent({ name, export: name, filePath: 'notivue' })
      }
   },
})

export { module as default }
