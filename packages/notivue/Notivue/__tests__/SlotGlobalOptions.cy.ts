import { getRandomOptions } from '../../cypress/support/utils'

import Notivue from './components/Notivue.vue'

const globalOptions = getRandomOptions()
const defaultOptions = getRandomOptions()
const newDefaultOptions = getRandomOptions()

describe('Global options have higher priority over defaults', () => {
   const customConfig = {
      config: {
         notifications: {
            global: globalOptions,

            success: defaultOptions,
            error: defaultOptions,
            warning: defaultOptions,
            info: defaultOptions,
            promise: defaultOptions,

            // Use different options since options should be different
            'promise-resolve': newDefaultOptions,
            'promise-reject': newDefaultOptions,
         },
      },
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
            options: defaultOptions,
            // Passed as new options to .resolve()  and .reject()
            newOptions: newDefaultOptions,
         },
      } as any,
   ]

   describe('First-level notifications', () => {
      it('Success', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Success')
            .click()
            .checkSlotAgainst(defaultOptions)
      })

      it('Error', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(defaultOptions)
      })

      it('Warning', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(defaultOptions)
      })

      it('Info', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(defaultOptions)
      })

      it('Promise', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst(defaultOptions)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      it('Promise - Resolve', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(1000) // Wait for resolve
            .checkSlotAgainst(newDefaultOptions)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(1000) // Wait for reject
            .checkSlotAgainst(newDefaultOptions)
      })
   })
})
