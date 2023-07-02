import Notivue from './components/Notivue.vue'

const globalOptions = {
   title: 'TitleCustom',
   message: 'MessageCustom',
   duration: 1000,
   ariaLive: 'politeCustom' as any,
   ariaRole: 'statusCustom' as any,
   closeAriaLabel: 'CloseCustom',
} as const

const defaultOptions = {
   title: 'TitleDefault',
   message: 'MessageDefault',
   duration: 2000,
   ariaLive: 'politeDefault' as any,
   ariaRole: 'statusDefault' as any,
   closeAriaLabel: 'CloseDefault',
} as const

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
         },
      },
   }

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

describe('Push options have higher priority over globals', () => {
   const componentConfig = [
      { config: { notifications: globalOptions } },
      { props: { options: defaultOptions } } as any,
   ]

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
