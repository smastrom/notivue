import Slot from './components/Slot.vue'

it('All elements besides the slot should be accessible', () => {
   cy.mount(Slot)

   for (let i = 0; i < 10; i++) cy.get('.Success').click()

   cy.get('li > div > div:last-of-type')
      .should('have.length', 10)
      .should('have.attr', 'aria-live', 'polite')
      .and('have.attr', 'role', 'status')

   cy.injectAxe()
   cy.checkA11y('.Root')
})
