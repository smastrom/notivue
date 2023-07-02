import Notivue from './components/Notivue.vue'

describe('Clear and destroy callbacks work', () => {
   it('Clear', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()
         .get('.ClearButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroy', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()
         .get('.DestroyButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
