describe('Pause on focus', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Should pause when focusing a notification element and resume when focus leaves', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .wait(4000) // Remaining time 2000ms
         .get('.ClearButton')
         .first()
         .focus()
         .wait(4000) // Any value greater than the remaining time
         .get('.Notification')
         .should('exist')

         .get('.Success')
         .focus() // Move focus outside the stream
         .wait(2500)

         .get('.Notification')
         .should('not.exist')
   })

   it('Should not pause if focus moves between elements inside the stream', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .clickRandomStatic()
         .get('.ClearButton')
         .first()
         .focus()
         .wait(4000) // Paused
         .get('.ClearButton')
         .last()
         .focus() // Focus moves within stream — should stay paused
         .wait(4000)
         .get('.Notification')
         .should('exist')
   })

   it('Should resume when the last notification is dismissed while focused', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .clickRandomStatic()
         .get('.ClearButton')
         .first()
         .focus()
         .wait(4000) // Paused, remaining time on 2nd notification still > 0
         .get('.ClearButton')
         .first()
         .click() // Dismiss the focused notification, focus moves outside stream

         .wait(7000) // Wait for remaining notification to expire
         .get('.Notification')
         .should('not.exist')
   })
})
