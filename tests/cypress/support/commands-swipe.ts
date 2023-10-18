import { mount } from 'cypress/vue'
import { notivuePlugin } from './utils'

import Notivue, { type CyNotivueSwipeProps } from '@/tests/NotivueSwipe/components/Notivue.vue'

import { DEFAULT_ANIM_DURATION as ANIM_DUR } from '@/support/utils'

declare global {
   namespace Cypress {
      interface Chainable {
         mountSwipe(props?: CyNotivueSwipeProps): Chainable<any>
         pushSwipeSuccess(): Chainable<any>
      }
   }
}

Cypress.Commands.add('mountSwipe', (props = {}) => {
   return mount(Notivue, {
      global: {
         plugins: [notivuePlugin()],
      },
      props,
   })
})

Cypress.Commands.add('pushSwipeSuccess', () => cy.get('.Success').click().wait(ANIM_DUR))
