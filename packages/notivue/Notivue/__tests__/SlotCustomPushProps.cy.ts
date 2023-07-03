import { RESOLVE_REJECT_DELAY, randomProps, randomProps2 } from '../../cypress/support/utils'

import Notivue from './components/Notivue.vue'

describe('Custom props match the slot content', () => {
   describe('First-level notifications', () => {
      const componentConfig = [
         { config: {} },
         {
            props: {
               options: { props: randomProps },
            },
         } as any,
      ]

      it('Success', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Success')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Error', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Error')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Warning', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Warning')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Info', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Info')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Promise', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.Promise')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      const newCustomProps = {
         isCustom: false,
         somethingNew: 'somethingNew',
         something: {
            value: 111,
            somethingElse: {
               name: 'somethingElseNew',
            },
         },
      }

      const componentConfig = [
         { config: {} },
         {
            props: {
               options: { props: randomProps },
               // Passed new options to .resolve() and .reject() to make sure they are updated
               newOptions: { props: randomProps2 },
            },
         } as any,
      ]

      it('Promise - Resolve', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for resolve
            .checkSlotPropsAgainst(randomProps2)
      })

      it('Promise - Reject', () => {
         cy.mount(Notivue, ...componentConfig)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for reject
            .checkSlotPropsAgainst(randomProps2)
      })
   })
})
