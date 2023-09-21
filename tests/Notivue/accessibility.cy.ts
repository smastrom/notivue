it('All elements should be accessible', () => {
   cy.mountNotivue().clickRandomStatic()

   cy.injectAxe({ axeCorePath: '../node_modules/axe-core/axe.min.js' })
   cy.checkA11y('.Root')
})

describe('Aria label', () => {
   it('Message is always renderd', () => {
      cy.mountNotivue({
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
      cy.mountNotivue({
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
