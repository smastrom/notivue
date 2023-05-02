import PauseOnHover from './PauseOnHover.vue'

it('Can pause and resume notification', { browser: 'chrome' }, () => {
   cy.log('cypress-real-events is only supported in Chromium')

   cy.mount(PauseOnHover)

   cy.get('.Push').click()

   cy.get('.Notivue__notification').realMouseMove(50, 50, { position: 'center' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('exist')

   cy.get('body').realMouseMove(50, 50, { position: 'bottomRight' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('not.exist')
})
