import PushCoreNotifications from './PushCoreNotifications.vue'

it('Can push success', () => {
   cy.mount(PushCoreNotifications)

   for (let i = 0; i < 20; i++) {
      cy.get('.Success').click()
   }

   cy.get('.Notivue__notification').should('have.length', 20)
})

it('Can push error', () => {
   cy.mount(PushCoreNotifications)

   for (let i = 0; i < 20; i++) {
      cy.get('.Error').click()
   }

   cy.get('.Notivue__notification').should('have.length', 20)
})

it('Can push info', () => {
   cy.mount(PushCoreNotifications)

   for (let i = 0; i < 20; i++) {
      cy.get('.Info').click()
   }

   cy.get('.Notivue__notification').should('have.length', 20)
})

it('Can push warning', () => {
   cy.mount(PushCoreNotifications)

   for (let i = 0; i < 20; i++) {
      cy.get('.Warning').click()
   }

   cy.get('.Notivue__notification').should('have.length', 20)
})
