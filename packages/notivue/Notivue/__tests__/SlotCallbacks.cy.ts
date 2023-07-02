import Slot from './components/Slot.vue'

describe('Clear and destroy callbacks works', () => {
   it('Clear', () => {
      cy.mount(Slot)

         .get('.Success')
         .click()
         .get('.ClearButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroy', () => {
      cy.mount(Slot)

         .get('.Success')
         .click()
         .get('.DestroyButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
