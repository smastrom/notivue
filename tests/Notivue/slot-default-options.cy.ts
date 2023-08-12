import { defaultNotificationOptions as defaultOptions } from '@/core/options'
import { RESOLVE_REJECT_DELAY } from '@/support/utils'

describe('Default options match the slot content', () => {
   const { success, error, warning, info, promise } = defaultOptions

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mountNotivue()

            .get('.Success')
            .click()
            .checkSlotAgainst(success)
      })

      it('Error', () => {
         cy.mountNotivue()

            .get('.Error')
            .click()
            .checkSlotAgainst(error)
      })

      it('Warning', () => {
         cy.mountNotivue()

            .get('.Warning')
            .click()
            .checkSlotAgainst(warning)
      })

      it('Info', () => {
         cy.mountNotivue()

            .get('.Info')
            .click()
            .checkSlotAgainst(info)
      })

      it('Promise', () => {
         cy.mountNotivue()

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...promise, duration: null }) // Infinity is not valid
      })
   })

   describe('Promise - Resolve / Reject', () => {
      const promiseResolve = defaultOptions['promise-resolve']
      const promiseReject = defaultOptions['promise-reject']

      it('Promise - Resolve', () => {
         cy.mountNotivue()

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(promiseResolve)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue()
            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(promiseReject)
      })
   })
})
