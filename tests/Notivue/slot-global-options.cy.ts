import { RESOLVE_REJECT_DELAY, getRandomOptions } from '@/support/utils'

import Notivue from './components/Notivue.vue'

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

            // Use different options since options should be different
            'promise-resolve': newOptions,
            'promise-reject': newOptions,
         },
      } as any,
   }

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mount(Notivue, customConfig)

            .get('.Success')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Error', () => {
         cy.mount(Notivue, customConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Warning', () => {
         cy.mount(Notivue, customConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Info', () => {
         cy.mount(Notivue, customConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(globalOptions)
      })

      it('Promise', () => {
         cy.mount(Notivue, customConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst(globalOptions)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mount(Notivue, customConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(1000) // Wait for resolve
            .checkSlotAgainst(globalOptions)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue, customConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(1000) // Wait for reject
            .checkSlotAgainst(globalOptions)
      })
   })
})

describe('Push options have higher priority over globals', () => {
   const componentConfig = [
      { config: { notifications: globalOptions } },
      {
         props: {
            options,
            // Passed as new options to .resolve()  and .reject()
            newOptions,
         },
      } as any,
   ]

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Success')
            .click()
            .checkSlotAgainst(options)
      })

      it('Error', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(options)
      })

      it('Warning', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(options)
      })

      it('Info', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(options)
      })

      it('Promise', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst(options)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for resolve
            .checkSlotAgainst(newOptions)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for reject
            .checkSlotAgainst(newOptions)
      })
   })
})
