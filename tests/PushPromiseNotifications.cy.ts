import PushPromiseNotifications from './PushPromiseNotifications.vue'

it('Resolve - Updates notification', () => {
   cy.mount(PushPromiseNotifications)

   cy.get('.Resolve').click()

   cy.get('.Notivue__notification').should('have.have.attr', 'data-notivue', 'promise')
   cy.get('.Notivue__content-message').should('have.text', 'Loading')

   cy.get('.Notivue__notification').should('have.have.attr', 'data-notivue', 'promise-resolve')
   cy.get('.Notivue__content-message').should('have.text', 'Resolved')
})

it('Reject - Updates notification', () => {
   cy.mount(PushPromiseNotifications)

   cy.get('.Reject').click()

   cy.get('.Notivue__notification').should('have.have.attr', 'data-notivue', 'promise')
   cy.get('.Notivue__content-message').should('have.text', 'Loading')

   cy.get('.Notivue__notification').should('have.have.attr', 'data-notivue', 'promise-reject')
   cy.get('.Notivue__content-message').should('have.text', 'Rejected')
})
