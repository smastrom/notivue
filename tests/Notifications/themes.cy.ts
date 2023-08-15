import { lightTheme, darkTheme, pastelTheme, materialTheme, slateTheme } from 'notivue'
import { Classes } from '@/Notifications/constants'

describe('Themes', () => {
   it('All themes are injected properly', () => {
      ;[lightTheme, darkTheme, pastelTheme, materialTheme, slateTheme].forEach((theme) => {
         cy.mountAndCheckTheme(theme)
      })
   })

   it('Light theme is applied by default', () => {
      cy.mountNotifications()

         .get('.Success')
         .click()

         .get(`.${Classes.NOTIFICATION}`)
         .should('have.attr', 'style')

         .checkTheme(lightTheme)
   })
})
