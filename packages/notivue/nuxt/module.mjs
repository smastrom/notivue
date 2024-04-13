import { defineNuxtModule, addPluginTemplate, addImports, addComponent } from '@nuxt/kit'
import { defu } from 'defu'

import { getFunctions, getObjects, getComponents } from '../shared/exports'

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

      if (nuxt.options.runtimeConfig.public.notivue.addPlugin !== false) {
         addPluginTemplate({
            filename: '001.notivue.client.mjs',
            getContents() {
               return `
                  import { createNotivue } from 'notivue'
                  import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

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
                     delete deserializedOpts.addPlugin

                     const notivue = createNotivue(deserializedOpts)

                     vueApp.use(notivue)
                  })           
                  `
            },
         })
      }

      for (const name of [...getFunctions(), ...getObjects({ omit: ['DEFAULT_CONFIG'] })]) {
         addImports({ name, as: name, from: 'notivue' })
      }

      for (const name of getComponents()) {
         await addComponent({ name, export: name, filePath: 'notivue' })
      }
   },
})

export { module as default }
