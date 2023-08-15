describe('Leaving the stream', () => {
   it('Should be able to leave with CTRL+N', () => {
      cy.mountKeyboard()
         .pushCandidate()
         .as('relatedTarget')

         .realPress('Tab')

         .realPress(['ControlLeft', 'n'])

         .get('@relatedTarget')
         .should('be.focused')
         .checkLeaveAnnouncement()
   })

   it('Should be able to leave if pressing SHIFT+TAB on first candidate', () => {
      cy.mountKeyboard()
         .pushCandidate()
         .as('relatedTarget')

         .realPress('Tab')

         .realPress(['Shift', 'Tab'])

         .get('@relatedTarget')
         .should('be.focused')
         .checkLeaveAnnouncement()
   })

   it('Should be able to navigate any element and leave if pressing TAB on last candidate', () => {
      cy.mountKeyboard()

      for (let i = 0; i < 3; i++) {
         cy.pushCandidate().as('relatedTarget')
      }

      const allFocusable = 2 * 3 + 3

      for (let i = 0; i < allFocusable; i++) {
         cy.realPress('Tab') // Go to last focusable element
      }

      cy.realPress('Tab') // Leave the stream

         .get('@relatedTarget')
         .should('be.focused')
         .checkLeaveAnnouncement()
   })

   it('Should be able to leave with Escape', () => {
      cy.mountKeyboard()
         .pushCandidate()
         .as('relatedTarget')

         .realPress('Tab')

         .realPress('Escape')

         .get('@relatedTarget')
         .should('be.focused')
         .checkLeaveAnnouncement()
   })

   it('Should be able to leave if clicking outside the stream', () => {
      cy.mountKeyboard()
         .pushCandidate()
         .as('relatedTarget')

         .realPress('Tab')

         .get('body')
         .realClick({ position: 'bottomRight' })

         .get('@relatedTarget')
         .should('be.focused')
         .checkLeaveAnnouncement()
   })
})
