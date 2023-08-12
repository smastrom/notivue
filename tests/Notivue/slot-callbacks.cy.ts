describe('Clear and destroy callbacks work', () => {
   it('Clear', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .get('.ClearButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroy', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .get('.DestroyButton')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
