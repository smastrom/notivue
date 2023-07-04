import { RESOLVE_REJECT_DELAY, getRandomOptions } from '../../cypress/support/utils'

import Notivue from './components/Notivue.vue'

const config = getRandomOptions()
const options = getRandomOptions()

const notivueConfig = {
   notifications: {
      success: config,
      error: config,
      warning: config,
      info: config,
      promise: config,
      'promise-resolve': config,
      'promise-reject': config,
   },
}

describe('Push notification options have higher priority over config', () => {
   const componentConfig = [{ config: notivueConfig }, { props: { options } } as any]

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

   it('Promise - Resolve', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.PushPromiseAndResolve')
         .click()
         .checkSlotAgainst(options)
   })

   it('Promise - Reject', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.PushPromiseAndReject')
         .click()
         .checkSlotAgainst(options)
   })
})

describe('Push notification options are merged properly with config', () => {
   const newOptions = getRandomOptions()

   // First-level notifications (success, error, warning, info, promise)
   const someOptions = {
      ...options,
   } as Partial<typeof options>

   delete someOptions.duration
   delete someOptions.title
   delete someOptions.message

   // Updating notifications (promise-resolve, promise-reject)
   const someNewOptions = {
      ...newOptions,
   } as Partial<typeof newOptions>

   delete someNewOptions.ariaLive
   delete someNewOptions.ariaRole

   const componentConfig = [
      { config: notivueConfig },
      {
         props: {
            options: someOptions,
            // Passed to .resolve() and .reject() methods
            newOptions: someNewOptions,
         },
      } as any,
   ]

   describe('First-level Notifications', () => {
      const expectedOptions = { ...config, ...someOptions }

      it('Success', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Success')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Error', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Error')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Warning', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Warning')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Info', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Info')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Promise', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Promise')
            .click()
            .checkSlotAgainst(expectedOptions)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      const expectedOptions = { ...config, ...someNewOptions }

      it('Promise - Resolve', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(expectedOptions)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(expectedOptions)
      })
   })
})
