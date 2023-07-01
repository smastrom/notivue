import PauseOnHoverTouch from './PauseOnHoverTouch.vue'

it('Hover - Can pause and resume notification', { browser: ['chrome'] }, () => {
   cy.log('cypress-real-events is only supported in Chrome')

   cy.mount(PauseOnHoverTouch)

   cy.get('.Push').click()

   cy.get('.Notivue__notification').realMouseMove(50, 50, { position: 'center' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('exist')

   cy.get('body').realMouseMove(50, 50, { position: 'bottomRight' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('not.exist')
})

it('Touch - Can pause and resume notification', () => {
   cy.mount(PauseOnHoverTouch)

   cy.get('.Push').click()

   cy.get('.Notivue__content-message').trigger('pointerdown', { pointerType: 'touch' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('exist')

   cy.get('body').trigger('pointerdown', { pointerType: 'touch' })
   cy.wait(6000)
   cy.get('.Notivue__notification').should('not.exist')
})
