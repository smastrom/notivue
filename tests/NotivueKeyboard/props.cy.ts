import { DEFAULT_DURATION } from '@/core/constants'

describe('Props', () => {
   it('Should apply custom leave messages', () => {
      cy.mountKeyboard({
         leaveMessage: 'Leaving!',
         emptyMessage: "There's nothing here!",
         renderAnnouncement: true,
      })
         .pushCandidate()

         .realPress('Tab')
         .realPress('Escape')

         .get('.Notification')
         .first()
         .should('contain.text', 'Leaving!')

         .wait(DEFAULT_DURATION)

         .realPress(['ControlLeft', 'N'])

         .get('.Notification')
         .first()
         .should('contain.text', "There's nothing here!")
   })

   it('Should enter/exit with a custom combo key', () => {
      cy.mountKeyboard({
         comboKey: 'u',
      })
         .pushCandidate()
         .as('relatedTarget')

         .realPress(['ControlLeft', 'u'])

         .focused()
         .should('have.data', 'notivueListItem', 0)

         .realPress(['ControlLeft', 'u'])

         .get('@relatedTarget')
         .should('be.focused')
   })

   it('Should not focus next element if `handleClicks` is false', () => {
      cy.mountKeyboard({ handleClicks: false })
         .pushCandidate()
         .pushCandidate()

         .realPress('Tab')
         .realPress('Tab')
         .realPress('Tab')

         .realPress(Math.random() > 0.5 ? 'Space' : 'Enter')

         .get('.Candidate')
         .should('not.be.focused')
   })

   it('Should not render notification if `renderAnnouncement` is false', () => {
      cy.mountKeyboard({ renderAnnouncement: false })
         .pushCandidate()

         .realPress('Tab')
         .realPress('Escape')

         .get('.Notification')
         .should('have.length', 0)
   })

   it('Should treat focusable children as candidates even when isCandidate returns false', () => {
      cy.mountKeyboard({ isCandidate: () => false })
         .pushCandidate()

         .realPress('Tab')

         .focused()
         .should('have.data', 'notivueListItem')
   })

   it('Should qualify list items via isCandidate when they have no focusable children', () => {
      cy.mountKeyboard({ isCandidate: () => true })
         .pushUnqualified()

         .realPress('Tab')

         .focused()
         .should('have.data', 'notivueListItem')
   })

   it('Should pass list items to isCandidate', () => {
      const isCandidate = cy.stub().returns(false)

      cy.mountKeyboard({ isCandidate })
         .pushUnqualified()
         .then(() => {
            expect(isCandidate).to.have.been.calledOnce

            const el = isCandidate.firstCall.args[0] as HTMLElement

            expect(el.dataset.notivueListItem).to.exist
            expect(el.hasAttribute('data-notivue-item')).to.be.false
         })
   })

   it('Should customize max number of leave announcements', () => {
      cy.mountKeyboard({ maxAnnouncements: 1 })
         .pushCandidate()
         .pushCandidate()

         .realPress('Tab')
         .realPress('Escape')

         .realPress(['ControlLeft', 'N'])
         .realPress('Tab')
         .realPress('Escape')

         .get('.Notification')
         .should('contain.text', 'You left the notifications stream')
         .should('have.length', 1)
   })
})
