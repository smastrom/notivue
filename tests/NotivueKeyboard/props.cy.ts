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

   it('Should be enter/exit with a custom combo key', () => {
      cy.mountKeyboard({
         comboKey: 'u',
      })
         .pushCandidate()
         .as('relatedTarget')

         .realPress(['ControlLeft', 'u'])

         .focused()
         .should('have.data', 'notivueContainer', 0)

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
})
