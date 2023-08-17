import { notivue } from 'notivue'

export default defineNuxtPlugin(({ vueApp }) => {
   vueApp.use(notivue, {
      notifications: {
         global: {
            // duration: Infinity,
         },
      },
   })
})
