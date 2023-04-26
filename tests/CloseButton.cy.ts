import CloseButton from './CloseButton.vue'

it('Can dismiss notification', () => {
   cy.mount(CloseButton)

   cy.get('.Push').click()

   cy.get('.Notivue__notification').should('have.length', 1)

   cy.get('.Notivue__close').click()

   cy.get('.Notivue__notification').should('have.length', 0)
})
