import Notivue from './components/Notivue.vue'

import { Classes } from '@/Notifications/constants'

it('All elements are accessible', () => {
   cy.mount(
      Notivue,
      { config: {} },
      {
         props: {
            options: {
               title: 'Success',
               message: 'This is a success message',
            },
         } as any,
      }
   )

      .get('.Success')
      .click()

   cy.injectAxe()
   cy.checkA11y(`.${Classes.NOTIFICATION}`)
})
