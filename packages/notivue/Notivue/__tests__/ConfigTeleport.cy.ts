import Config from './components/Config.vue'

import type { VueWrapper } from '@vue/test-utils'

describe('Teleport', () => {
   it('By default is teleported to body', () => {
      cy.mount(Config)

         .get('.Success')
         .click()

         .get('body')
         .children()
         .should('have.class', 'Root')
   })

   it('Can teleport to different element', () => {
      cy.mount(Config, { config: { teleportTo: 'html' } })

         .get('.Success')
         .click()

         .get('body')
         .children()
         .should('not.have.class', 'Root')

         .get('html')
         .children()
         .should('have.class', 'Root')
   })

   it('Can update teleport config dynamically', () => {
      cy.mount(Config)
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ teleportTo: 'html' }))

         .get('.Success')
         .click()

         .get('body')
         .children()
         .should('not.have.class', 'Root')

         .get('html')
         .children()
         .should('have.class', 'Root')
   })
})
