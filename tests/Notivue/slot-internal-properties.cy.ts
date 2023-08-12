import { parseText } from '@/support/utils'
import { hiddenInternalKeys } from '@/Notivue/utils'

import Notivue from './components/Notivue.vue'

it('Hidden internal properties are never defined', () => {
   cy.mount(Notivue)

      .clickRandomStatic()
      .getNotifications()
      .then((el) => expect(parseText(el)).to.not.have.keys(hiddenInternalKeys))
})

it('Exposed internal properties are always defined', () => {
   cy.mount(Notivue)

      .clickRandomStatic()
      .getNotifications()
      .then((el) => {
         expect(parseText(el)).to.include.keys(['id', 'type', 'createdAt'])

         expect(parseText(el).id).to.be.a('string').and.to.have.length.greaterThan(0)
         expect(parseText(el).type).to.be.a('string').and.to.have.length.greaterThan(0)
         expect(parseText(el).createdAt).to.be.a('number').and.to.be.greaterThan(0)
      })
})
