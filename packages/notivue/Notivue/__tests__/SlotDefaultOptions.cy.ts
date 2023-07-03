import { defaultNotificationOptions as defaultOptions } from '@/core/options'
import { RESOLVE_REJECT_DELAY } from '../../cypress/support/utils'

import Notivue from './components/Notivue.vue'

describe('Default options match the slot content', () => {
   const { success, error, warning, info, promise } = defaultOptions

   describe('First-level notifications', () => {
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

   describe('Promise - Resolve / Reject', () => {
      const promiseResolve = defaultOptions['promise-resolve']
      const promiseReject = defaultOptions['promise-reject']

      it('Promise - Resolve', () => {
         cy.mount(Notivue)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for resolve
            .checkSlotAgainst(promiseResolve)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for reject
            .checkSlotAgainst(promiseReject)
      })
   })
})
