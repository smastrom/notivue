import { NotivueIcons, outlinedIcons } from 'notivue'

import { Classes as _Classes } from '@/Notifications/constants'
import { DEFAULT_ANIM_DURATION } from '@/support/utils'

const { TRANSITION, ...Classes } = _Classes

const defaultClasses = Object.values(Classes).filter((className) => className !== Classes.DUPLICATE)

it('All elements are rendered and only exists one element per class', () => {
   cy.mountNotifications({
      options: {
         title: 'Success',
         message: 'This is a success message',
      },
   })

      .get('.Success')
      .click()

   defaultClasses.forEach((className) => {
      cy.get(`.${className}`).should('exist').and('have.length', 1)
   })
})

it('Duplicate class is added correctly', () => {
   cy.mountNotifications(undefined, {
      avoidDuplicates: true,
   })

      .get('.Success')
      .click()
      .wait(DEFAULT_ANIM_DURATION)
      .get('.Success')
      .click()

   cy.get(`.${Classes.DUPLICATE}`).should('exist').and('have.length', 1)
})

it('Title is not rendered by default (if empty string) while all other elements are', () => {
   cy.mountNotifications()

      .get('.Success')
      .click()

   defaultClasses.forEach((className) => {
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
