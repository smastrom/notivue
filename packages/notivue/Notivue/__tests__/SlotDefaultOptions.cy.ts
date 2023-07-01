import { defaultNotificationOptions } from '@/core/options'

import Push from './components/Push.vue'

describe('Default options match the slot content', () => {
   const { success, error, warning, info, promise } = defaultNotificationOptions

   it('Success', () => {
      cy.mount(Push)

         .get('.Success')
         .click()
         .checkSlotAgainst(success)
   })

   it('Error', () => {
      cy.mount(Push)

         .get('.Error')
         .click()
         .checkSlotAgainst(error)
   })

   it('Warning', () => {
      cy.mount(Push)

         .get('.Warning')
         .click()
         .checkSlotAgainst(warning)
   })

   it('Info', () => {
      cy.mount(Push)

         .get('.Info')
         .click()
         .checkSlotAgainst(info)
   })

   it('Promise', () => {
      cy.mount(Push)

         .get('.Promise')
         .click()
         .checkSlotAgainst({ ...promise, duration: null }) // Infinity is not valid
   })
})
