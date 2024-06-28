import { createNotivue } from 'notivue/astro'

import type { App, Plugin } from 'vue'

const notivue = createNotivue({
   teleportTo: '#notivue_teleport',
})

export default (app: App) => {
   if (import.meta.env.SSR) return

   app.use(notivue as unknown as Plugin)
   console.log('Injected!', app)
}
