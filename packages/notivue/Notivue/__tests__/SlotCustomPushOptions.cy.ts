import Notivue from './components/Notivue.vue'

const config = {
   duration: 2000,
   title: 'ConfigTitle',
   message: 'ConfigMessage',
   ariaLive: 'assertiveConfig',
   ariaRole: 'alertConfig',
   closeAriaLabel: 'ConfigClose',
}

const options = {
   duration: 1000,
   title: 'CustomTitle',
   message: 'CustomMessage',
   ariaLive: 'assertiveCustom',
   ariaRole: 'alertCustom',
   closeAriaLabel: 'CustomClose',
}

describe('Push notification options have higher priority over config', () => {
   const componentConfig = [
      {
         config: {
            notifications: {
               success: config,
               error: config,
               warning: config,
               info: config,
               promise: config,
            },
         },
      },
      { props: { options } } as any,
   ]

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

describe('Push notification options are merged properly with config', () => {
   const someOptions = {
      ...options,
   } as Partial<typeof options>

   delete someOptions.duration
   delete someOptions.title
   delete someOptions.message

   const componentConfig = [
      {
         config: {
            notifications: {
               success: config,
               error: config,
               warning: config,
               info: config,
               promise: config,
            },
         },
      },
      { props: { options: someOptions } } as any,
   ]

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
