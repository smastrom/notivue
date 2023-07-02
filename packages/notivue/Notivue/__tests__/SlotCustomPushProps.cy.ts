import Notivue from './components/Notivue.vue'

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
      cy.mount(Notivue, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Error', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.Error')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Warning', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.Warning')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Info', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.Info')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Promise', () => {
      cy.mount(Notivue, ...componentConfig)

         .get('.Promise')
         .click()
         .checkSlotPropsAgainst(customProps)
   })
})
