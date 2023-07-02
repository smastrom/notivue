import { defaultNotificationOptions } from '@/core/options'

import Slot from './components/Slot.vue'

describe('Default options match the slot content', () => {
   const { success, error, warning, info, promise } = defaultNotificationOptions

   it('Success', () => {
      cy.mount(Slot)

         .get('.Success')
         .click()
         .checkSlotAgainst(success)
   })

   it('Error', () => {
      cy.mount(Slot)

         .get('.Error')
         .click()
         .checkSlotAgainst(error)
   })

   it('Warning', () => {
      cy.mount(Slot)

         .get('.Warning')
         .click()
         .checkSlotAgainst(warning)
   })

   it('Info', () => {
      cy.mount(Slot)

         .get('.Info')
         .click()
         .checkSlotAgainst(info)
   })

   it('Promise', () => {
      cy.mount(Slot)

         .get('.Promise')
         .click()
         .checkSlotAgainst({ ...promise, duration: null }) // Infinity is not valid
   })
})
