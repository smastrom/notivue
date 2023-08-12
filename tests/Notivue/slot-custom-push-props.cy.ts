import { RESOLVE_REJECT_DELAY, randomProps, randomProps2 } from '@/support/utils'

describe('Custom props match the slot content', () => {
   describe('First-level notifications', () => {
      const componentConf = {
         props: {
            options: { props: randomProps },
         },
      }

      it('Success', () => {
         cy.mountNotivue(componentConf)

            .get('.Success')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Error', () => {
         cy.mountNotivue(componentConf)

            .get('.Error')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Warning', () => {
         cy.mountNotivue(componentConf)

            .get('.Warning')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Info', () => {
         cy.mountNotivue(componentConf)

            .get('.Info')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })

      it('Promise', () => {
         cy.mountNotivue(componentConf)

            .get('.Promise')
            .click()
            .checkSlotPropsAgainst(randomProps)
      })
   })

   describe('Promise - Resolve / Reject', () => {
      const componentConf = {
         props: {
            options: { props: randomProps },
            // Pass new options to .resolve() and .reject()
            newOptions: { props: randomProps2 },
         },
      }

      it('Promise - Resolve', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndResolve')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for resolve
            .checkSlotPropsAgainst(randomProps2)
      })

      it('Promise - Reject', () => {
         cy.mountNotivue(componentConf)

            .get('.PushPromiseAndReject')
            .click()
            .wait(RESOLVE_REJECT_DELAY) // Wait for reject
            .checkSlotPropsAgainst(randomProps2)
      })
   })
})
