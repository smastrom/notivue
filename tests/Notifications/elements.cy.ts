import { NotivueIcons, outlinedIcons } from 'notivue'

import { Classes } from '@/Notifications/constants'

it('All elements are rendered and only exists one element per class', () => {
   cy.mountNotifications({
      options: {
         title: 'Success',
         message: 'This is a success message',
      },
   })

      .get('.Success')
      .click()

   Object.values(Classes).forEach((className) => {
      cy.get(`.${className}`).should('exist').and('have.length', 1)
   })
})

it('Title is not rendered by default (if empty string) while all other elements are', () => {
   cy.mountNotifications()

      .get('.Success')
      .click()

   Object.values(Classes).forEach((className) => {
      if (className === Classes.TITLE) {
         cy.get(`.${className}`).should('not.exist')
      } else {
         cy.get(`.${className}`).should('exist').and('have.length', 1)
      }
   })
})

function getIconConfig(iconObj: NotivueIcons) {
   return {
      icons: {
         ...outlinedIcons,
         ...iconObj,
      },
   }
}

describe('Icons', () => {
   it('Icon is not rendered if null', () => {
      cy.mountNotifications(getIconConfig({ success: null }))

         .get('.Success')
         .click()

         .get(`.${Classes.ICON}`)
         .should('not.exist')
   })

   it('Text icons are rendered properly', () => {
      cy.mountNotifications(getIconConfig({ success: 'SOMETEXT' }))

         .get('.Success')
         .click()

         .get(`.${Classes.ICON}`)
         .should('exist')
         .and('have.length', 1)
         .and('have.text', 'SOMETEXT')
         .and('have.prop', 'tagName')
         .and('eq', 'DIV')
   })
})

it('Close button is not render if null', () => {
   cy.mountNotifications(getIconConfig({ close: null }))

      .get('.Success')
      .click()

   cy.get(`.${Classes.CLOSE}`).should('not.exist')
   cy.get(`.${Classes.NOTIFICATION}`).should('not.contain', Classes.CLOSE_ICON)
})
