import { mount } from 'cypress/vue'

import Notivue, { type CyNotivueSwipeProps } from '@/tests/NotivueSwipe/components/Notivue.vue'

import { DEFAULT_ANIM_DURATION as ANIM_DUR } from '@/support/utils'
import { createNotivue } from 'notivue'

declare global {
   namespace Cypress {
      interface Chainable {
         mountSwipe(props?: CyNotivueSwipeProps): Chainable<any>
         pushSwipeSuccess(): Chainable<any>
      }
   }
}

Cypress.Commands.add('mountSwipe', (props = {}) => {
   const notivue = createNotivue()

   return mount(Notivue, {
      global: {
         plugins: [notivue],
      },
      props,
   })
})

Cypress.Commands.add('pushSwipeSuccess', () => cy.get('.Success').click().wait(ANIM_DUR))
