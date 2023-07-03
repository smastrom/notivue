import { defaultConfig } from '@/core/config'

import Notivue from './components/Notivue.vue'

it('All elements should be accessible', () => {
   cy.mount(Notivue).clickRandomStatic()

   cy.injectAxe()
   cy.checkA11y('.Root')
})

it('All attributes are added properly', () => {
   const config = defaultConfig.notifications

   cy.mount(Notivue)

      .get('.Success')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.success.ariaLive)
      .should('have.attr', 'role', config.success.ariaRole)

      .get('.Error')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.error.ariaLive)
      .should('have.attr', 'role', config.error.ariaRole)

      .get('.Info')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.info.ariaLive)
      .should('have.attr', 'role', config.info.ariaRole)

      .get('.Warning')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.warning.ariaLive)
      .should('have.attr', 'role', config.warning.ariaRole)

      .get('.Promise')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.promise.ariaLive)
      .should('have.attr', 'role', config.promise.ariaRole)
})

describe('Aria live content', () => {
   it('Message is always renderd', () => {
      cy.mount(Notivue, {
         config: {
            notifications: {
               global: { message: 'This is a message' },
            },
         },
      })

         .clickRandomStatic()
         .getAriaLive()
         .should('have.text', 'This is a message')
   })

   it('Title is rendered along with the message if defined', () => {
      cy.mount(Notivue, {
         config: {
            notifications: {
               global: { title: 'This is a title', message: 'This is a message' },
            },
         },
      })

         .clickRandomStatic()
         .getAriaLive()
         .should('have.text', 'This is a title: This is a message')
   })
})
