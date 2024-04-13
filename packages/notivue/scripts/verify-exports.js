import { exports } from '../shared/exports.js'
import * as index from '../dist/index.js'

const objExports = Object.values(exports).flat()
const jsExports = Object.keys(index)

if (objExports.length !== jsExports.length) {
   if (objExports.length < jsExports.length) {
      const missing = jsExports.filter((name) => !objExports.includes(name))
      throw new Error('Missing exports in shared/exports.js -> ' + missing.join(', '))
   } else {
      const missing = objExports.filter((name) => !jsExports.includes(name))
      throw new Error('Missing exports in dist/index.js -> ' + missing.join(', '))
   }
} else {
   let errors = ''

   const jsMissing = []
   const objMissing = []

   objExports.forEach((name) => {
      if (!jsExports.includes(name)) jsMissing.push(name)
   })

   jsExports.forEach((name) => {
      if (!objExports.includes(name)) objMissing.push(name)
   })

   if (jsMissing.length > 0) {
      errors += 'Inconsistent exports found in shared/exports.js -> ' + jsMissing.join(', ')
   }

   if (objMissing.length > 0) {
      errors += '\n' + 'Inconsistent exports found in dist/index.js -> ' + objMissing.join(', ')
   }

   if (errors) throw new Error(errors)
}

console.log('All exports are valid.')
