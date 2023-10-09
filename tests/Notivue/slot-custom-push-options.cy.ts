import { RESOLVE_REJECT_DELAY, getRandomOptions } from '@/support/utils'

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
   const componentConf = { config: notivueConfig, props: { options } }

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
         .checkSlotAgainst({ ...options, duration: null })
   })

   it('Promise - Resolve', () => {
      cy.mountNotivue(componentConf)

         .get('.PushPromiseAndResolve')
         .click()
         .wait(RESOLVE_REJECT_DELAY)
         .checkSlotAgainst(options)
   })

   it('Promise - Reject', () => {
      cy.mountNotivue(componentConf)

         .get('.PushPromiseAndReject')
         .click()
         .wait(RESOLVE_REJECT_DELAY)
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

   const componentConf = {
      config: notivueConfig,
      props: {
         options: someOptions,
         // Passed to .resolve() and .reject() methods
         newOptions: someNewOptions,
      },
   } as any

   describe('First-level Notifications', () => {
      const expectedOptions = { ...config, ...someOptions }

      it('Success', () => {
         cy.mountNotivue(componentConf)

            .get('.Success')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Error', () => {
         cy.mountNotivue(componentConf)

            .get('.Error')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Warning', () => {
         cy.mountNotivue(componentConf)

            .get('.Warning')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Info', () => {
         cy.mountNotivue(componentConf)

            .get('.Info')
            .click()
            .checkSlotAgainst(expectedOptions)
      })

      it('Promise - Besides duration', () => {
         cy.mountNotivue(componentConf)

            .get('.Promise')
            .click()
            .checkSlotAgainst({ ...expectedOptions, duration: null })
      })
   })

   describe('Promise - Resolve / Reject', () => {
      const expectedOptions = { ...config, ...someNewOptions }

      it('Promise - Resolve', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(expectedOptions)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY)
            .checkSlotAgainst(expectedOptions)
      })
   })
})
