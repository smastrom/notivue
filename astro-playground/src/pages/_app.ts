import { createNotivue } from 'notivue/astro'

import type { App, Plugin } from 'vue'

const notivue = createNotivue({
   teleportTo: '#notivue_teleport',
})

export default (app: App) => {
   app.use(notivue as unknown as Plugin)
}
