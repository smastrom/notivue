import type { App, Plugin } from 'vue'

import { createNotivue } from 'notivue/astro'

const notivue = createNotivue({
   teleportTo: '#notivue_teleport',
})

export default (app: App) => {
   app.use(notivue as unknown as Plugin)
}
