import { defaultNotificationOptions } from '@/core/options'

import Notivue from './components/Notivue.vue'

describe('Default options match the slot content', () => {
   const { success, error, warning, info, promise } = defaultNotificationOptions

   it('Success', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()
         .checkSlotAgainst(success)
   })

   it('Error', () => {
      cy.mount(Notivue)

         .get('.Error')
         .click()
         .checkSlotAgainst(error)
   })

   it('Warning', () => {
      cy.mount(Notivue)

         .get('.Warning')
         .click()
         .checkSlotAgainst(warning)
   })

   it('Info', () => {
      cy.mount(Notivue)

         .get('.Info')
         .click()
         .checkSlotAgainst(info)
   })

   it('Promise', () => {
      cy.mount(Notivue)

         .get('.Promise')
         .click()
         .checkSlotAgainst({ ...promise, duration: null }) // Infinity is not valid
   })
})
