import Notivue from './components/Notivue.vue'

describe('Clear and destroy callbacks work', () => {
   it('Clear', () => {
      cy.mount(Notivue)

         .clickRandomStatic()
         .get('.ClearButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroy', () => {
      cy.mount(Notivue)

         .clickRandomStatic()
         .get('.DestroyButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
