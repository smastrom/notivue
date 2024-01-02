export default defineNuxtRouteMiddleware(() => {
   updateConfig((currConf) => {
      console.log('Current config:', currConf)
      return {}
   })

   push.info('Welcome to Notivue! Use the controls below to test it out.')
})
