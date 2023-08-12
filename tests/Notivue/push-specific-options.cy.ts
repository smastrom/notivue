describe('Push-specific options', () => {
   it('Can push ariaLiveOnly notifications', () => {
      cy.mountNotivue()
         .get('.PushAriaLiveOnly')
         .click()

         .getNotifications()
         .should('have.length', 0, { timeout: 0 })

         .get('li > div')
         .should('have.length', 1)
         .and('have.text', 'Title: Message')
         .invoke('attr', 'role')
         .should('not.be.undefined')

         .get('li > div')
         .invoke('attr', 'aria-live')
         .should('not.be.undefined')

         .get('li > div')
         .invoke('attr', 'aria-atomic')
         .should('not.be.undefined')
   })

   it('Can push notifications that skip the queue', () => {
      cy.mountNotivue({ config: { enqueue: true, limit: 1 } })

      for (let i = 0; i < 10; i++) {
         cy.get('.PushSkipQueue').click()
      }

      cy.getNotifications().should('have.length', 10)
   })
})
