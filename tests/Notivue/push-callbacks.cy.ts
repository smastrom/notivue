import { DEFAULT_DURATION } from '@/core/constants'

describe('Push callbacks', () => {
   it('onAutoClear is only called on auto clear', () => {
      cy.mountNotivue()
         .get('.PushWithAutoClearCallback')
         .click()
         .wait(DEFAULT_DURATION)

         .get('.PushWithAutoClearCallback')
         .should('have.text', '6')

         .get('.PushWithManualClearCallback')
         .should('have.text', '0')
   })

   it('onManualClear is only called on manual clear', () => {
      cy.mountNotivue()
         .get('.PushWithManualClearCallback')
         .click()

         .get('.PushWithAutoClearCallback')
         .should('have.text', '0')

         .get('.PushWithManualClearCallback')
         .should('have.text', '6')
   })
})
