import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'

const paddingLineBetweenStatements = stylistic.rules['padding-line-between-statements']
const sortImports = perfectionist.rules['sort-imports']

export default {
   meta: { name: 'stylistic' },
   rules: {
      'padding-line-between-statements': paddingLineBetweenStatements,
      'sort-imports': sortImports,
   },
}
