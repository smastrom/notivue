describe('Entering the stream', () => {
   it('Should not enter with CTRL+N if no candidates are available', () => {
      cy.mountKeyboard()

      for (let i = 0; i < 5; i++) {
         cy.pushUnqualified().as('relatedTarget')
      }

      cy.realPress(['ControlLeft', 'n'])

      cy.get('@relatedTarget')
         .should('be.focused')
         .get('.Notification')
         .first()
         .should('contain.text', 'No notifications to navigate')
   })

   it('If a new candidate is pushed, it should be focused if tab is pressed', () => {
      cy.mountKeyboard().pushCandidate()

      cy.realPress('Tab')

         .focused()
         .should('have.data', 'notivueContainer')
   })

   it('If an unqualified notification is pushed, it should not be focused if tab is pressed', () => {
      cy.mountKeyboard()
         .pushUnqualified()

         .realPress('Tab')

         .get('.Notification')
         .first()
         .should('not.be.focused')
   })

   it('If multiple new candidates are pushed, the most recent should be focused if tab is pressed', () => {
      cy.mountKeyboard()

      const limit = 10

      for (let i = 0; i < limit; i++) {
         cy.pushCandidate()
      }

      cy.window()
         .focus()
         .realPress('Tab')

         .focused()
         .should('have.data', 'notivueContainer', limit - 1)
   })

   it('If never navigated and unqualified are pushed after candidates, the first candidate should be focused once tab is pressed', () => {
      cy.mountKeyboard()

         .pushCandidate()
         .pushCandidate()
         .pushUnqualified()

         .realPress('Tab')

         .focused()
         .should('have.data', 'notivueContainer', 1) // Ids starts from 0
   })

   it('Should enter with CTRL+N', () => {
      cy.mountKeyboard()

         .pushCandidate()

         .realPress(['ControlLeft', 'n'])

         .focused()
         .should('have.data', 'notivueContainer', 0)
   })

   it.only('Should not enter with Tab if already navigated and no new candidates are available', () => {
      cy.mountKeyboard()

      for (let i = 0; i < 3; i++) {
         cy.pushCandidate().as('relatedTarget')
      }

      const allFocusable = 2 * 3 + 3

      for (let i = 0; i < allFocusable; i++) {
         cy.realPress('Tab')
      }

      cy.realPress('Tab') // Leave the stream
         .realPress('Tab') // Try to enter again

         .get('@relatedTarget')
         .should('be.focused')
   })
})
