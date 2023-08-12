import type { VueWrapper } from '@vue/test-utils'

describe('Pause on touch', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Can pause and resume notifications', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')

         .get('.Notification')
         .should('not.exist')
   })

   it('Should not pause notifications if pauseOnTouch is false', () => {
      cy.mountNotivue({ config: { pauseOnTouch: false } })

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('not.exist')
   })

   it('Should update config dynamically and work', () => {
      cy.mountNotivue({ config: { pauseOnTouch: false } })

         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ pauseOnTouch: true }))

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')
   })
})
