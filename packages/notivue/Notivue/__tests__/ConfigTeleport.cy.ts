import Notivue from './components/Notivue.vue'

import type { VueWrapper } from '@vue/test-utils'

describe('Teleport', () => {
   it('By default is teleported to body', () => {
      cy.mount(Notivue)

         .clickRandomStatic()

         .get('body')
         .children()
         .should('have.class', 'Root')
   })

   it('Can teleport to different element', () => {
      cy.mount(Notivue, { config: { teleportTo: 'html' } })

         .clickRandomStatic()

         .get('body')
         .children()
         .should('not.have.class', 'Root')

         .get('html')
         .children()
         .should('have.class', 'Root')
   })

   it('Can update teleport config dynamically', () => {
      cy.mount(Notivue)
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ teleportTo: 'html' }))

         .clickRandomStatic()

         .get('body')
         .children()
         .should('not.have.class', 'Root')

         .get('html')
         .children()
         .should('have.class', 'Root')
   })
})
