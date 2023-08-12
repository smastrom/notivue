import Notivue, { CyProps } from './components/Notivue.vue'

import { Classes } from '@/Notifications/constants'

it('All elements are accessible', () => {
   cy.mountNotifications({
      props: {
         options: {
            title: 'Success',
            message: 'This is a success message',
         },
      },
   })

      .get('.Success')
      .click()

   cy.injectAxe()
   cy.checkA11y(`.${Classes.NOTIFICATION}`)
})
