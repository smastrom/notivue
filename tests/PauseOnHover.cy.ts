import PauseOnHover from './PauseOnHover.vue'

it('Can dismiss notification', { browser: 'chrome' }, () => {
   cy.mount(PauseOnHover)

   cy.get('.Push').click()

   cy.wait(6000)

   cy.get('.Notivue__notification').should('not.exist')

   cy.get('.Push').click()

   cy.log('realEvents is only supported in Chromium')

   cy.get('.Notivue__notification').realMouseMove(50, 50, { position: 'center' })

   cy.wait(6000)

   cy.get('.Notivue__notification').should('exist')
})
