import { RESOLVE_REJECT_DELAY } from '@/support/utils'

import { DEFAULT_NOTIFICATION_OPTIONS as DEFAULT_OPTIONS } from '@/core/constants'

describe('Default options match the slot content', () => {
   const {
      global,
      success,
      error,
      warning,
      info,
      loading,
      'loading-success': loadingSuccess,
      'loading-error': loadingError,
   } = DEFAULT_OPTIONS as unknown as Record<keyof typeof DEFAULT_OPTIONS, Record<string, unknown>>

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mountNotivue()

            .get('.Success')
            .click()
            .checkSlotAgainst({ ...global, ...success })
      })

      it('Error', () => {
         cy.mountNotivue()

            .get('.Error')
            .click()
            .checkSlotAgainst({ ...global, ...error })
      })

      it('Warning', () => {
         cy.mountNotivue()

            .get('.Warning')
            .click()
            .checkSlotAgainst({ ...global, ...warning })
      })

      it('Info', () => {
         cy.mountNotivue()

            .get('.Info')
            .click()
            .checkSlotAgainst({ ...global, ...info })
      })

      it('Promise', () => {
         cy.mountNotivue()

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...global, ...loading, duration: -1 })
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mountNotivue()

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst({ ...global, ...loadingSuccess })
      })

      it('Promise - Reject', () => {
         cy.mountNotivue()
            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst({ ...global, ...loadingError })
      })
   })
})
