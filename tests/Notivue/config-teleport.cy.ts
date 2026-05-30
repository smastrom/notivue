import NotivueImpl from '@/Notivue/NotivueImpl.vue'

import type { App } from 'vue'

import { mount } from 'cypress/vue'
import { type NotivueConfig, type Notify } from 'notivue'

import { createProvides } from '@/core/createNotivue'
import { notivueInjectionKey, notivueInstanceInjectionKey } from '@/core/symbols'

const listSelector = '[data-notivue-list]'

function mountRoot(config: NotivueConfig = {}, props = {}) {
   const { store, instance, notify } = createProvides(true, config)

   return mount(
      NotivueImpl as any,
      {
         global: {
            plugins: [
               {
                  install(app: App) {
                     app.provide(notivueInstanceInjectionKey, instance)
                     app.provide(notivueInjectionKey, store)
                  },
               },
            ],
         },
         props: { class: 'Root', ...props },
         slots: {
            default: () => null,
         },
      } as any
   ).then((result) => ({ ...result, notify }))
}

function pushNotification(notify: Notify) {
   notify.success({ message: 'test' })
}

describe('Teleport', () => {
   it('By default is teleported to body', () => {
      mountRoot().then(({ notify }) => pushNotification(notify))

      cy.get(`body > ${listSelector}`).should('exist')
   })

   it('Can teleport to different element', () => {
      mountRoot({ teleportTo: 'html' }).then(({ notify }) => pushNotification(notify))

      cy.get(`body > ${listSelector}`).should('not.exist')
      cy.get(`html > ${listSelector}`).should('exist')
   })

   it('Can teleport to custom HTMLElement', () => {
      cy.document()
         .then((doc) => {
            const teleportTo = doc.createElement('div')

            teleportTo.id = 'teleport'

            doc.body.appendChild(teleportTo)

            return mountRoot({ teleportTo })
         })
         .then(({ notify }) => pushNotification(notify))

      cy.get(`body > ${listSelector}`).should('not.exist')
      cy.get(`#teleport > ${listSelector}`).should('exist')
   })

   it('Can update teleport config dynamically', () => {
      mountRoot().then(({ wrapper, notify }) => {
         return wrapper.setProps({ teleportTo: 'html' }).then(() => pushNotification(notify))
      })

      cy.get(`body > ${listSelector}`).should('not.exist')
      cy.get(`html > ${listSelector}`).should('exist')
   })

   it('Prop takes priority over config teleportTo', () => {
      mountRoot({ teleportTo: 'body' }, { teleportTo: 'html' }).then(({ notify }) =>
         pushNotification(notify)
      )

      cy.get(`body > ${listSelector}`).should('not.exist')
      cy.get(`html > ${listSelector}`).should('exist')
   })
})
