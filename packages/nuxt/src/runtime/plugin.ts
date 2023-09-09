import { createNotivue, type NotivueConfig } from 'notivue'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
   const options = useRuntimeConfig().public.notivue as NotivueConfig

   createNotivue(vueApp, options)
})
