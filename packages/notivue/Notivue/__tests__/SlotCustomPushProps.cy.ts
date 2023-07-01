import Push from './components/Push.vue'

const customProps = {
   isCustom: true,
   something: {
      name: 'something',
      value: 333,
      somethingElse: {
         name: 'somethingElse',
      },
   },
}

describe('Custom props match the slot content', () => {
   const componentConfig = [{ config: {} }, { props: { options: { props: customProps } } } as any]

   it('Success', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Error', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Error')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Warning', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Warning')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Info', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Info')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Promise', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Promise')
         .click()
         .checkSlotPropsAgainst(customProps)
   })
})
