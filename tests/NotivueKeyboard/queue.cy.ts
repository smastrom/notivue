describe('Queue', () => {
   it('Should focus new candidate from the queue once dismissed', () => {
      cy.mountKeyboard({ enqueue: true, limit: 1 })

         .pushCandidate()
         .pushCandidate()

         .realPress('Tab')
         .realPress('Tab')
         .realPress('Space') // Dismiss first candidate (id: 0)

         .focused()
         .and('have.data', 'notivueContainer', 1)
   })

   it('Should focus first candidate available if unqualified is pushed from the queue', () => {
      cy.mountKeyboard({ enqueue: true, limit: 2 })

         .pushCandidate()
         .pushCandidate()
         .pushUnqualified()

         .realPress('Tab')
         .realPress('Tab')
         .realPress('Space') // Dismiss last candidate (id: 1)

         .focused()
         .and('have.data', 'notivueContainer', 0)
   })

   it('Should leave the stream if unqualified is pushed and no candidates are available', () => {
      cy.mountKeyboard({ enqueue: true, limit: 1 })

         .pushCandidate()
         .pushUnqualified()
         .as('relatedTarget')

         .realPress('Tab')
         .realPress('Tab')
         .realPress('Space')

      cy.get('@relatedTarget').should('be.focused').checkLeaveAnnouncement()
   })
})
