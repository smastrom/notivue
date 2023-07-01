import Push from './components/Push.vue'

it('All elements besides the slot should be accessible', () => {
   cy.mount(Push)

   for (let i = 0; i < 10; i++) cy.get('.Success').click()

   cy.get('li > div > div:last-of-type')
      .should('have.length', 10)
      .should('have.attr', 'aria-live', 'polite')
      .and('have.attr', 'role', 'status')

   // TODO: Check for any type of notification

   cy.injectAxe()
   cy.checkA11y('.Notivue__root')
})
