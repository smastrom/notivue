import { mount } from 'cypress/vue'
import { notivue } from 'notivue'

import type { Plugin } from 'vue'
import type { NotivueConfig } from 'notivue'
import type { MountingOptions } from '@vue/test-utils'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

declare global {
   namespace Cypress {
      interface Chainable {
         mount<T extends Record<string, any>>(
            component: any,
            notivueOptions?: { config?: NotivueConfig; props?: T },
            options?: OptionsParam
         ): Chainable<any>
      }
   }
}

function notivuePlugin(config: NotivueConfig = {}): Plugin {
   return {
      install(app) {
         app.use(notivue, config)
      },
   }
}

Cypress.Commands.add(
   'mount',
   (component, { config = {}, props = {} } = { config: {}, props: {} }) => {
      const mountOptions = {} as MountingOptions<typeof props>

      mountOptions.global = mountOptions.global || {}
      mountOptions.global.plugins = [notivuePlugin(config)]
      mountOptions.props = props

      return mount(component, mountOptions).then(({ wrapper }) => {
         return cy.wrap(wrapper).as('vue')
      })
   }
)
