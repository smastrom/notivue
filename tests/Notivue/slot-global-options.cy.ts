import { RESOLVE_REJECT_DELAY, getRandomOptions } from '@/support/utils'

const globalOptions = getRandomOptions()
const options = getRandomOptions()
const newOptions = getRandomOptions()

describe('Per-type options override global config', () => {
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
            .checkSlotAgainst(options)
      })

      it('Error', () => {
         cy.mountNotivue(customConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(options)
      })

      it('Warning', () => {
         cy.mountNotivue(customConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(options)
      })

      it('Info', () => {
         cy.mountNotivue(customConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(options)
      })

      it('Promise - Should not override duration', () => {
         cy.mountNotivue(customConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...options, duration: -1 })
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mountNotivue(customConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(newOptions)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue(customConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(newOptions)
      })
   })
})

describe('Push options have higher priority over config', () => {
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

      it('Promise - Besides duration', () => {
         cy.mountNotivue(componentConf)

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...options, duration: -1 })
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
