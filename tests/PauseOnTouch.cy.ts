import PauseOnTouch from './PauseOnHover.vue'

it('Can pause and resume notification', { browser: ['chromium', 'firefox'] }, () => {
   cy.mount(PauseOnTouch)

   cy.get('.Push').click()

   cy.get('.Notivue__content-message').trigger('pointerdown', { pointerType: 'touch' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('exist')

   cy.get('body').trigger('pointerdown', { pointerType: 'touch' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('not.exist')
})
