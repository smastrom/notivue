import Notivue from './components/Notivue.vue'

describe('Pause on focus', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Focus - Can pause and resume notifications', () => {
      cy.mount(Notivue)

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.ClearButton')
         .focus()
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')

         .get('.ClearButton')
         .blur()
         .wait(2000)

         .get('.Notification')
         .should('not.exist')
   })
})
