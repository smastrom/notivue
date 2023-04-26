import AccessibilityVue from './Accessibility.vue'

function clickAll() {
   cy.get('.Success').click()
   cy.get('.Error').click()
   cy.get('.Info').click()
   cy.get('.Warning').click()
   cy.get('.Promise').click()
}

it('Should be axe-compliant', { browser: 'chrome' }, () => {
   cy.mount(AccessibilityVue)

   clickAll()

   cy.log('Axe is only supported in Chromium')
   cy.injectAxe()
   cy.checkA11y('.Notivue__root')
})

it('Should render aria live region correctly', () => {
   cy.mount(AccessibilityVue)

   clickAll()

   cy.get(`[data-notivue]`)
      .should('have.length', 5)
      .siblings('div')
      .then((div) => {
         expect(div.attr('role')?.length).to.be.greaterThan(4)
         expect(div.attr('aria-live')?.length).to.be.greaterThan(4)
      })
})
