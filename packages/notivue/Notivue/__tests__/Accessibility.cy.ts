import AccessibilityVue from './Accessibility.vue'

it('All elements besides slot should be accessible', () => {
   cy.mount(AccessibilityVue)

   for (let i = 0; i < 5; i++) cy.get('.Push').click()

   cy.get('li > div')
      .should('have.length', 5)
      .then((els) => {
         els.each((_, el) => {
            const ariaRegion = el.children[1]

            cy.wrap(ariaRegion).should('have.attr', 'aria-live', 'polite')
            cy.wrap(ariaRegion).should('have.attr', 'role', 'status')
         })
      })

   cy.injectAxe()
   cy.checkA11y('.Notivue__root')
})
