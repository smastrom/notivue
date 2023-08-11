import { defaultConfig } from '@/core/config'

import Notivue from './components/Notivue.vue'

it('All elements should be accessible', () => {
   cy.mount(Notivue).clickRandomStatic()

   cy.injectAxe()
   cy.checkA11y('.Root')
})

describe('Aria label', () => {
   it('Message is always renderd', () => {
      cy.mount(Notivue, {
         config: {
            notifications: {
               global: { message: 'This is a message' },
            },
         },
      })

         .clickRandomStatic()
         .getContainer()
         .should('have.attr', 'aria-label', 'This is a message')
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
         .getContainer()
         .should('have.attr', 'aria-label', 'This is a title: This is a message')
   })
})
