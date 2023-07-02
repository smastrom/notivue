import Notivue from './components/Notivue.vue'

import { lightTheme, darkTheme, pastelTheme, materialTheme, slateTheme } from 'notivue'
import { Classes } from '../constants'

describe('Themes', () => {
   it('All themes are injected properly', () => {
      ;[lightTheme, darkTheme, pastelTheme, materialTheme, slateTheme].forEach((theme) => {
         cy.mountAndCheckTheme(Notivue, theme)
      })
   })

   it('Light theme is applied by default', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()

         .get(`.${Classes.NOTIFICATION}`)
         .should('have.attr', 'style')

         .checkTheme(lightTheme)
   })
})
