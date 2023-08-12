import type { NotivueConfig } from 'notivue'

import Notivue, { type CyNotivueSwipeProps } from '@/tests/NotivueSwipe/components/Notivue.vue'

import { DEFAULT_ENTER_LEAVE_ANIM_DURATION } from '@/support/utils'

type MountNotificationsOptions = { config?: NotivueConfig; props?: CyNotivueSwipeProps }

declare global {
   namespace Cypress {
      interface Chainable {
         mountSwipe(options?: MountNotificationsOptions): Chainable<any>
         pushSwipeSuccess(): Chainable<any>
      }
   }
}

Cypress.Commands.add(
   'mountSwipe',
   ({ config = {}, props = {} }: MountNotificationsOptions = { config: {}, props: {} }) => {
      cy.mount<CyNotivueSwipeProps>(Notivue, {
         config,
         props,
      })
   }
)

Cypress.Commands.add('pushSwipeSuccess', () =>
   cy.get('.Success').click().wait(DEFAULT_ENTER_LEAVE_ANIM_DURATION)
)
