import { RESOLVE_REJECT_DELAY, getRandomOptions } from '@/support/utils'

const globalOptions = getRandomOptions()
const options = getRandomOptions()
const newOptions = getRandomOptions()

describe('Global options have higher priority over defaults', () => {
   const customConfig = {
      config: {
         notifications: {
            global: globalOptions,

            success: options,
            error: options,
            warning: options,
            info: options,
            promise: options,

            'promise-resolve': newOptions,
            'promise-reject': newOptions,
         },
      },
   }

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mountNotivue(customConfig)

            .get('.Success')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Error', () => {
         cy.mountNotivue(customConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Warning', () => {
         cy.mountNotivue(customConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Info', () => {
         cy.mountNotivue(customConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Promise - Should not override duration', () => {
         cy.mountNotivue(customConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...globalOptions, duration: null })
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mountNotivue(customConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(globalOptions)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue(customConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(globalOptions)
      })
   })
})

describe('Push options have higher priority over globals', () => {
   const componentConf = {
      config: { notifications: { global: globalOptions } },
      props: {
         options,
         // Passed as new options to .resolve()  and .reject()
         newOptions,
      },
   }

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mountNotivue(componentConf)

            .get('.Success')
            .click()
            .checkSlotAgainst(options)
      })

      it('Error', () => {
         cy.mountNotivue(componentConf)

            .get('.Error')
            .click()
            .checkSlotAgainst(options)
      })

      it('Warning', () => {
         cy.mountNotivue(componentConf)

            .get('.Warning')
            .click()
            .checkSlotAgainst(options)
      })

      it('Info', () => {
         cy.mountNotivue(componentConf)

            .get('.Info')
            .click()
            .checkSlotAgainst(options)
      })

      it('Promise', () => {
         cy.mountNotivue(componentConf)

            .get('.Promise')
            .click()
            .checkSlotAgainst(options)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(newOptions)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(newOptions)
      })
   })
})
